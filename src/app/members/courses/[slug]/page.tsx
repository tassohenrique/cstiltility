import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const GRENADE_LABELS: Record<string, string> = {
  smoke: "Smokes",
  flash: "Flashes",
  he: "HEs",
  molotov: "Molotovs",
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) {
    notFound();
  }

  const { data: modules } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", course.id)
    .order("order");

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-semibold">{course.title}</h1>

      {modules && modules.length > 0 ? (
        modules.map((module) => (
          <section key={module.id} className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">
              {GRENADE_LABELS[module.type] ?? module.type}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {(module.lessons ?? [])
                .sort(
                  (a: { order: number }, b: { order: number }) =>
                    a.order - b.order,
                )
                .map((lesson: { id: string; title: string; difficulty: string }) => (
                  <Link
                    key={lesson.id}
                    href={`/members/lessons/${lesson.id}`}
                    className="flex flex-col gap-1 rounded-lg border p-4 hover:bg-accent"
                  >
                    <span className="text-sm font-medium">
                      {lesson.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {lesson.difficulty}
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum módulo cadastrado ainda.
        </p>
      )}
    </div>
  );
}
