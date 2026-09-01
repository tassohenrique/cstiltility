import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createModule, deleteModule, updateModule } from "../actions";

const GRENADE_TYPES = ["smoke", "flash", "he", "molotov"] as const;

export default async function AdminCourseModulesPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) {
    notFound();
  }

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", courseId)
    .order("order");

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/admin/courses"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Mapas
        </Link>
        <h1 className="text-xl font-semibold">Módulos — {course.title}</h1>
        <p className="text-sm text-muted-foreground">
          Cada módulo agrupa aulas por tipo de granada.
        </p>
      </div>

      <form
        action={createModule}
        className="flex flex-wrap items-end gap-3 rounded-lg border p-4"
      >
        <input type="hidden" name="course_id" value={courseId} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" required placeholder="Smokes" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Tipo</Label>
          <select
            id="type"
            name="type"
            required
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {GRENADE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order">Ordem</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={0}
            className="w-20"
          />
        </div>
        <Button type="submit">Adicionar módulo</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(modules ?? []).map((module) => (
            <TableRow key={module.id}>
              <TableCell colSpan={4} className="p-0">
                <form
                  action={updateModule}
                  className="grid grid-cols-[2fr_1fr_5rem_auto] items-center gap-2 px-4 py-2"
                >
                  <input type="hidden" name="id" value={module.id} />
                  <input type="hidden" name="course_id" value={courseId} />
                  <Input name="title" defaultValue={module.title} required />
                  <select
                    name="type"
                    defaultValue={module.type}
                    className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {GRENADE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <Input
                    name="order"
                    type="number"
                    defaultValue={module.order}
                  />
                  <div className="flex items-center gap-2">
                    <Button type="submit" size="sm" variant="secondary">
                      Salvar
                    </Button>
                    <Button
                      formAction={deleteModule}
                      size="sm"
                      variant="destructive"
                    >
                      Excluir
                    </Button>
                    <Link
                      href={`/admin/courses/${courseId}/modules/${module.id}`}
                      className={buttonVariants({
                        size: "sm",
                        variant: "outline",
                      })}
                    >
                      Aulas
                    </Link>
                  </div>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {(!modules || modules.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="p-4 text-sm text-muted-foreground"
              >
                Nenhum módulo cadastrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
