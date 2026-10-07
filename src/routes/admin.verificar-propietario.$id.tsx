import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, ItemImage, btn, EmptyState } from "@/components/cato";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/verificar-propietario/$id")({
  head: () => seo("Verificación de persona", "Compara la solicitud con los datos privados del reporte."),
  component: VerificarPropietario,
});

const words = (s: string) => new Set(s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\W+/).filter((w) => w.length > 3));

function VerificarPropietario() {
  const { id } = Route.useParams();
  const { claims, items, users, validateClaim, rejectClaim } = useStore();
  const navigate = useNavigate();
  const claim = claims.find((c) => c.id === id);
  const item = items.find((i) => i.id === claim?.itemId);
  if (!claim || !item) return <AdminShell><EmptyState title="Solicitud no encontrada" text="" /></AdminShell>;
  const u = users.find((x) => x.id === claim.userId);
  const p = item.privateVerificationData;
  const a = words(claim.characteristic), b = words(p.characteristic);
  const overlap = [...a].filter((w) => b.has(w)).length;
  const rows = [
    { l: "Lugar", s: claim.lossLocation, o: p.approximateLossLocation, ok: claim.lossLocation === p.approximateLossLocation },
    { l: "Fecha", s: formatDate(claim.lossDate), o: formatDate(p.approximateLossDate), ok: Math.abs(new Date(claim.lossDate).getTime() - new Date(p.approximateLossDate).getTime()) <= 2 * 864e5 },
    { l: "Característica", s: claim.characteristic, o: p.characteristic, ok: overlap >= 1 },
  ];
  const score = rows.filter((r) => r.ok).length;
  const done = claim.status !== "pending";
  return (
    <AdminShell>
      <Link to="/admin/solicitudes" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground"><ArrowLeft className="size-4" />Solicitudes</Link>
      <h1 className="text-2xl font-bold md:text-3xl">Verificación de persona</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Datos de cuenta</p>
          <p className="mt-2 text-lg font-semibold">{u?.name}</p><p className="text-sm text-muted-foreground">{u?.email}</p>
          <p className={`mt-2 inline-flex items-center gap-1 text-sm font-semibold ${u?.verifiedEmail ? "text-success" : "text-warning"}`}><BadgeCheck className="size-4" />{u?.verifiedEmail ? "Correo verificado" : "Correo sin verificar"}</p>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted p-2"><ItemImage item={item} className="size-12 rounded-lg" /><p className="text-sm font-medium">{item.name}</p></div>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-soft lg:col-span-2">
          <div className="grid grid-cols-[90px_1fr_1fr_auto] gap-x-3 gap-y-3 text-sm">
            <span /><span className="text-xs font-semibold uppercase text-muted-foreground">Respuesta del estudiante</span><span className="text-xs font-semibold uppercase text-muted-foreground">Info privada del reporte</span><span />
            {rows.map((r) => (
              <div key={r.l} className="contents">
                <span className="font-medium">{r.l}</span><span>{r.s}</span><span className="text-muted-foreground">{r.o}</span>
                {r.ok ? <CheckCircle2 className="size-5 text-success" aria-label="Coincide" /> : <AlertTriangle className="size-5 text-warning" aria-label="No coincide" />}
              </div>
            ))}
          </div>
          {claim.extra && <p className="mt-3 text-sm text-muted-foreground">Info adicional: {claim.extra}</p>}
          <div className={`mt-5 flex items-center gap-3 rounded-xl p-3 ${score >= 2 ? "bg-success-soft" : "bg-warning-soft"}`}>
            <Sparkles className="size-5 text-gold-foreground" />
            <p className="text-sm"><b>Asistente de verificación (simulado):</b> {score}/3 coincidencias — {score >= 2 ? "✓ Coincide, probable propietario." : "Revisar con cuidado: datos parcialmente distintos."}</p>
          </div>
        </div>
      </div>
      {done ? (
        <p className="mt-6 font-semibold">{claim.status === "rejected" ? "Solicitud rechazada." : <Link to="/admin/devolucion/$id" params={{ id }} className="text-accent">Ir a confirmar devolución →</Link>}</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => { validateClaim(id); toast.success("Propietario validado."); navigate({ to: "/admin/devolucion/$id", params: { id } }); }} className={btn.success}>Validar propietario</button>
          <button onClick={() => { rejectClaim(id); toast.error("Solicitud rechazada."); navigate({ to: "/admin/solicitudes" }); }} className={btn.outline}>Rechazar solicitud</button>
        </div>
      )}
    </AdminShell>
  );
}
