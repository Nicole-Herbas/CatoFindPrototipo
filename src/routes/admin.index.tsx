import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, CheckCircle2, PackageCheck, XCircle } from "lucide-react";
import { AdminShell, PageTitle, EmptyState } from "@/components/cato";
import { ReportRow, ClaimRow } from "@/components/admin-row";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () => seo("Panel de administración", "Dashboard de Bienestar Estudiantil para gestionar objetos perdidos."),
  component: Dashboard,
});

function Dashboard() {
  const { items, claims, users } = useStore();
  const pending = items.filter((i) => i.status === "PENDING");
  const openClaims = claims.filter((c) => c.status === "pending" || c.status === "validated");
  const stats = [
    { n: pending.length + openClaims.length, l: "Pendientes", i: Clock, c: "bg-warning-soft text-warning" },
    { n: items.filter((i) => ["PUBLISHED", "CLAIMED", "VERIFYING"].includes(i.status)).length, l: "Publicados", i: CheckCircle2, c: "bg-success-soft text-success" },
    { n: items.filter((i) => i.status === "RECOVERED").length, l: "Recuperados", i: PackageCheck, c: "bg-info-soft text-info" },
    { n: items.filter((i) => i.status === "REJECTED").length, l: "Rechazados", i: XCircle, c: "bg-danger-soft text-destructive" },
  ];
  return (
    <AdminShell>
      <PageTitle title="Hola, Bienestar Estudiantil" subtitle="Resumen de la actividad de Cato Find." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border-t-4 border-gold bg-card p-5 shadow-soft">
            <span className={`grid size-10 place-items-center rounded-xl ${s.c}`}><s.i className="size-5" /></span>
            <p className="mt-3 text-3xl font-extrabold text-primary">{s.n}</p>
            <p className="text-sm text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="mb-3 mt-8 flex items-end justify-between">
        <h2 className="text-lg font-bold">Solicitudes pendientes</h2>
        <Link to="/admin/solicitudes" className="text-sm font-semibold text-accent">Ver todas</Link>
      </div>
      {pending.length + openClaims.length === 0 ? <EmptyState title="Todo al día" text="No hay solicitudes pendientes." /> : (
        <div className="space-y-3">
          {openClaims.map((c) => <ClaimRow key={c.id} claim={c} item={items.find((i) => i.id === c.itemId)} users={users} />)}
          {pending.map((i) => <ReportRow key={i.id} item={i} users={users} />)}
        </div>
      )}
    </AdminShell>
  );
}
