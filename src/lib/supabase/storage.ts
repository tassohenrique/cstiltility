import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadImage(
  supabase: SupabaseClient,
  file: File | null,
  folder: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type });

  if (error) {
    throw new Error(`Falha ao enviar imagem: ${error.message}`);
  }

  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

const PUBLIC_URL_MARKER = "/storage/v1/object/public/media/";

export async function deleteImage(
  supabase: SupabaseClient,
  imageUrl: string | null,
): Promise<void> {
  if (!imageUrl) return;

  const markerIndex = imageUrl.indexOf(PUBLIC_URL_MARKER);
  if (markerIndex === -1) return;

  const path = imageUrl.slice(markerIndex + PUBLIC_URL_MARKER.length);
  await supabase.storage.from("media").remove([path]);
}
