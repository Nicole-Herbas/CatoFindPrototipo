import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AdminShell, EmptyState } from "@/components/cato";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/solicitudes/$id")({
  head: () => seo("Detalle de solicitud", "Detalle de una solicitud en Cato Find."),
  component: SolicitudDetalle,
});

function SolicitudDetalle() {
  const { id } = Route.useParams();
  const { items, claims, ready } = useStore();
  if (!ready) return <AdminShell>{null}</AdminShell>;
  if (items.some((i) => i.id === id)) return <Navigate to="/admin/reportes/$id" params={{ id }} />;
  const c = claims.find((x) => x.id === id);
  if (c) return <Navigate to={c.status === "validated" ? "/admin/devolucion/$id" : "/admin/verificar-propietario/$id"} params={{ id }} />;
  return <AdminShell><EmptyState title="Solicitud no encontrada" text="" /></AdminShell>;
}
