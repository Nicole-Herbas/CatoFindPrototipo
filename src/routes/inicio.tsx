import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { StudentShell, ObjectCard } from "@/components/cato";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/data";
import { seo } from "@/lib/seo";
import { isPublic } from "@/components/contact";

export const Route = createFileRoute("/inicio")({
  head: () => seo("Inicio", "Explora los objetos encontrados dentro de la comunidad universitaria UCB."),
  component: Inicio,
});

function Inicio() {
  const { items } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todos");
  const list = items.filter((i) => isPublic(i.status) && (cat === "Todos" || i.category === cat))
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <StudentShell fab>
      <section className="relative overflow-hidden rounded-3xl bg-hero px-6 py-10 text-primary-foreground md:px-12 md:py-14">
        <span className="absolute inset-x-0 top-0 h-1.5 bg-gold" /><p className="inline-flex rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">No todo está perdido.</p>
        <h1 className="mt-2 max-w-xl text-3xl font-extrabold tracking-tight md:text-5xl">Encuentra lo que perdiste</h1>
        <p className="mt-3 max-w-lg text-primary-foreground/80">Explora los objetos encontrados dentro de la comunidad universitaria.</p>
        <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/buscar", search: { q } }); }}
          className="mt-6 flex max-w-xl items-center gap-2 rounded-full bg-card p-1.5 shadow-lift">
          <Search className="ml-3 size-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="¿Qué estás buscando?" aria-label="Buscar"
            className="min-w-0 flex-1 bg-transparent py-2 text-foreground outline-none" />
          <button className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground">Buscar</button>
        </form>
      </section>

      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1">
        {["Todos", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-soft hover:text-foreground"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mb-4 mt-8 flex items-end justify-between">
        <h2 className="text-xl font-bold">Objetos encontrados recientemente</h2>
        <Link to="/buscar" search={{}} className="flex items-center gap-1 text-sm font-semibold text-accent">Ver todo <ArrowRight className="size-4" /></Link>
      </div>
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
        {list.map((i) => <ObjectCard key={i.id} item={i} />)}
      </div>
    </StudentShell>
  );
}
