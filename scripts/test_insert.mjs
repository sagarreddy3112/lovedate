import { createClient } from '@supabase/supabase-js';

const url = 'https://zvtmpnzmgxqbasnasadi.supabase.co';
const key = 'sb_publishable_4_xYUicBwA_lJlK9ryLx5g_4ayYclC0';

const supabase = createClient(url, key);

async function run() {
  const payload = {
    invite_name: 'Test Script',
    date: '2026-08-29',
    food: 'Italian',
    restaurant: 'Cozy',
    area: 'Anywhere'
  };

  const { data, error } = await supabase.from('date_responses').insert([payload]);

  console.log('error:', error);
  console.log('data:', data);
}

run().catch((err) => console.error(err));
