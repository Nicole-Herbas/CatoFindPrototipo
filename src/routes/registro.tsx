import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo, btn, fieldCls } from "@/components/cato";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/registro")({
  head: () => seo("Crear cuenta", "Regístrate en Cato Find con tu correo institucional de la UCB."),
  component: Registro,
});

function Registro() {
  const { register, users } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ nombre: "", apellido: "", email: "", pw: "", pw2: "" });
  const [touched, setTouched] = useState(false);
  const errs = {
    email: !/^[^@\s]+@ucb\.edu\.bo$/i.test(f.email) ? "Usa un correo institucional @ucb.edu.bo" : users.some((u) => u.email === f.email) ? "Este correo ya está registrado" : "",
    pw: f.pw.length < 6 ? "Mínimo 6 caracteres" : "",
    pw2: f.pw !== f.pw2 ? "Las contraseñas no coinciden" : "",
    nombre: !f.nombre.trim() || !f.apellido.trim() ? "Completa tu nombre y apellido" : "",
  };
  const valid = !Object.values(errs).some(Boolean);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setTouched(true);
    if (!valid) return;
    register(`${f.nombre.trim()} ${f.apellido.trim()}`, f.email.trim(), f.pw);
    navigate({ to: "/verificar-correo" });
  };
  const E = ({ k }: { k: keyof typeof errs }) => (touched && errs[k] ? <p className="text-xs text-destructive">{errs[k]}</p> : null);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <form onSubmit={submit} className="w-full max-w-md animate-rise space-y-3 rounded-3xl bg-card p-8 shadow-soft">
        <Logo />
        <h1 className="pt-4 text-2xl font-bold">Crear cuenta</h1>
        <div className="grid grid-cols-2 gap-3">
          <input className={fieldCls} placeholder="Nombre" value={f.nombre} onChange={set("nombre")} />
          <input className={fieldCls} placeholder="Apellido" value={f.apellido} onChange={set("apellido")} />
        </div>
        <E k="nombre" />
        <input className={fieldCls} type="email" placeholder="correo@ucb.edu.bo" value={f.email} onChange={set("email")} />
        <E k="email" />
        <input className={fieldCls} type="password" placeholder="Contraseña" value={f.pw} onChange={set("pw")} />
        <E k="pw" />
        <input className={fieldCls} type="password" placeholder="Confirmar contraseña" value={f.pw2} onChange={set("pw2")} />
        <E k="pw2" />
        <button className={`${btn.primary} w-full`}>Crear cuenta</button>
        <p className="text-center text-sm text-muted-foreground">¿Ya tienes cuenta? <Link to="/" className="font-semibold text-accent">Inicia sesión</Link></p>
      </form>
    </div>
  );
}
