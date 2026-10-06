import { MessageCircle, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export const isPublic = (s: string) => s === "PUBLISHED" || s === "CLAIMED" || s === "VERIFYING";

export function ContactOptions() {
  const sim = (what: string) => toast.info(`${what}: esta acción se simularía en el sistema real.`);
  return (
    <div className="grid gap-3">
      {[
        { icon: Phone, t: "Contactar por teléfono", s: "Bienestar Estudiantil · horario de oficina" },
        { icon: MessageCircle, t: "Enviar mensaje por WhatsApp", s: "Respuesta en horas hábiles" },
        { icon: Mail, t: "Enviar correo electrónico", s: "bienestar@ucb.edu.bo" },
      ].map((o) => (
        <button key={o.t} onClick={() => sim(o.t)} className="flex items-center gap-4 rounded-2xl border bg-card p-4 text-left transition hover:shadow-soft">
          <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><o.icon className="size-5" /></span>
          <span><span className="block font-semibold">{o.t}</span><span className="text-sm text-muted-foreground">{o.s}</span></span>
        </button>
      ))}
    </div>
  );
}

