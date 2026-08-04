import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://sgwgnysdejtobrbcglke.supabase.co";
const supabaseKey = "sb_publishable_ah6iNOPj5d1wdOveSypkhg_XnbIlIJ3";

export const supabase = createClient(supabaseUrl, supabaseKey);
