import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, LogOut, Pencil, RotateCcw, AlertCircle, Headphones } from "lucide-react";
import { toast } from "sonner";
import { StudentShell, btn, fieldCls } from "@/components/cato";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/perfil")({
  head: () => seo("Mi perfil", "Tus datos y estadísticas en Cato Find."),
  component: Perfil,
});

function Perfil() {
  const { user, items, logout, updateProfile, resetDemo } = useStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  if (!user) return <StudentShell>{null}</StudentShell>;
  const mine = items.filter((i) => i.reportedBy === user.id);
  const accepted = mine.filter((i) => !["PENDING", "REJECTED"].includes(i.status)).length;
  const recovered = items.filter((i) => i.ownerId === user.id).length;
  return (
    <StudentShell>
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl bg-card p-6 text-center shadow-soft">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-hero text-2xl font-bold text-primary-foreground">{user.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
          {editing ? (
            <form onSubmit={(e) => { e.preventDefault(); if (name.trim().length < 3) return; updateProfile(name.trim()); setEditing(false); toast.success("Perfil actualizado."); }} className="mx-auto mt-4 flex max-w-xs gap-2">
              <input className={fieldCls} value={name} onChange={(e) => setName(e.target.value)} aria-label="Nombre" />
              <button className={btn.primary}>Guardar</button>
            </form>
          ) : <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>}
          <p className="text-muted-foreground">{user.email}</p>
          {user.verifiedEmail
            ? <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success"><BadgeCheck className="size-4" />Correo verificado</p>
            : <Link to="/verificar-correo" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-3 py-1 text-sm font-semibold text-warning"><AlertCircle className="size-4" />Verificar correo</Link>}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[[mine.length, "reportes"], [accepted, "aceptados"], [recovered, "recuperados"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-muted p-4"><p className="text-2xl font-bold text-primary">{n}</p><p className="text-xs text-muted-foreground">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <button onClick={() => setEditing(true)} className={btn.outline}><Pencil className="size-4" />Editar perfil</button>
          <Link to="/contactar" className={btn.outline}><Headphones className="size-4" />Contactar administración</Link>
          <button onClick={() => { resetDemo(); toast.success("Datos de demostración reiniciados."); navigate({ to: "/" }); }} className={btn.outline}><RotateCcw className="size-4" />Reset demo data</button>
          <button onClick={() => { logout(); navigate({ to: "/" }); }} className={btn.danger}><LogOut className="size-4" />Cerrar sesión</button>
        </div>
      </div>
    </StudentShell>
  );
}
