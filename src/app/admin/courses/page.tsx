import Link from "next/link";
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
import { createCourse, deleteCourse, updateCourse } from "./actions";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("order");

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Mapas</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre os mapas e gerencie os módulos e aulas de cada um.
        </p>
      </div>

      <form
        action={createCourse}
        className="flex flex-wrap items-end gap-3 rounded-lg border p-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" required placeholder="Mirage" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cover_image">Capa</Label>
          <input
            id="cover_image"
            name="cover_image"
            type="file"
            accept="image/*"
            className="text-sm"
          />
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
        <Button type="submit">Adicionar mapa</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead />
            <TableHead>Capa</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(courses ?? []).map((course) => (
            <TableRow key={course.id}>
              <TableCell colSpan={6} className="p-0">
                <form
                  action={updateCourse}
                  className="grid grid-cols-[2fr_1fr_3rem_2fr_5rem_auto] items-center gap-2 px-4 py-2"
                >
                  <input type="hidden" name="id" value={course.id} />
                  <input
                    type="hidden"
                    name="existing_cover_image_url"
                    value={course.cover_image_url ?? ""}
                  />
                  <Input name="title" defaultValue={course.title} required />
                  <span className="text-sm text-muted-foreground">
                    {course.slug}
                  </span>
                  {course.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.cover_image_url}
                      alt=""
                      className="size-8 rounded object-cover"
                    />
                  ) : (
                    <span />
                  )}
                  <input
                    name="cover_image"
                    type="file"
                    accept="image/*"
                    className="text-xs"
                  />
                  <Input
                    name="order"
                    type="number"
                    defaultValue={course.order}
                  />
                  <div className="flex items-center gap-2">
                    <Button type="submit" size="sm" variant="secondary">
                      Salvar
                    </Button>
                    <Button
                      type="submit"
                      formAction={deleteCourse}
                      size="sm"
                      variant="destructive"
                    >
                      Excluir
                    </Button>
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className={buttonVariants({
                        size: "sm",
                        variant: "outline",
                      })}
                    >
                      Módulos
                    </Link>
                  </div>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {(!courses || courses.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="p-4 text-sm text-muted-foreground"
              >
                Nenhum mapa cadastrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
