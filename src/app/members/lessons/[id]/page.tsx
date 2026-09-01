import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonClient } from "./lesson-client";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (!lesson || !user) {
    notFound();
  }

  const [{ data: note }, { data: progress }] = await Promise.all([
    supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .eq("lesson_id", id)
      .maybeSingle(),
    supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("lesson_id", id)
      .maybeSingle(),
  ]);

  return (
    <LessonClient
      lesson={lesson}
      initialNote={note?.content ?? ""}
      initialCompleted={!!progress}
    />
  );
}
