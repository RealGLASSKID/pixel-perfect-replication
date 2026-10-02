import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = { user: User | null; isAdmin: boolean; loading: boolean };
const Ctx = createContext<AuthCtx>({ user: null, isAdmin: false, loading: true });

async function checkAdmin(userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  return !!data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthCtx>({ user: null, isAdmin: false, loading: true });

  useEffect(() => {
    const apply = async (user: User | null) => {
      const isAdmin = user ? await checkAdmin(user.id) : false;
      setState({ user, isAdmin, loading: false });
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => apply(session?.user ?? null), 0);
    });
    supabase.auth.getSession().then(({ data }) => apply(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
export { checkAdmin };
