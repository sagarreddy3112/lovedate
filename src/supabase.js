import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — returning a stub supabase client. Create a .env with the keys to enable Supabase."
  );

  const missingError = new Error(
    "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Configure .env and restart dev server."
  );

  const makeFrom = () => ({
    select: () => ({
      eq: () => ({
        limit: () => ({
          maybeSingle: async () => ({ data: null, error: missingError })
        })
      }),
      maybeSingle: async () => ({ data: null, error: missingError })
    }),
    insert: async () => ({ error: missingError })
  });

  supabase = {
    from: (/* table */) => makeFrom()
  };

} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };