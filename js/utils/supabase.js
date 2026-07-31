import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://migenqwkptawifmbnxrf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-ikThAr-7OS0m0U041NlRQ_4q3vEcjN';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
