import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function MembersLayout({
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

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/members" className="font-semibold tracking-tight">
          CSTiltility
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/members/profile"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Perfil
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
