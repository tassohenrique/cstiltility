"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBanner(formData: FormData) {
  const supabase = await createClient();

  await supabase.from("banners").insert({
    title: String(formData.get("title") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim(),
    cta_text: String(formData.get("cta_text") ?? "") || null,
    cta_link: String(formData.get("cta_link") ?? "") || null,
    active: formData.get("active") === "on",
    order: Number(formData.get("order") ?? 0),
  });

  revalidatePath("/admin/banners");
}

export async function updateBanner(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  await supabase
    .from("banners")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      image_url: String(formData.get("image_url") ?? "").trim(),
      cta_text: String(formData.get("cta_text") ?? "") || null,
      cta_link: String(formData.get("cta_link") ?? "") || null,
      active: formData.get("active") === "on",
      order: Number(formData.get("order") ?? 0),
    })
    .eq("id", id);

  revalidatePath("/admin/banners");
}

export async function deleteBanner(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  await supabase.from("banners").delete().eq("id", id);

  revalidatePath("/admin/banners");
}
