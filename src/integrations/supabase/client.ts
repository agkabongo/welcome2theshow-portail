// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oswbmvresufxdewmjlvv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zd2JtdnJlc3VmeGRld21qbHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MjU5MzQsImV4cCI6MjA1NzMwMTkzNH0.pFYvFPMd5Vq0oWTUuOz6FVrW3IeG3m_oWQY9SbBTxyY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);