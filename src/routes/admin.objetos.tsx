import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PageTitle, ItemImage, StatusBadge } from "@/components/cato";
import { useStore } from "@/lib/store";
import { formatDate, STATUS_LABEL, type Status } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/objetos")({
  head: () => seo("Objetos publicados", "Todos los objetos gestionados en Cato Find."),
  component: Objetos,
});

function Objetos() {
  const { items } = useStore();
  const [f, setF] = useState<"" | Status>("");
  const list = items.filter((i) => !f || i.status === f);
  return (
    <AdminShell>
      <PageTitle title="Objetos" subtitle={`${list.length} objetos`} />
      <div className="mb-4 flex flex-wrap gap-2">
        {(["", "PENDING", "PUBLISHED", "CLAIMED", "VERIFYING", "RECOVERED", "REJECTED"] as const).map((s) => (
          <button key={s} onClick={() => setF(s)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${f === s ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>{s ? STATUS_LABEL[s] : "Todos"}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {list.map((i) => (
          <Link key={i.id} to="/admin/reportes/$id" params={{ id: i.id }} className="overflow-hidden rounded-2xl bg-card shadow-soft transition hover:shadow-lift">
            <ItemImage item={i} className="aspect-[4/3] w-full" />
            <div className="p-3"><p className="truncate font-semibold">{i.name}</p><p className="text-xs text-muted-foreground">{i.location} · {formatDate(i.date)}</p><StatusBadge status={i.status} className="mt-2" /></div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
