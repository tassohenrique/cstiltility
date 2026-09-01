import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function MembersHomePage() {
  const supabase = await createClient();

  const [{ data: banners }, { data: courses }] = await Promise.all([
    supabase
      .from("banners")
      .select("*")
      .eq("active", true)
      .order("order")
      .limit(1),
    supabase.from("courses").select("*").order("order"),
  ]);

  const banner = banners?.[0];

  return (
    <div className="flex flex-col gap-10 p-6">
      {banner && (
        <section className="relative overflow-hidden rounded-xl border">
          <div className="relative aspect-[21/9] w-full">
            <Image
              src={banner.image_url}
              alt={banner.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end gap-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8">
            <h1 className="text-3xl font-semibold text-white">
              {banner.title}
            </h1>
            {banner.cta_link && banner.cta_text && (
              <Link
                href={banner.cta_link}
                className="w-fit rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
              >
                {banner.cta_text}
              </Link>
            )}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Mapas</h2>
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/members/courses/${course.slug}`}
                className="group flex flex-col gap-2"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted transition-transform group-hover:scale-[1.02]">
                  {course.cover_image_url && (
                    <Image
                      src={course.cover_image_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <span className="text-sm font-medium">{course.title}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum mapa disponível ainda.
          </p>
        )}
      </section>
    </div>
  );
}
