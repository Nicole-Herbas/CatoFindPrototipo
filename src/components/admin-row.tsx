import { Link } from "@tanstack/react-router";
import { ItemImage, StatusBadge } from "@/components/cato";
import { formatDate, type Claim, type Item, type User } from "@/lib/data";

export function ReportRow({ item, users }: { item: Item; users: User[] }) {
  const u = users.find((x) => x.id === item.reportedBy);
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-soft">
      <ItemImage item={item} className="size-16 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{item.name}</p>
        <p className="text-sm text-muted-foreground">{item.location} · {formatDate(item.date)} · {item.time}</p>
        <p className="text-xs text-muted-foreground">Reportado por {u?.name ?? "—"}</p>
      </div>
      <StatusBadge status={item.status} className="hidden sm:inline-flex" />
      <Link to="/admin/reportes/$id" params={{ id: item.id }} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Revisar</Link>
    </div>
  );
}

export function ClaimRow({ claim, item, users }: { claim: Claim; item?: Item; users: User[] }) {
  const u = users.find((x) => x.id === claim.userId);
  const to = claim.status === "validated" ? "/admin/devolucion/$id" : "/admin/verificar-propietario/$id";
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-soft">
      {item && <ItemImage item={item} className="size-16 shrink-0 rounded-xl" />}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">Recuperación: {item?.name}</p>
        <p className="text-sm text-muted-foreground">Solicitante: {u?.name}</p>
        <p className="text-xs text-muted-foreground">{formatDate(claim.createdAt)}</p>
      </div>
      {item && <StatusBadge status={item.status} className="hidden sm:inline-flex" />}
      <Link to={to} params={{ id: claim.id }} className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-gold-foreground">{claim.status === "validated" ? "Entregar" : "Verificar"}</Link>
    </div>
  );
}
