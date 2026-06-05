/* settings.js — shared site settings.

   Web3Forms access key, registered to hi@augustblu.com. Used by the Demos
   listener email gate (and any future forms). Replace via web3forms.com. */
export const WEB3FORMS_ACCESS_KEY = "d1897c38-da28-4b78-bdb8-ceb30c74ccc5";

/* Supabase — backs the moderated message wall in Freebies.
   Visitors INSERT a pending message; the wall reads only approved rows.
   Paste your project URL + anon (public) key from Supabase → Settings → API.
   The anon key is safe to ship publicly — Row-Level Security protects the data. */
export const SUPABASE_URL = "https://aoeydobhynybwcskloea.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_N8lRKUKiIcYYIKs8mhFuqA_fhQj-mtc";
