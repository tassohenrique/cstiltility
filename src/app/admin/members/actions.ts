"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createMember(formData: FormData) {
  const supabase = createAdminClient();
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "member");

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Falha ao criar usuário");
  }

  await supabase.from("users").insert({
    id: data.user.id,
    email,
    name,
    role,
    status: "active",
  });

  revalidatePath("/admin/members");
}

export async function updateMember(formData: FormData) {
  const supabase = createAdminClient();
  const id = String(formData.get("id"));

  await supabase
    .from("users")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      role: String(formData.get("role")),
      status: String(formData.get("status")),
    })
    .eq("id", id);

  revalidatePath("/admin/members");
}

export async function deleteMember(formData: FormData) {
  const supabase = createAdminClient();
  const id = String(formData.get("id"));

  await supabase.auth.admin.deleteUser(id);

  revalidatePath("/admin/members");
}
