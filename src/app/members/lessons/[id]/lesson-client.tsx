"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Lesson = {
  id: string;
  title: string;
  youtube_video_id: string;
  description: string | null;
  difficulty: string;
};

export function LessonClient({
  lesson,
  initialNote,
  initialCompleted,
}: {
  lesson: Lesson;
  initialNote: string;
  initialCompleted: boolean;
}) {
  const [note, setNote] = useState(initialNote);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [completed, setCompleted] = useState(initialCompleted);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (note === initialNote) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("notes").upsert(
        {
          user_id: user.id,
          lesson_id: lesson.id,
          content: note,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );
      setSaveState("saved");
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  async function toggleCompleted() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (completed) {
      await supabase
        .from("progress")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lesson.id);
      setCompleted(false);
    } else {
      await supabase
        .from("progress")
        .upsert(
          { user_id: user.id, lesson_id: lesson.id },
          { onConflict: "user_id,lesson_id" },
        );
      setCompleted(true);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="aspect-video w-full overflow-hidden rounded-lg border">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${lesson.youtube_video_id}`}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-sm text-muted-foreground">
              {lesson.description}
            </p>
          )}
        </div>
        <Button
          variant={completed ? "secondary" : "default"}
          onClick={toggleCompleted}
        >
          {completed ? "Concluída ✓" : "Marcar como assistida"}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="notes" className="text-sm font-medium">
            Minhas notas
          </label>
          <span className="text-xs text-muted-foreground">
            {saveState === "saving" && "Salvando..."}
            {saveState === "saved" && "Salvo"}
          </span>
        </div>
        <textarea
          id="notes"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaveState("saving");
          }}
          rows={6}
          className="w-full resize-none rounded-md border bg-transparent p-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          placeholder="Anote pontos de referência, timing, ajustes..."
        />
      </div>
    </div>
  );
}
