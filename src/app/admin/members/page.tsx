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
import { createMember, deleteMember, updateMember } from "./actions";

const ROLES = ["member", "admin"] as const;
const STATUSES = ["active", "inactive"] as const;

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("users")
    .select("*")
    .order("created_at");

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Membros</h1>
        <p className="text-sm text-muted-foreground">
          Crie contas manualmente e ative/desative o acesso de cada membro.
        </p>
      </div>

      <form
        action={createMember}
        className="flex flex-wrap items-end gap-3 rounded-lg border p-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha inicial</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Papel</Label>
          <select
            id="role"
            name="role"
            defaultValue="member"
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">Criar conta</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(members ?? []).map((member) => (
            <TableRow key={member.id}>
              <TableCell colSpan={5} className="p-0">
                <form
                  action={updateMember}
                  className="grid grid-cols-[1.5fr_2fr_1fr_1fr_auto] items-center gap-2 px-4 py-2"
                >
                  <input type="hidden" name="id" value={member.id} />
                  <Input name="name" defaultValue={member.name} required />
                  <span className="text-sm text-muted-foreground">
                    {member.email}
                  </span>
                  <select
                    name="role"
                    defaultValue={member.role}
                    className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <select
                    name="status"
                    defaultValue={member.status}
                    className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <Button type="submit" size="sm" variant="secondary">
                      Salvar
                    </Button>
                    <Button
                      type="submit"
                      formAction={deleteMember}
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
          {(!members || members.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="p-4 text-sm text-muted-foreground"
              >
                Nenhum membro cadastrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
