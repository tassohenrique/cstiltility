import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/members");
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/admin" className="font-semibold tracking-tight">
          CSTiltility — Admin
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/admin/courses"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Mapas
          </Link>
          <Link
            href="/admin/members"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Membros
          </Link>
          <Link
            href="/admin/banners"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Banners
          </Link>
          <form action="/auth/sign-out" method="post">
            <Button variant="ghost" size="sm" type="submit">
              Sair
            </Button>
          </form>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
