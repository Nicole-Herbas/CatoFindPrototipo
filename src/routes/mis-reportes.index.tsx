import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StudentShell, PageTitle, StatusBadge, ItemImage, EmptyState, btn } from "@/components/cato";
import { useStore } from "@/lib/store";
import { formatDate, type Status } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/mis-reportes/")({
  head: () => seo("Mis reportes", "Consulta el estado de los objetos que reportaste."),
  component: MisReportes,
});

const tabs: { k: "all" | Status; l: string }[] = [
  { k: "all", l: "Todos" }, { k: "PENDING", l: "En revisión" }, { k: "PUBLISHED", l: "Publicados" },
  { k: "REJECTED", l: "Rechazados" }, { k: "RECOVERED", l: "Recuperados" },
];

function MisReportes() {
  const { items, user } = useStore();
  const [tab, setTab] = useState<"all" | Status>("all");
  const mine = items.filter((i) => i.reportedBy === user?.id);
  const list = mine.filter((i) => tab === "all" || i.status === tab || (tab === "PUBLISHED" && (i.status === "CLAIMED" || i.status === "VERIFYING")));
  return (
    <StudentShell fab>
      <PageTitle title="Mis reportes" subtitle={`${mine.length} objetos reportados`} />
      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4">
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${tab === t.k ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-soft"}`}>{t.l}</button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState title="Aún no hay reportes aquí" text="Cuando encuentres un objeto, repórtalo para ayudar a su dueño." action={<Link to="/reportar" className={btn.primary}>Reportar objeto</Link>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((i) => (
            <Link key={i.id} to="/mis-reportes/$id" params={{ id: i.id }} className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-soft transition hover:shadow-lift">
              <ItemImage item={i} className="size-20 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{i.name}</p>
                <p className="text-sm text-muted-foreground">{i.location} · {formatDate(i.date)}</p>
                <StatusBadge status={i.status} className="mt-2" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </StudentShell>
  );
}
