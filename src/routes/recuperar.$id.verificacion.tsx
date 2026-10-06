import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { StudentShell, PageTitle, StatusBadge, btn, fieldCls } from "@/components/cato";
import { useStore } from "@/lib/store";
import { ZONES } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/recuperar/$id/verificacion")({
  head: () => seo("Preguntas de verificación", "Responde las preguntas para comprobar que el objeto es tuyo."),
  component: Verificacion,
});

function Verificacion() {
  const { id } = Route.useParams();
  const { items, createClaim, claims, user } = useStore();
  const item = items.find((i) => i.id === id);
  const existing = claims.find((c) => c.itemId === id && c.userId === user?.id && c.status !== "rejected");
  const [f, setF] = useState({ lossLocation: "", lossDate: "", characteristic: "", extra: "" });
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const valid = f.lossLocation && f.lossDate && f.characteristic.trim().length >= 5;

  if (sent || existing)
    return (
      <StudentShell>
        <div className="mx-auto max-w-md rounded-3xl bg-card p-8 text-center shadow-soft">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-info-soft"><Lock className="size-7 text-info" /></span>
          <h1 className="mt-4 text-2xl font-bold">Solicitud en revisión</h1>
          <p className="mt-2 text-muted-foreground">Tu solicitud fue enviada a Bienestar Estudiantil.</p>
          <StatusBadge status="VERIFYING" className="mt-4" />
          <p className="mt-4 text-sm text-muted-foreground">Se comprobará tu identidad y la información proporcionada.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/notificaciones" className={btn.primary}>Ver notificaciones</Link>
            <Link to="/inicio" className={btn.outline}>Volver al inicio</Link>
          </div>
        </div>
      </StudentShell>
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setTouched(true);
    if (!valid || !item) return;
    setSending(true);
    setTimeout(() => { createClaim({ itemId: id, ...f }); setSent(true); }, 800);
  };
  return (
    <StudentShell>
      <form onSubmit={submit} className="mx-auto max-w-xl">
        <PageTitle title="Preguntas de verificación" subtitle={item ? `Objeto: ${item.name}` : undefined} />
        <div className="space-y-5 rounded-3xl bg-card p-6 shadow-soft">
          <label className="block text-sm font-medium">1. ¿Dónde crees que perdiste el objeto?
            <select className={`${fieldCls} mt-1.5`} value={f.lossLocation} onChange={(e) => setF({ ...f, lossLocation: e.target.value })}>
              <option value="">Selecciona…</option>{ZONES.map((z) => <option key={z}>{z}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">2. ¿Cuándo aproximadamente lo perdiste?
            <input type="date" max={new Date().toISOString().slice(0, 10)} className={`${fieldCls} mt-1.5`} value={f.lossDate} onChange={(e) => setF({ ...f, lossDate: e.target.value })} />
          </label>
          <label className="block text-sm font-medium">3. Describe una característica que no aparece en la publicación.
            <textarea rows={3} className={`${fieldCls} mt-1.5`} placeholder="Ej. una marca, sticker, contenido…" value={f.characteristic} onChange={(e) => setF({ ...f, characteristic: e.target.value })} />
          </label>
          <label className="block text-sm font-medium">Información adicional (opcional)
            <input className={`${fieldCls} mt-1.5`} value={f.extra} onChange={(e) => setF({ ...f, extra: e.target.value })} />
          </label>
          {touched && !valid && <p className="text-sm text-destructive">Responde las 3 preguntas para continuar.</p>}
        </div>
        <button disabled={sending} className={`${btn.primary} mt-6 w-full`}>{sending && <Loader2 className="size-4 animate-spin" />}Enviar solicitud</button>
      </form>
    </StudentShell>
  );
}
