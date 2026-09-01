"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "").trim();

  await supabase.from("courses").insert({
    title,
    slug: slugify(title),
    cover_image_url: String(formData.get("cover_image_url") ?? "") || null,
    order: Number(formData.get("order") ?? 0),
  });

  revalidatePath("/admin/courses");
}

export async function updateCourse(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();

  await supabase
    .from("courses")
    .update({
      title,
      slug: slugify(title),
      cover_image_url: String(formData.get("cover_image_url") ?? "") || null,
      order: Number(formData.get("order") ?? 0),
    })
    .eq("id", id);

  revalidatePath("/admin/courses");
}

export async function deleteCourse(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  await supabase.from("courses").delete().eq("id", id);

  revalidatePath("/admin/courses");
}

export async function createModule(formData: FormData) {
  const supabase = await createClient();
  const courseId = String(formData.get("course_id"));

  await supabase.from("modules").insert({
    course_id: courseId,
    title: String(formData.get("title") ?? "").trim(),
    type: String(formData.get("type")),
    order: Number(formData.get("order") ?? 0),
  });

  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateModule(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const courseId = String(formData.get("course_id"));

  await supabase
    .from("modules")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      type: String(formData.get("type")),
      order: Number(formData.get("order") ?? 0),
    })
    .eq("id", id);

  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteModule(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const courseId = String(formData.get("course_id"));

  await supabase.from("modules").delete().eq("id", id);

  revalidatePath(`/admin/courses/${courseId}`);
}

export async function createLesson(formData: FormData) {
  const supabase = await createClient();
  const moduleId = String(formData.get("module_id"));
  const courseId = String(formData.get("course_id"));

  await supabase.from("lessons").insert({
    module_id: moduleId,
    title: String(formData.get("title") ?? "").trim(),
    youtube_video_id: String(formData.get("youtube_video_id") ?? "").trim(),
    description: String(formData.get("description") ?? "") || null,
    difficulty: String(formData.get("difficulty")),
    order: Number(formData.get("order") ?? 0),
  });

  revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}`);
}

export async function updateLesson(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const moduleId = String(formData.get("module_id"));
  const courseId = String(formData.get("course_id"));

  await supabase
    .from("lessons")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      youtube_video_id: String(formData.get("youtube_video_id") ?? "").trim(),
      description: String(formData.get("description") ?? "") || null,
      difficulty: String(formData.get("difficulty")),
      order: Number(formData.get("order") ?? 0),
    })
    .eq("id", id);

  revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}`);
}

export async function deleteLesson(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const moduleId = String(formData.get("module_id"));
  const courseId = String(formData.get("course_id"));

  await supabase.from("lessons").delete().eq("id", id);

  revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}`);
}
