import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: completedCount } = await supabase
    .from("progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user?.id ?? "");

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Perfil</h1>
      <div className="flex flex-col gap-1 text-sm">
        <p>
          <span className="text-muted-foreground">Email:</span> {user?.email}
        </p>
        <p>
          <span className="text-muted-foreground">Aulas concluídas:</span>{" "}
          {completedCount ?? 0}
        </p>
      </div>
    </div>
  );
}
