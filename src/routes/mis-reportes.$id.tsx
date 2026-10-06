import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Check, Lock } from "lucide-react";
import { StudentShell, StatusBadge, ItemImage, Meta, MapPin, Calendar, Clock, Tag, btn, EmptyState } from "@/components/cato";
import { useStore } from "@/lib/store";
import { formatDate, type Status } from "@/lib/data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mis-reportes/$id")({
  head: () => seo("Detalle del reporte", "Estado y trazabilidad de tu reporte."),
  component: ReporteDetalle,
});

const flow: Status[] = ["PENDING", "PUBLISHED", "CLAIMED", "VERIFYING", "RECOVERED"];
const flowLabel = ["Enviado", "Publicado", "Solicitado", "Verificando", "Recuperado"];

function ReporteDetalle() {
  const { id } = Route.useParams();
  const { items, user, editReport } = useStore();
  const navigate = useNavigate();
  const item = items.find((i) => i.id === id && i.reportedBy === user?.id);
  if (!item) return <StudentShell><EmptyState title="Reporte no encontrado" text="Este reporte no existe." action={<Link to="/mis-reportes" className={btn.primary}>Mis reportes</Link>} /></StudentShell>;
  const idx = flow.indexOf(item.status);
  const fix = () => { editReport(item); navigate({ to: "/reportar" }); };
  return (
    <StudentShell>
      <Link to="/mis-reportes" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground"><ArrowLeft className="size-4" />Mis reportes</Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <ItemImage item={item} className="aspect-square w-full rounded-3xl" />
        <div>
          <StatusBadge status={item.status} />
          <h1 className="mt-3 text-3xl font-bold">{item.name}</h1>
          <p className="mt-2 text-muted-foreground">{item.description}</p>

          {item.status === "REJECTED" && (
            <div className="mt-5 rounded-2xl bg-danger-soft p-4">
              <p className="flex items-center gap-2 font-semibold text-destructive"><AlertCircle className="size-4" />Reporte rechazado</p>
              <p className="mt-1 text-sm">Motivo: {item.rejectReason}</p>
              <button onClick={fix} className={`${btn.primary} mt-3`}>Corregir reporte</button>
            </div>
          )}
          {item.infoRequested && item.status === "PENDING" && (
            <div className="mt-5 rounded-2xl bg-warning-soft p-4">
              <p className="font-semibold text-warning">Administración solicita más información</p>
              <button onClick={fix} className={`${btn.primary} mt-3`}>Completar información</button>
            </div>
          )}

          {item.status !== "REJECTED" && (
            <ol className="mt-6 flex">
              {flowLabel.map((l, i) => (
                <li key={l} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    <span className={cn("h-0.5 flex-1", i === 0 ? "opacity-0" : i <= idx ? "bg-success" : "bg-border")} />
                    <span className={cn("grid size-7 place-items-center rounded-full text-xs font-bold", i <= idx ? "bg-success text-primary-foreground" : "bg-muted text-muted-foreground")}>{i <= idx ? <Check className="size-3.5" /> : i + 1}</span>
                    <span className={cn("h-0.5 flex-1", i === 4 ? "opacity-0" : i < idx ? "bg-success" : "bg-border")} />
                  </div>
                  <span className="mt-1.5 text-[11px] text-muted-foreground">{l}</span>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Meta icon={Tag} label="Categoría" value={item.category} />
            <Meta icon={MapPin} label="Lugar" value={item.location} />
            <Meta icon={Calendar} label="Fecha" value={formatDate(item.date)} />
            <Meta icon={Clock} label="Hora" value={item.time} />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-4" />Detalle privado: {item.privateVerificationData.characteristic}</p>
        </div>
      </div>
    </StudentShell>
  );
}
