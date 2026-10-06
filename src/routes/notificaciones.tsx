import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, CheckCircle2, AlertCircle, Clock, Info } from "lucide-react";
import { StudentShell, PageTitle, EmptyState } from "@/components/cato";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notificaciones")({
  head: () => seo("Notificaciones", "Novedades sobre tus reportes y solicitudes."),
  component: Notificaciones,
});

const icons = {
  success: [CheckCircle2, "bg-success-soft text-success"],
  warning: [Clock, "bg-warning-soft text-warning"],
  danger: [AlertCircle, "bg-danger-soft text-destructive"],
  info: [Info, "bg-info-soft text-info"],
} as const;

function Notificaciones() {
  const { notices, user, markRead } = useStore();
  const navigate = useNavigate();
  const mine = notices.filter((n) => n.userId === user?.id);
  return (
    <StudentShell>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between">
          <PageTitle title="Notificaciones" />
          {mine.some((n) => !n.read) && <button onClick={() => markRead()} className="mt-2 text-sm font-semibold text-accent">Marcar todo como leído</button>}
        </div>
        {mine.length === 0 ? <EmptyState title="Sin notificaciones" text="Te avisaremos cuando haya novedades." /> : (
          <div className="space-y-2">
            {mine.map((n) => {
              const [Icon, cls] = icons[n.tone];
              return (
                <button key={n.id} onClick={() => { markRead(n.id); if (n.link) navigate({ to: n.link }); }}
                  className={cn("flex w-full items-start gap-3 rounded-2xl p-4 text-left transition hover:shadow-soft", n.read ? "bg-card" : "bg-card ring-2 ring-accent/20")}>
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", cls)}><Icon className="size-5" /></span>
                  <span className="flex-1"><span className="block text-sm font-medium">{n.text}</span><span className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</span></span>
                  {!n.read && <span className="mt-2 size-2 rounded-full bg-accent" aria-label="No leída" />}
                </button>
              );
            })}
          </div>
        )}
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Bell className="size-3.5" />Notificaciones simuladas del prototipo</p>
      </div>
    </StudentShell>
  );
}
