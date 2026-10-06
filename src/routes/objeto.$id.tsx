import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, X } from "lucide-react";
import { ContactOptions } from "@/components/contact";
import { StudentShell, ItemImage, StatusBadge, Meta, MapPin, Calendar, Clock, Tag, btn, EmptyState } from "@/components/cato";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/objeto/$id")({
  head: () => seo("Detalle del objeto", "Información pública de un objeto encontrado en la UCB."),
  component: Detalle,
});

function Detalle() {
  const { id } = Route.useParams();
  const { items, claims, user } = useStore();
  const router = useRouter();
  const [contact, setContact] = useState(false);
  const item = items.find((i) => i.id === id);
  if (!item || item.status === "PENDING" || item.status === "REJECTED")
    return <StudentShell><EmptyState title="Objeto no disponible" text="Este objeto no existe o aún no fue publicado." action={<Link to="/inicio" className={btn.primary}>Volver al inicio</Link>} /></StudentShell>;
  const myClaim = claims.find((c) => c.itemId === id && c.userId === user?.id && c.status !== "rejected");
  const canClaim = item.status === "PUBLISHED" && item.reportedBy !== user?.id;

  return (
    <StudentShell>
      <button onClick={() => router.history.back()} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Volver</button>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ItemImage item={item} className="aspect-square w-full rounded-3xl" />
          {item.image && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 1, 2].map((k) => <img key={k} src={item.image} alt="" className="aspect-square w-full rounded-xl object-cover" style={{ objectPosition: ["center", "left", "right"][k] }} />)}
            </div>
          )}
        </div>
        <div>
          <StatusBadge status={item.status} />
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{item.name}</h1>
          <p className="mt-3 text-muted-foreground">{item.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Meta icon={Tag} label="Categoría" value={item.category} />
            <Meta icon={MapPin} label="Lugar encontrado" value={item.location} />
            <Meta icon={Calendar} label="Fecha" value={formatDate(item.date)} />
            <Meta icon={Clock} label="Hora aproximada" value={item.time} />
          </div>
          <div className="mt-6 flex gap-3 rounded-2xl bg-info-soft p-4 text-sm">
            <Lock className="size-5 shrink-0 text-info" />
            <p>Algunos datos del objeto se mantienen ocultos para comprobar que realmente pertenece a su propietario.</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {myClaim ? (
              <Link to="/notificaciones" className={`${btn.outline} flex-1`}>Tu solicitud está en revisión</Link>
            ) : canClaim ? (
              <Link to="/recuperar/$id" params={{ id }} className={`${btn.primary} flex-1`}>Solicitar recuperación</Link>
            ) : (
              <span className={`${btn.outline} flex-1 opacity-60`}>{item.reportedBy === user?.id ? "Tú reportaste este objeto" : "Recuperación en proceso"}</span>
            )}
            <button onClick={() => setContact(true)} className={`${btn.outline} flex-1`}>Contactar administración</button>
          </div>
        </div>
      </div>
      {contact && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center" onClick={() => setContact(false)}>
          <div className="w-full max-w-md animate-rise rounded-3xl bg-background p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">¿Necesitas ayuda con este objeto?</h2>
              <button onClick={() => setContact(false)} aria-label="Cerrar"><X className="size-5" /></button>
            </div>
            <ContactOptions />
          </div>
        </div>
      )}
    </StudentShell>
  );
}
