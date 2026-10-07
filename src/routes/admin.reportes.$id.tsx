import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, ItemImage, StatusBadge, Meta, MapPin, Calendar, Clock, Tag, btn, EmptyState } from "@/components/cato";
import { useStore } from "@/lib/store";
import { REJECT_REASONS, formatDate } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/reportes/$id")({
  head: () => seo("Revisar reporte", "Valida un reporte de objeto encontrado."),
  component: Revisar,
});

function Revisar() {
  const { id } = Route.useParams();
  const { items, users, approve, reject, requestInfo } = useStore();
  const navigate = useNavigate();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState(REJECT_REASONS[0]);
  const [checks, setChecks] = useState({ info: true, user: true, more: false });
  const item = items.find((i) => i.id === id);
  if (!item) return <AdminShell><EmptyState title="Reporte no encontrado" text="" /></AdminShell>;
  const u = users.find((x) => x.id === item.reportedBy);
  const pending = item.status === "PENDING";
  return (
    <AdminShell>
      <Link to="/admin/solicitudes" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground"><ArrowLeft className="size-4" />Solicitudes</Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <ItemImage item={item} className="aspect-square w-full rounded-3xl" />
        <div className="space-y-5">
          <div><StatusBadge status={item.status} /><h1 className="mt-2 text-2xl font-bold">{item.name}</h1><p className="mt-1 text-muted-foreground">{item.description}</p></div>
          <div className="grid grid-cols-2 gap-3">
            <Meta icon={Tag} label="Categoría" value={item.category} />
            <Meta icon={MapPin} label="Lugar" value={item.location} />
            <Meta icon={Calendar} label="Fecha" value={formatDate(item.date)} />
            <Meta icon={Clock} label="Hora" value={item.time} />
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usuario que reportó</p>
            <p className="mt-1 font-semibold">{u?.name}</p><p className="text-sm text-muted-foreground">{u?.email}</p>
            <p className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold ${u?.verifiedEmail ? "text-success" : "text-warning"}`}><BadgeCheck className="size-4" />{u?.verifiedEmail ? "Correo verificado" : "Correo sin verificar"}</p>
            <p className="mt-3 flex items-center gap-2 text-sm"><Lock className="size-4 text-info" />Dato privado: {item.privateVerificationData.characteristic}</p>
          </div>
          {pending && (
            <>
              <div className="space-y-2 rounded-2xl bg-card p-4 shadow-soft">
                {([["info", "Información suficiente"], ["user", "Usuario verificado"], ["more", "Requiere información adicional"]] as const).map(([k, l]) => (
                  <label key={k} className="flex items-center gap-3 text-sm"><input type="checkbox" className="size-4 accent-primary" checked={checks[k]} onChange={(e) => setChecks({ ...checks, [k]: e.target.checked })} />{l}</label>
                ))}
              </div>
              {rejecting ? (
                <div className="space-y-3 rounded-2xl bg-danger-soft p-4">
                  <p className="font-semibold">Motivo del rechazo</p>
                  {REJECT_REASONS.map((r) => <label key={r} className="flex items-center gap-2 text-sm"><input type="radio" name="r" checked={reason === r} onChange={() => setReason(r)} className="accent-primary" />{r}</label>)}
                  <div className="flex gap-2">
                    <button onClick={() => { reject(id, reason); toast.error("Reporte rechazado. Se notificó al estudiante."); navigate({ to: "/admin/solicitudes" }); }} className={btn.danger}>Confirmar rechazo</button>
                    <button onClick={() => setRejecting(false)} className={btn.outline}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { approve(id); toast.success("Reporte aprobado y publicado."); navigate({ to: "/admin/solicitudes" }); }} className={btn.success}>Aprobar y publicar</button>
                  <button onClick={() => { requestInfo(id); toast("Se solicitó más información al estudiante."); }} className={btn.outline}>Solicitar más información</button>
                  <button onClick={() => setRejecting(true)} className={btn.outline}>Rechazar</button>
                </div>
              )}
              {item.infoRequested && <p className="text-sm text-warning">Información adicional solicitada — esperando respuesta.</p>}
            </>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
