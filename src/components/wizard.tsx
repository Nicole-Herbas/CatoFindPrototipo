import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function Steps({ step }: { step: 1 | 2 | 3 }) {
  const labels = ["Información", "Foto", "Confirmación"];
  return (
    <ol className="mb-8 flex items-center gap-2">
      {labels.map((l, i) => {
        const n = i + 1;
        return (
          <li key={l} className="flex flex-1 items-center gap-2">
            <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold", n < step ? "bg-success text-primary-foreground" : n === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {n < step ? <Check className="size-4" /> : n}
            </span>
            <span className={cn("hidden text-sm font-medium sm:inline", n === step ? "text-foreground" : "text-muted-foreground")}>{l}</span>
            {n < 3 && <span className="h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
