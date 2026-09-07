const SUPABASE_URL = "https://sodlkrpvairmujaifwpe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rHMukuN9IySU4WCkJ6_VBQ_oB13h29P";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase client initialized:", supabaseClient);