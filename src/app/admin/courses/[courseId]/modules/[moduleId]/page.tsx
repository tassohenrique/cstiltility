import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createLesson, deleteLesson, updateLesson } from "../../../actions";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export default async function AdminModuleLessonsPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { courseId, moduleId } = await params;
  const supabase = await createClient();

  const { data: courseModule } = await supabase
    .from("modules")
    .select("*, courses(title)")
    .eq("id", moduleId)
    .single();

  if (!courseModule) {
    notFound();
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", moduleId)
    .order("order");

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-1">
        <Link
          href={`/admin/courses/${courseId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {courseModule.courses?.title ?? "Módulos"}
        </Link>
        <h1 className="text-xl font-semibold">
          Aulas — {courseModule.title}
        </h1>
      </div>

      <form
        action={createLesson}
        className="flex flex-col gap-3 rounded-lg border p-4"
      >
        <input type="hidden" name="module_id" value={moduleId} />
        <input type="hidden" name="course_id" value={courseId} />
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Smoke de A partir do T Spawn"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="youtube_video_id">ID do vídeo (YouTube)</Label>
            <Input id="youtube_video_id" name="youtube_video_id" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="difficulty">Dificuldade</Label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue="medium"
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
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
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" name="description" />
        </div>
        <Button type="submit" className="w-fit">
          Adicionar aula
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Vídeo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Dificuldade</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(lessons ?? []).map((lesson) => (
            <TableRow key={lesson.id}>
              <TableCell colSpan={6} className="p-0">
                <form
                  action={updateLesson}
                  className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_4rem_auto] items-center gap-2 px-4 py-2"
                >
                  <input type="hidden" name="id" value={lesson.id} />
                  <input type="hidden" name="module_id" value={moduleId} />
                  <input type="hidden" name="course_id" value={courseId} />
                  <Input name="title" defaultValue={lesson.title} required />
                  <Input
                    name="youtube_video_id"
                    defaultValue={lesson.youtube_video_id}
                    required
                  />
                  <Input
                    name="description"
                    defaultValue={lesson.description ?? ""}
                  />
                  <select
                    name="difficulty"
                    defaultValue={lesson.difficulty}
                    className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {DIFFICULTIES.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                  <Input
                    name="order"
                    type="number"
                    defaultValue={lesson.order}
                  />
                  <div className="flex items-center gap-2">
                    <Button type="submit" size="sm" variant="secondary">
                      Salvar
                    </Button>
                    <Button
                      type="submit"
                      formAction={deleteLesson}
                      size="sm"
                      variant="destructive"
                    >
                      Excluir
                    </Button>
                  </div>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {(!lessons || lessons.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="p-4 text-sm text-muted-foreground"
              >
                Nenhuma aula cadastrada ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
