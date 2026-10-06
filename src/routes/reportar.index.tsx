import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { StudentShell, PageTitle, btn, fieldCls } from "@/components/cato";
import { Steps } from "@/components/wizard";
import { useStore } from "@/lib/store";
import { CATEGORIES, ZONES } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/reportar/")({
  head: () => seo("Reportar objeto", "Reporta un objeto que encontraste dentro de la universidad."),
  component: Paso1,
});

function Paso1() {
  const { draft, setDraft } = useStore();
  const navigate = useNavigate();
  const [touched, setTouched] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const errs: Record<string, string> = {};
  if (!draft.category) errs.category = "Selecciona el tipo de objeto";
  if (draft.name.trim().length < 3) errs.name = "Escribe un nombre (mín. 3 caracteres)";
  if (!draft.location) errs.location = "Selecciona el lugar";
  if (!draft.date || draft.date > today) errs.date = "La fecha no puede ser futura";
  if (!draft.time) errs.time = "Indica la hora aproximada";
  if (draft.description.trim().length < 10) errs.description = "Describe el objeto (mín. 10 caracteres)";
  const E = ({ k }: { k: string }) => (touched && errs[k] ? <span className="mt-1 block text-xs text-destructive">{errs[k]}</span> : null);
  const next = (e: React.FormEvent) => {
    e.preventDefault(); setTouched(true);
    if (Object.keys(errs).length === 0) navigate({ to: "/reportar/foto" });
  };
  return (
    <StudentShell>
      <form onSubmit={next} className="mx-auto max-w-2xl">
        <PageTitle title={draft.editingId ? "Corregir reporte" : "Reportar objeto encontrado"} subtitle="Gracias por ayudar a la comunidad UCB." />
        <Steps step={1} />
        <div className="space-y-4 rounded-3xl bg-card p-6 shadow-soft">
          <label className="block text-sm font-medium">Tipo de objeto
            <select className={`${fieldCls} mt-1.5`} value={draft.category} onChange={(e) => setDraft({ category: e.target.value })}>
              <option value="">Selecciona…</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select><E k="category" />
          </label>
          <label className="block text-sm font-medium">Nombre
            <input className={`${fieldCls} mt-1.5`} placeholder="Ej. Mochila negra" value={draft.name} onChange={(e) => setDraft({ name: e.target.value })} /><E k="name" />
          </label>
          <label className="block text-sm font-medium">Lugar del objeto
            <select className={`${fieldCls} mt-1.5`} value={draft.location} onChange={(e) => setDraft({ location: e.target.value })}>
              <option value="">Selecciona una zona del campus…</option>{ZONES.map((z) => <option key={z}>{z}</option>)}
            </select>
            <span className="mt-1 block text-xs text-muted-foreground">Solo se aceptan objetos encontrados dentro de la UCB.</span><E k="location" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium">Fecha
              <input type="date" max={today} className={`${fieldCls} mt-1.5`} value={draft.date} onChange={(e) => setDraft({ date: e.target.value })} /><E k="date" />
            </label>
            <label className="block text-sm font-medium">Hora aproximada
              <input type="time" className={`${fieldCls} mt-1.5`} value={draft.time} onChange={(e) => setDraft({ time: e.target.value })} /><E k="time" />
            </label>
          </div>
          <label className="block text-sm font-medium">Descripción pública
            <textarea rows={3} className={`${fieldCls} mt-1.5`} placeholder="Color, marca, tamaño…" value={draft.description} onChange={(e) => setDraft({ description: e.target.value })} /><E k="description" />
          </label>
          <label className="block text-sm font-medium">
            <span className="flex items-center gap-1.5"><Lock className="size-3.5 text-info" />Detalle privado (opcional)</span>
            <input className={`${fieldCls} mt-1.5`} placeholder="Algo que solo el dueño sabría. No se publicará." value={draft.characteristic} onChange={(e) => setDraft({ characteristic: e.target.value })} />
          </label>
        </div>
        <div className="mt-6 flex justify-end"><button className={btn.primary}>Siguiente</button></div>
      </form>
    </StudentShell>
  );
}
