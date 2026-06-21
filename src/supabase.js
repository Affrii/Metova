import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://azbyrompqrpigtraeggo.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6Ynlyb21wcXJwaWd0cmFlZ2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDQ0MzMsImV4cCI6MjA5NDUyMDQzM30.yPPtOkJ3WymR8QqeGzYCDJnJKO3E3Xu6qczhay-tSy0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})