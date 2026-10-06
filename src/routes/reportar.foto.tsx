import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StudentShell, PageTitle, btn } from "@/components/cato";
import { Steps } from "@/components/wizard";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/reportar/foto")({
  head: () => seo("Agregar fotografía", "Sube una foto del objeto encontrado."),
  component: Paso2,
});

function resize(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 900 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

function Paso2() {
  const { draft, setDraft } = useStore();
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const handle = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("El archivo debe ser una imagen.");
    setLoading(true);
    try { setDraft({ image: await resize(f) }); } catch { toast.error("No pudimos leer la imagen."); }
    setLoading(false);
  };
  return (
    <StudentShell>
      <div className="mx-auto max-w-2xl">
        <PageTitle title="Agrega una fotografía" subtitle="Una buena foto ayuda al dueño a reconocer su objeto." />
        <Steps step={2} />
        {draft.image ? (
          <div className="relative overflow-hidden rounded-3xl bg-card shadow-soft">
            <img src={draft.image} alt="Vista previa" className="max-h-[480px] w-full object-contain" />
            <button onClick={() => setDraft({ image: "" })} className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-card shadow-soft" aria-label="Quitar foto"><Trash2 className="size-4" /></button>
          </div>
        ) : (
          <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
            className={`rounded-3xl border-2 border-dashed p-10 text-center transition ${drag ? "border-accent bg-info-soft" : "bg-card"}`}>
            <ImagePlus className="mx-auto size-10 text-accent" />
            <p className="mt-3 font-semibold">{loading ? "Procesando…" : "Arrastra una foto aquí"}</p>
            <p className="text-sm text-muted-foreground">JPG o PNG</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => ref.current?.click()} className={btn.primary}><ImagePlus className="size-4" />Subir archivo</button>
              <button onClick={() => camRef.current?.click()} className={btn.outline}><Camera className="size-4" />Tomar fotografía</button>
            </div>
            <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => handle(e.target.files?.[0])} />
            <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => handle(e.target.files?.[0])} />
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <Link to="/reportar" className={btn.outline}>Atrás</Link>
          <button onClick={() => (draft.image ? navigate({ to: "/reportar/confirmar" }) : toast.error("Agrega una fotografía para continuar."))} className={btn.primary}>Siguiente</button>
        </div>
      </div>
    </StudentShell>
  );
}
