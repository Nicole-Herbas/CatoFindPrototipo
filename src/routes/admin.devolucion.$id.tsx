import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, ItemImage, btn, EmptyState } from "@/components/cato";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/devolucion/$id")({
  head: () => seo("Confirmar devolución", "Registra la entrega del objeto a su propietario."),
  component: Devolucion,
});

function Devolucion() {
  const { id } = Route.useParams();
  const { claims, items, users, deliver } = useStore();
  const claim = claims.find((c) => c.id === id);
  const item = items.find((i) => i.id === claim?.itemId);
  if (!claim || !item) return <AdminShell><EmptyState title="Solicitud no encontrada" text="" /></AdminShell>;
  const u = users.find((x) => x.id === claim.userId);
  if (claim.status === "delivered")
    return (
      <AdminShell>
        <div className="mx-auto max-w-md rounded-3xl bg-card p-8 text-center shadow-soft">
          <CheckCircle2 className="mx-auto size-16 text-success" />
          <h1 className="mt-4 text-2xl font-bold">Objeto recuperado</h1>
          <p className="mt-2 text-muted-foreground">El objeto fue entregado correctamente a su propietario.</p>
          <Link to="/admin" className={`${btn.primary} mt-6`}>Volver al dashboard</Link>
        </div>
      </AdminShell>
    );
  return (
    <AdminShell>
      <div className="mx-auto max-w-lg rounded-3xl bg-card p-6 shadow-soft">
        <PackageCheck className="size-10 text-accent" />
        <h1 className="mt-3 text-2xl font-bold">Confirmar devolución</h1>
        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-muted p-3"><ItemImage item={item} className="size-16 rounded-xl" /><p className="font-semibold">{item.name}</p></div>
        <dl className="mt-4 divide-y text-sm">
          {[["Propietario", `${u?.name} (${u?.email})`], ["Fecha de entrega", new Date().toLocaleDateString("es-BO", { dateStyle: "long" })], ["Administrador responsable", "Bienestar Estudiantil"]].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
          ))}
        </dl>
        {claim.status === "validated"
          ? <button onClick={() => { deliver(id); toast.success("Objeto marcado como recuperado."); }} className={`${btn.success} mt-6 w-full`}>Confirmar entrega</button>
          : <p className="mt-6 text-sm text-warning">Primero valida al propietario.</p>}
      </div>
    </AdminShell>
  );
}
