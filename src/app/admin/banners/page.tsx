import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
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
import { createBanner, deleteBanner, updateBanner } from "./actions";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("order");

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Banners</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie o banner central exibido na home da área de membros.
        </p>
      </div>

      <form
        action={createBanner}
        className="flex flex-wrap items-end gap-3 rounded-lg border p-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image_url">Imagem (URL)</Label>
          <Input id="image_url" name="image_url" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cta_text">Texto do botão</Label>
          <Input id="cta_text" name="cta_text" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cta_link">Link do botão</Label>
          <Input id="cta_link" name="cta_link" />
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
        <div className="flex items-center gap-1.5 pb-1.5">
          <input id="active" name="active" type="checkbox" defaultChecked />
          <Label htmlFor="active">Ativo</Label>
        </div>
        <Button type="submit">Adicionar banner</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Imagem</TableHead>
            <TableHead>Botão</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(banners ?? []).map((banner) => (
            <TableRow key={banner.id}>
              <TableCell colSpan={7} className="p-0">
                <form
                  action={updateBanner}
                  className="grid grid-cols-[1.5fr_2fr_1fr_1.5fr_4rem_3rem_auto] items-center gap-2 px-4 py-2"
                >
                  <input type="hidden" name="id" value={banner.id} />
                  <Input name="title" defaultValue={banner.title} required />
                  <Input
                    name="image_url"
                    defaultValue={banner.image_url}
                    required
                  />
                  <Input name="cta_text" defaultValue={banner.cta_text ?? ""} />
                  <Input name="cta_link" defaultValue={banner.cta_link ?? ""} />
                  <Input
                    name="order"
                    type="number"
                    defaultValue={banner.order}
                  />
                  <input
                    name="active"
                    type="checkbox"
                    defaultChecked={banner.active}
                    className="size-4"
                  />
                  <div className="flex items-center gap-2">
                    <Button type="submit" size="sm" variant="secondary">
                      Salvar
                    </Button>
                    <Button
                      type="submit"
                      formAction={deleteBanner}
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
          {(!banners || banners.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="p-4 text-sm text-muted-foreground"
              >
                Nenhum banner cadastrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
