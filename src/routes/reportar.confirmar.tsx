import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { StudentShell, PageTitle, btn, Meta, MapPin, Calendar, Clock, Tag, ItemImage } from "@/components/cato";
import { Steps } from "@/components/wizard";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/reportar/confirmar")({
  head: () => seo("Confirmar reporte", "Revisa la información antes de enviar tu reporte."),
  component: Paso3,
});

function Paso3() {
  const { draft, submitDraft, ready } = useStore();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  useEffect(() => { if (ready && (!draft.name || !draft.image)) navigate({ to: "/reportar" }); }, [ready, draft, navigate]);
  const send = () => {
    setSending(true);
    setTimeout(() => { const id = submitDraft(); navigate({ to: "/reportar/enviado", search: { id } }); }, 900);
  };
  return (
    <StudentShell>
      <div className="mx-auto max-w-2xl">
        <PageTitle title="¿La información es correcta?" />
        <Steps step={3} />
        <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
          <ItemImage item={draft} className="aspect-video w-full" />
          <div className="space-y-4 p-6">
            <h2 className="text-xl font-bold">{draft.name}</h2>
            <p className="text-muted-foreground">{draft.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <Meta icon={Tag} label="Tipo" value={draft.category} />
              <Meta icon={MapPin} label="Lugar" value={draft.location} />
              <Meta icon={Calendar} label="Fecha" value={draft.date && formatDate(draft.date)} />
              <Meta icon={Clock} label="Hora" value={draft.time} />
            </div>
            {draft.characteristic && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-4 text-info" />Detalle privado guardado (no se publicará).</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Link to="/reportar/foto" className={btn.outline}>Atrás</Link>
          <button onClick={send} disabled={sending} className={btn.primary}>{sending && <Loader2 className="size-4 animate-spin" />}Enviar reporte</button>
        </div>
      </div>
    </StudentShell>
  );
}
