import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Logo, btn, fieldCls } from "@/components/cato";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";
import mochila from "@/assets/items/mochila.jpg";
import perro from "@/assets/items/perro.jpg";
import audifonos from "@/assets/items/audifonos.jpg";
import ucbLogo from "@/assets/ucb-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => seo("Iniciar sesión", "Cato Find: objetos perdidos y encontrados de la Universidad Católica Boliviana. No todo está perdido."),
  component: Login,
});

function Login() {
  const { login, loginAs } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(email, pw);
    if (!u) return setErr("Correo o contraseña incorrectos.");
    toast.success(`Bienvenida/o, ${u.name}`);
    navigate({ to: u.role === "admin" ? "/admin" : "/inicio" });
  };
  const as = (r: "student" | "admin") => { loginAs(r); navigate({ to: r === "admin" ? "/admin" : "/inicio" }); };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-hero p-12 text-primary-foreground lg:flex lg:flex-col">
        <Logo light />
        <div className="mt-auto max-w-md">
          <span className="mb-4 block h-1.5 w-16 rounded-full bg-gold" /><h1 className="text-5xl font-extrabold leading-tight tracking-tight">No todo está <span className="text-gold">perdido.</span></h1>
          <p className="mt-4 text-primary-foreground/80">Busca, reporta y recupera objetos dentro de la comunidad UCB, sin perderte entre mensajes de WhatsApp.</p>
        </div>
        <div className="mt-10 flex gap-4">
          {[mochila, perro, audifonos].map((src, i) => (
            <img key={src} src={src} alt="" width={160} height={200} className="h-48 w-36 rounded-2xl object-cover shadow-lift" style={{ transform: `rotate(${(i - 1) * 4}deg)` }} />
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-rise">
          <div className="lg:hidden"><Logo /><p className="mt-2 text-muted-foreground">No todo está perdido.</p></div>
          <img src={ucbLogo.url} alt="Universidad Católica Boliviana" className="mb-6 mt-6 h-14 w-auto lg:mt-0" />
          <h2 className="text-2xl font-bold">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-muted-foreground">Usa tu correo institucional.</p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input className={fieldCls} type="email" placeholder="correo@ucb.edu.bo" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Correo institucional" required />
            <input className={fieldCls} type="password" placeholder="Contraseña" value={pw} onChange={(e) => setPw(e.target.value)} aria-label="Contraseña" required />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button className={`${btn.primary} w-full`}>Iniciar sesión</button>
          </form>
          <div className="mt-4 flex justify-between text-sm">
            <Link to="/registro" className="font-semibold text-accent">Registrarse</Link>
            <button onClick={() => toast("Te enviaríamos un enlace de recuperación a tu correo (simulado).")} className="text-muted-foreground hover:text-foreground">Recuperar contraseña</button>
          </div>
          <div className="mt-8 rounded-2xl border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acceso de demostración</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => as("student")} className={`${btn.outline} px-3`}><GraduationCap className="size-4" />Estudiante</button>
              <button onClick={() => as("admin")} className={`${btn.outline} px-3`}><ShieldCheck className="size-4" />Administrador</button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">estudiante@ucb.edu.bo · admin@ucb.edu.bo — contraseña 123456</p>
          </div>
        </div>
      </section>
    </div>
  );
}
