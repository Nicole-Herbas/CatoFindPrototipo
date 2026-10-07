import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AdminShell, PageTitle, EmptyState, fieldCls } from "@/components/cato";
import { ReportRow, ClaimRow } from "@/components/admin-row";
import { useStore } from "@/lib/store";
import { CATEGORIES, ZONES } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/solicitudes/")({
  head: () => seo("Solicitudes", "Reportes y solicitudes de recuperación por revisar."),
  component: Solicitudes,
});

function Solicitudes() {
  const { items, claims, users } = useStore();
  const [tab, setTab] = useState<"reportes" | "recuperaciones">("reportes");
  const [q, setQ] = useState(""); const [zone, setZone] = useState(""); const [cat, setCat] = useState("");
  const [date, setDate] = useState(""); const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const match = (i: (typeof items)[number]) =>
    (!q || i.name.toLowerCase().includes(q.toLowerCase())) && (!zone || i.location === zone) && (!cat || i.category === cat) &&
    (!date || i.date === date) && (!from || i.time >= from) && (!to || i.time <= to);
  const reports = items.filter((i) => i.status === "PENDING" && match(i));
  const recs = claims.filter((c) => (c.status === "pending" || c.status === "validated") && match(items.find((i) => i.id === c.itemId)!));
  const sel = `${fieldCls} py-2.5`;
  return (
    <AdminShell>
      <PageTitle title="Solicitudes" subtitle={`${reports.length + recs.length} solicitudes pendientes`} />
      <div className="mb-4 grid gap-3 rounded-2xl bg-card p-4 shadow-soft md:grid-cols-3 lg:grid-cols-6">
        <label className="relative md:col-span-3 lg:col-span-2"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><input className={`${sel} pl-9`} placeholder="Buscar objeto" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <select className={sel} value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Área"><option value="">Todas las áreas</option>{ZONES.map((z) => <option key={z}>{z}</option>)}</select>
        <select className={sel} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Tipo"><option value="">Todos los tipos</option>{CATEGORIES.map((z) => <option key={z}>{z}</option>)}</select>
        <input type="date" className={sel} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Fecha" />
        <div className="flex gap-1"><input type="time" className={sel} value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Desde" /><input type="time" className={sel} value={to} onChange={(e) => setTo(e.target.value)} aria-label="Hasta" /></div>
      </div>
      <div className="mb-4 flex gap-2">
        {(["reportes", "recuperaciones"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
            {t === "reportes" ? `Reportes nuevos (${reports.length})` : `Recuperaciones (${recs.length})`}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {tab === "reportes"
          ? reports.length ? reports.map((i) => <ReportRow key={i.id} item={i} users={users} />) : <EmptyState title="Sin reportes" text="No hay reportes con estos filtros." />
          : recs.length ? recs.map((c) => <ClaimRow key={c.id} claim={c} item={items.find((i) => i.id === c.itemId)} users={users} />) : <EmptyState title="Sin solicitudes" text="No hay solicitudes de recuperación." />}
      </div>
    </AdminShell>
  );
}
