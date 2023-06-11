import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtTimeOut = process.env.JWT_TIMEOUT;
const jwtSecret = process.env.JWT_SECRET;


export const supabase = createClient(supabaseUrl, supabaseKey, serviceRoleKey,jwtTimeOut,jwtSecret);