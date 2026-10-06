import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { StudentShell, ObjectCard, EmptyState, fieldCls } from "@/components/cato";
import { useStore } from "@/lib/store";
import { CATEGORIES, ZONES } from "@/lib/data";
import { seo } from "@/lib/seo";
import { isPublic } from "./inicio";

export const Route = createFileRoute("/buscar")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => seo("Buscar objetos", "Busca y filtra objetos encontrados por tipo, fecha, zona y hora."),
  component: Buscar,
});

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Buscar() {
  const { q: initialQ } = Route.useSearch();
  const { items, view, setView } = useStore();
  const [q, setQ] = useState(initialQ ?? "");
  const [cat, setCat] = useState("Todos");
  const [range, setRange] = useState("any");
  const [custom, setCustom] = useState("");
  const [zone, setZone] = useState("Todas");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return items.filter((i) => {
      if (!isPublic(i.status)) return false;
      if (q && !norm(`${i.name} ${i.description} ${i.category} ${i.location}`).includes(norm(q.trim()))) return false;
      if (cat !== "Todos" && i.category !== cat) return false;
      if (zone !== "Todas" && i.location !== zone) return false;
      const days = (today.getTime() - new Date(i.date + "T00:00:00").getTime()) / 864e5;
      if (range === "today" && days > 0) return false;
      if (range === "7" && days > 7) return false;
      if (range === "30" && days > 30) return false;
      if (range === "custom" && custom && i.date !== custom) return false;
      if (from && i.time < from) return false;
      if (to && i.time > to) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [items, q, cat, zone, range, custom, from, to]);

  const clear = () => { setQ(""); setCat("Todos"); setRange("any"); setCustom(""); setZone("Todas"); setFrom(""); setTo(""); };
  const sel = `${fieldCls} py-2.5`;

  const filters = (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Tipo de objeto
        <select className={`${sel} mt-1.5`} value={cat} onChange={(e) => setCat(e.target.value)}>
          {["Todos", ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="block text-sm font-medium">Fecha
        <select className={`${sel} mt-1.5`} value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="any">Cualquier fecha</option><option value="today">Hoy</option>
          <option value="7">Últimos 7 días</option><option value="30">Últimos 30 días</option>
          <option value="custom">Fecha personalizada</option>
        </select>
      </label>
      {range === "custom" && <input type="date" className={sel} value={custom} onChange={(e) => setCustom(e.target.value)} aria-label="Fecha personalizada" />}
      <label className="block text-sm font-medium">Zona
        <select className={`${sel} mt-1.5`} value={zone} onChange={(e) => setZone(e.target.value)}>
          {["Todas", ...ZONES].map((z) => <option key={z}>{z}</option>)}
        </select>
      </label>
      <div className="text-sm font-medium">Hora
        <div className="mt-1.5 flex items-center gap-2">
          <input type="time" className={sel} value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Desde" />
          <span className="text-muted-foreground">–</span>
          <input type="time" className={sel} value={to} onChange={(e) => setTo(e.target.value)} aria-label="Hasta" />
        </div>
      </div>
      <button onClick={clear} className="flex items-center gap-1.5 text-sm font-semibold text-accent"><X className="size-4" />Limpiar filtros</button>
    </div>
  );

  return (
    <StudentShell fab>
      <div className="flex items-center gap-2 rounded-full bg-card p-1.5 shadow-soft">
        <Search className="ml-3 size-5 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, descripción, categoría o lugar"
          className="min-w-0 flex-1 bg-transparent py-2 outline-none" aria-label="Buscar" />
        <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full bg-muted lg:hidden" aria-label="Filtros">
          <SlidersHorizontal className="size-4" />
        </button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className={`${open ? "block" : "hidden"} h-fit rounded-2xl bg-card p-5 shadow-soft lg:sticky lg:top-24 lg:block`}>
          <p className="mb-4 font-semibold">Filtros</p>{filters}
        </aside>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{results.length}</span> resultados encontrados</p>
            <div className="flex rounded-full bg-card p-1 shadow-soft" role="group" aria-label="Vista">
              {(["grid", "list"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} aria-pressed={view === v}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {v === "grid" ? <LayoutGrid className="size-3.5" /> : <List className="size-3.5" />}{v === "grid" ? "Grid" : "Lista"}
                </button>
              ))}
            </div>
          </div>
          {results.length === 0 ? (
            <EmptyState title="No encontramos objetos" text="Prueba con otras palabras o limpia los filtros." action={<button onClick={clear} className="text-sm font-semibold text-accent">Limpiar filtros</button>} />
          ) : view === "grid" ? (
            <div className="columns-2 gap-4 md:columns-3">{results.map((i) => <ObjectCard key={i.id} item={i} />)}</div>
          ) : (
            <div className="space-y-3">{results.map((i) => <ObjectCard key={i.id} item={i} view="list" />)}</div>
          )}
        </div>
      </div>
    </StudentShell>
  );
}
