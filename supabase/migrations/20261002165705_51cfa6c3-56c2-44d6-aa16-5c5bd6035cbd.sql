CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  delivery_preference text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Other',
  gender text NOT NULL DEFAULT 'unisex',
  sizes text[] NOT NULL DEFAULT '{}',
  colors text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  stock integer NOT NULL DEFAULT 0,
  min_order_qty integer NOT NULL DEFAULT 1,
  price_ngn numeric NOT NULL DEFAULT 0,
  price_usd numeric NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products public read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  delivery_preference text NOT NULL,
  address text NOT NULL DEFAULT '',
  notes text,
  items jsonb NOT NULL DEFAULT '[]',
  total_ngn numeric NOT NULL DEFAULT 0,
  total_usd numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own or admin" ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Create own order" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'Pending');
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp_number text NOT NULL DEFAULT '2348000000000',
  exchange_rate numeric NOT NULL DEFAULT 1500,
  delivery_info text NOT NULL DEFAULT '',
  banner_title text NOT NULL DEFAULT 'Built Different.',
  banner_subtitle text NOT NULL DEFAULT '',
  banner_image text
);
GRANT SELECT ON public.settings TO anon;
GRANT SELECT, UPDATE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings public read" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update settings" ON public.settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

INSERT INTO public.settings (id, delivery_info, banner_title, banner_subtitle) VALUES (1,
 'Waybill: We send to any state in Nigeria via trusted park/logistics partners. Waybill fee is paid by the customer on pickup.' || E'\n' || 'Pick-up: Collect your order in person at our Lagos workshop after confirmation.' || E'\n' || 'Other: Chat with us on WhatsApp to arrange a custom delivery option.',
 'Built Different.',
 'Trendy streetwear straight from the manufacturer. Wholesale prices for resellers across Nigeria.');

INSERT INTO public.products (name, description, category, gender, sizes, colors, images, stock, min_order_qty, price_ngn, price_usd, featured) VALUES
('Heavyweight Oversized Hoodie','480gsm cotton fleece, dropped shoulders and a relaxed oversized fit. Our best seller.','Hoodies','unisex','{S,M,L,XL,XXL}','{Charcoal,Black,Off-White}','{/images/hoodie.jpg}',240,6,9500,7,true),
('Wide Leg Baggy Jeans','Rigid washed denim with an extra-wide leg and stacked hem.','Baggy','men','{28,30,32,34,36}','{Washed Black,Light Blue}','{/images/baggy-jeans.jpg}',180,6,11000,8,true),
('Women''s Cargo Two-Piece','Cropped zip top with matching parachute cargo pants.','Women','women','{S,M,L,XL}','{Charcoal,Sand}','{/images/women-set.jpg}',120,4,14500,10,true),
('Essential Pullover Hoodie','Midweight everyday hoodie with kangaroo pocket.','Hoodies','men','{M,L,XL,XXL}','{Grey,Black}','{/images/hoodie.jpg}',300,10,7000,5,false),
('Baggy Cargo Jeans','Loose cargo denim with utility pockets.','Baggy','women','{26,28,30,32}','{Black,Grey}','{/images/baggy-jeans.jpg}',150,6,10500,7.5,true),
('Streetwear Co-ord Set','Boxy tee and wide pant set for everyday flex.','Men','men','{S,M,L,XL}','{Charcoal,White}','{/images/women-set.jpg}',90,4,13000,9,false);