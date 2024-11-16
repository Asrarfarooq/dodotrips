import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://knbtmfukbyeicuomcvub.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuYnRtZnVrYnllaWN1b21jdnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyOTQ1MDMsImV4cCI6MjA0Njg3MDUwM30.hQj9wkKnQ-CMSN1jslzoNHY5nMYROOAQfHnfJVnumzw'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})