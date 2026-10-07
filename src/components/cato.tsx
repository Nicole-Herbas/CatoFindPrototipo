import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  Bell, Home, Search, Plus, FileText, User as UserIcon, MapPin, Calendar, ImageOff, LayoutDashboard,
  Inbox, Package, LogOut, RotateCcw, Tag, Clock,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { STATUS_LABEL, formatDate, type Item, type Status } from "@/lib/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import escudo from "@/assets/ucb-escudo.png.asset.json";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-extrabold tracking-tight", light ? "text-primary-foreground" : "text-primary")}>
      <img src={escudo.url} alt="Escudo UCB" width={32} height={38} className="h-9 w-auto" />
      <span className="leading-none">CATO <span className={light ? "text-gold" : "text-accent"}>FIND</span>
        <span className={cn("block text-[9px] font-semibold tracking-[0.18em]", light ? "text-gold" : "text-muted-foreground")}>UCB COCHABAMBA</span>
      </span>
    </span>
  );
}

const statusStyle: Record<Status, string> = {
  PENDING: "bg-warning-soft text-warning",
  PUBLISHED: "bg-success-soft text-success",
  CLAIMED: "bg-warning-soft text-warning",
  VERIFYING: "bg-info-soft text-info",
  RECOVERED: "bg-info-soft text-info",
  REJECTED: "bg-danger-soft text-destructive",
};
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", statusStyle[status], className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ItemImage({ item, className }: { item: Pick<Item, "image" | "name">; className?: string }) {
  if (!item.image)
    return (
      <div className={cn("grid place-items-center bg-muted text-muted-foreground", className)}>
        <ImageOff className="size-8" />
      </div>
    );
  return <img src={item.image} alt={item.name} loading="lazy" className={cn("object-cover", className)} />;
}

export function ObjectCard({ item, view = "grid" }: { item: Item; view?: "grid" | "list" }) {
  if (view === "list")
    return (
      <Link to="/objeto/$id" params={{ id: item.id }}
        className="flex items-center gap-4 rounded-2xl border bg-card p-3 shadow-soft transition hover:shadow-lift">
        <ItemImage item={item} className="size-20 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.category} · {item.location}</p>
          <p className="text-xs text-muted-foreground">{formatDate(item.date)} · {item.time}</p>
        </div>
        <StatusBadge status={item.status} className="hidden sm:inline-flex" />
      </Link>
    );
  return (
    <Link to="/objeto/$id" params={{ id: item.id }}
      className="group mb-4 block break-inside-avoid overflow-hidden rounded-2xl bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative overflow-hidden">
        <ItemImage item={item} className="aspect-[4/5] w-full transition duration-500 group-hover:scale-105" />
        <StatusBadge status={item.status} className="absolute left-3 top-3 backdrop-blur" />
      </div>
      <div className="space-y-1 p-3.5">
        <p className="font-semibold leading-tight">{item.name}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Tag className="size-3.5" />{item.category}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" />{item.location}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="size-3.5" />{formatDate(item.date)}</p>
      </div>
    </Link>
  );
}

export function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted p-3">
      <Icon className="mt-0.5 size-4 text-accent" />
      <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium">{value}</p></div>
    </div>
  );
}
export { Clock, Calendar, MapPin, Tag };

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed bg-card p-10 text-center">
      <Search className="mx-auto size-8 text-muted-foreground" />
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function useGuard(role: "student" | "admin") {
  const { ready, user } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!ready) return;
    if (!user) navigate({ to: "/" });
    else if (user.role !== role) navigate({ to: user.role === "admin" ? "/admin" : "/inicio" });
  }, [ready, user, role, navigate]);
  return ready && user?.role === role;
}

const studentNav = [
  { to: "/inicio", label: "Inicio", icon: Home },
  { to: "/buscar", label: "Buscar", icon: Search },
  { to: "/reportar", label: "Reportar", icon: Plus },
  { to: "/mis-reportes", label: "Mis reportes", icon: FileText },
] as const;

export function StudentShell({ children, fab = false }: { children: ReactNode; fab?: boolean }) {
  const ok = useGuard("student");
  const { user, notices, logout } = useStore();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  if (!ok || !user) return <div className="min-h-screen bg-background" />;
  const unread = notices.filter((n) => n.userId === user.id && !n.read).length;
  const active = (to: string) => path === to || path.startsWith(to + "/");
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <header className="sticky top-0 z-30 border-b-2 border-gold bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
          <Link to="/inicio"><Logo /></Link>
          <nav className="hidden flex-1 gap-1 md:flex">
            {studentNav.map((n) => (
              <Link key={n.to} to={n.to}
                className={cn("rounded-full px-4 py-2 text-sm font-medium transition", active(n.to) ? "bg-secondary text-primary shadow-[inset_0_-2px_0_var(--gold)]" : "text-muted-foreground hover:text-foreground")}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/notificaciones" aria-label="Notificaciones" className="relative grid size-10 place-items-center rounded-full hover:bg-muted">
              <Bell className="size-5" />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{unread}</span>}
            </Link>
            <Link to="/perfil" className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-muted">
              <span className="grid size-8 place-items-center rounded-full bg-hero text-xs font-bold text-primary-foreground">{user.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
              <span className="hidden text-sm font-medium lg:inline">{user.name}</span>
            </Link>
            <button onClick={() => { logout(); navigate({ to: "/" }); }} aria-label="Cerrar sesión" className="hidden size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted md:grid">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 animate-rise">{children}</main>
      {fab && (
        <Link to="/reportar" className="fixed bottom-24 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3.5 text-sm font-bold text-gold-foreground shadow-lift transition hover:scale-105 md:bottom-8">
          <Plus className="size-4" /> Reportar objeto
        </Link>
      )}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {[...studentNav.slice(0, 2), studentNav[2], { to: "/mis-reportes", label: "Reportes", icon: FileText }, { to: "/perfil", label: "Perfil", icon: UserIcon }].map((n) => (
          <Link key={n.to} to={n.to} className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium", active(n.to) ? "text-primary" : "text-muted-foreground")}>
            {n.to === "/reportar"
              ? <span className="-mt-6 grid size-12 place-items-center rounded-full bg-hero text-primary-foreground shadow-lift"><Plus className="size-5" /></span>
              : <n.icon className="size-5" />}
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/solicitudes", label: "Solicitudes", icon: Inbox },
  { to: "/admin/objetos", label: "Objetos", icon: Package },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const ok = useGuard("admin");
  const { logout, resetDemo } = useStore();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  if (!ok) return <div className="min-h-screen bg-background" />;
  const active = (to: string) => (to === "/admin" ? path === "/admin" || path === "/admin/" : path.startsWith(to));
  return (
    <div className="min-h-screen bg-muted md:flex">
      <aside className="border-b-4 border-gold bg-hero text-primary-foreground md:border-b-0 md:border-r-4 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:p-5">
        <div className="flex items-center justify-between p-4 md:p-0">
          <Link to="/admin"><Logo light /></Link>
          <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-semibold md:hidden">Admin</span>
        </div>
        <p className="mt-1 hidden text-xs text-primary-foreground/70 md:block">Bienestar Estudiantil</p>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:mt-8 md:flex-col md:p-0">
          {adminNav.map((n) => (
            <Link key={n.to} to={n.to} className={cn("flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active(n.to) ? "bg-primary-foreground text-primary" : "text-primary-foreground/80 hover:bg-primary-foreground/10")}>
              <n.icon className="size-4" />{n.label}
            </Link>
          ))}
          <button onClick={() => { resetDemo(); toast.success("Datos de demostración reiniciados."); navigate({ to: "/" }); }} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-primary-foreground/80 hover:bg-primary-foreground/10 md:mt-auto">
            <RotateCcw className="size-4" />Reset demo
          </button>
          <button onClick={() => { logout(); navigate({ to: "/" }); }} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-primary-foreground/80 hover:bg-primary-foreground/10">
            <LogOut className="size-4" />Cerrar sesión
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-4 animate-rise md:p-8">{children}</main>
    </div>
  );
}

export function PageTitle({ title, subtitle, back }: { title: string; subtitle?: string; back?: ReactNode }) {
  return (
    <div className="mb-6">
      {back}
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export const fieldCls = "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/30";
export const btn = {
  primary: "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50",
  accent: "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50",
  outline: "inline-flex items-center justify-center gap-2 rounded-full border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-muted",
  danger: "inline-flex items-center justify-center gap-2 rounded-full bg-destructive px-6 py-3 text-sm font-semibold text-destructive-foreground transition hover:opacity-90",
  success: "inline-flex items-center justify-center gap-2 rounded-full bg-success px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90",
};
