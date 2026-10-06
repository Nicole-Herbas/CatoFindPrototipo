import { createFileRoute } from "@tanstack/react-router";
import { StudentShell, PageTitle } from "@/components/cato";
import { seo } from "@/lib/seo";
import { ContactOptions } from "./objeto.$id";

export const Route = createFileRoute("/contactar")({
  head: () => seo("Contactar administración", "Comunícate con Bienestar Estudiantil sobre un objeto perdido."),
  component: () => (
    <StudentShell>
      <div className="mx-auto max-w-lg">
        <PageTitle title="¿Necesitas ayuda?" subtitle="Bienestar Estudiantil te atiende por estos canales." />
        <ContactOptions />
      </div>
    </StudentShell>
  ),
});
