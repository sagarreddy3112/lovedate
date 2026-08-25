import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://zvtmpnzmgxqbasnasadi.supabase.co";

const supabasePublishableKey =
  "sb_publishable_4_xYUicBwA_lJlK9ryLx5g_4ayYclC0";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);