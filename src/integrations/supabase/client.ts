import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://nfbvxtbvvxbccnpiqvym.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mYnZ4dGJ2dnhiY2NucGlxdnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MTQ5NDcsImV4cCI6MjA2ODk5MDk0N30.iJQ_dQnYBLpiQpb_58KFCQLZznRqq8GwROEAO_B9E3Q"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)