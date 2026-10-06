import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck, CheckCircle2 } from "lucide-react";
import { btn, fieldCls } from "@/components/cato";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/verificar-correo")({
  head: () => seo("Verificar correo", "Confirma tu correo institucional para usar Cato Find."),
  component: Verificar,
});

function Verificar() {
  const { verifyEmail, user } = useStore();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setErr("Ingresa el código de 6 dígitos (demo: 123456).");
    verifyEmail(); setDone(true);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md animate-rise rounded-3xl bg-card p-8 text-center shadow-soft">
        {done ? (
          <>
            <CheckCircle2 className="mx-auto size-14 text-success" />
            <h1 className="mt-4 text-2xl font-bold">Correo verificado ✓</h1>
            <p className="mt-2 text-muted-foreground">Ya puedes usar Cato Find.</p>
            <button onClick={() => navigate({ to: user ? "/inicio" : "/" })} className={`${btn.primary} mt-6 w-full`}>Continuar</button>
          </>
        ) : (
          <form onSubmit={submit}>
            <MailCheck className="mx-auto size-14 text-accent" />
            <h1 className="mt-4 text-2xl font-bold">Cuenta creada.</h1>
            <p className="mt-2 text-muted-foreground">Enviamos un código de verificación a tu correo institucional{user ? ` (${user.email})` : ""}.</p>
            <input className={`${fieldCls} mt-6 text-center text-2xl tracking-[0.5em]`} inputMode="numeric" maxLength={6} placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} aria-label="Código" />
            {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
            <button className={`${btn.primary} mt-4 w-full`}>Verificar</button>
          </form>
        )}
      </div>
    </div>
  );
}
