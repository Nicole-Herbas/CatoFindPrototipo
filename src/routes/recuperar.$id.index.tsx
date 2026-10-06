import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowLeft, UserCheck, MessageSquareText, PackageCheck } from "lucide-react";
import { StudentShell, ItemImage, btn, EmptyState } from "@/components/cato";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/recuperar/$id/")({
  head: () => seo("Solicitar recuperación", "Inicia la solicitud para recuperar tu objeto."),
  component: Recuperar,
});

function Recuperar() {
  const { id } = Route.useParams();
  const { items } = useStore();
  const item = items.find((i) => i.id === id);
  if (!item) return <StudentShell><EmptyState title="Objeto no encontrado" text="" /></StudentShell>;
  return (
    <StudentShell>
      <div className="mx-auto max-w-xl">
        <Link to="/objeto/$id" params={{ id }} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground"><ArrowLeft className="size-4" />Volver al objeto</Link>
        <div className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-soft">
          <ItemImage item={item} className="size-20 rounded-xl" />
          <div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">{item.location} · {formatDate(item.date)}</p></div>
        </div>
        <div className="mt-6 rounded-3xl bg-card p-6 shadow-soft">
          <ShieldCheck className="size-10 text-accent" />
          <h1 className="mt-3 text-2xl font-bold">Solicitar recuperación</h1>
          <p className="mt-2 text-muted-foreground">Para proteger al propietario, necesitamos comprobar algunos datos.</p>
          <ol className="mt-6 space-y-4">
            {[
              { i: MessageSquareText, t: "Respondes 3 preguntas", s: "Solo el dueño real conoce ciertos detalles." },
              { i: UserCheck, t: "Bienestar Estudiantil verifica", s: "Compara tus respuestas con datos privados del reporte." },
              { i: PackageCheck, t: "Recoges tu objeto", s: "Presentando tu carnet universitario." },
            ].map((s) => (
              <li key={s.t} className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><s.i className="size-5" /></span><div><p className="font-semibold">{s.t}</p><p className="text-sm text-muted-foreground">{s.s}</p></div></li>
            ))}
          </ol>
          <Link to="/recuperar/$id/verificacion" params={{ id }} className={`${btn.primary} mt-6 w-full`}>Continuar</Link>
        </div>
      </div>
    </StudentShell>
  );
}
