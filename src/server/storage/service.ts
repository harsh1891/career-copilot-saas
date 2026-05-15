import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Supabase storage is not configured");
    supabase = createClient(url, key);
  }

  return supabase;
}

export async function uploadBuffer(key: string, body: Buffer, contentType: string) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "career-assets";
  const { error } = await getSupabase().storage.from(bucket).upload(key, body, {
    contentType,
    upsert: true
  });

  if (error) throw error;
  return key;
}

export async function createSignedUrl(key: string, expiresIn = 60 * 60) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "career-assets";
  const { data, error } = await getSupabase().storage.from(bucket).createSignedUrl(key, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
