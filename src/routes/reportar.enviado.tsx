import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { StudentShell, StatusBadge, btn } from "@/components/cato";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/reportar/enviado")({
  validateSearch: (s: Record<string, unknown>): { id?: string | undefined } => ({ id: typeof s["id"] === "string" ? s["id"] : undefined }),
  head: () => seo("Reporte enviado", "Tu reporte fue enviado y está en revisión."),
  component: () => (
    <StudentShell>
      <div className="mx-auto max-w-md rounded-3xl bg-card p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto size-16 text-success" />
        <h1 className="mt-4 text-2xl font-bold">Reporte enviado</h1>
        <p className="mt-2 text-muted-foreground">Tu reporte fue enviado correctamente.</p>
        <StatusBadge status="PENDING" className="mt-4" />
        <p className="mt-4 text-sm text-muted-foreground">Administración revisará la información antes de publicar el objeto.</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link to="/mis-reportes" className={btn.primary}>Ver mis reportes</Link>
          <Link to="/inicio" className={btn.outline}>Volver al inicio</Link>
        </div>
      </div>
    </StudentShell>
  ),
});
