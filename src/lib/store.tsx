import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  USERS, seedItems, seedNotices, type Claim, type Item, type Notice, type User,
} from "./data";

export interface Draft {
  category: string; name: string; location: string; date: string; time: string; description: string;
  characteristic: string; image: string; editingId?: string;
}
export const emptyDraft = (): Draft => ({
  category: "", name: "", location: "", date: new Date().toISOString().slice(0, 10), time: "", description: "", characteristic: "", image: "",
});

interface State {
  userId: string | null; users: User[]; items: Item[]; claims: Claim[]; notices: Notice[];
  view: "grid" | "list"; draft: Draft;
}
const KEY = "catofind-v1";
const initial = (): State => ({
  userId: null, users: USERS, items: seedItems(), claims: [], notices: seedNotices(), view: "grid", draft: emptyDraft(),
});
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString().slice(0, 10);

function useStoreImpl() {
  const [s, setS] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...initial(), ...JSON.parse(raw) }); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(s)); }, [s, ready]);

  const user = s.users.find((u) => u.id === s.userId) ?? null;
  const notify = (st: State, userId: string, text: string, tone: Notice["tone"], link?: string): Notice[] =>
    [{ id: uid("n"), userId, text, tone, link, read: false, createdAt: now() }, ...st.notices];
  const patchItem = (st: State, id: string, p: Partial<Item>) => st.items.map((i) => (i.id === id ? { ...i, ...p } : i));

  const login = useCallback((email: string, password: string) => {
    const u = s.users.find((x) => x.email.toLowerCase() === email.toLowerCase().trim());
    if (!u || (u.password ?? "123456") !== password) return null;
    setS((p) => ({ ...p, userId: u.id }));
    return u;
  }, [s.users]);

  return {
    ...s, ready, user,
    login,
    loginAs: (role: "student" | "admin") => setS((p) => ({ ...p, userId: role === "admin" ? "admin-1" : "student-1" })),
    logout: () => setS((p) => ({ ...p, userId: null })),
    register: (name: string, email: string, password: string) => {
      const u: User = { id: uid("u"), name, email, password, role: "student", verifiedEmail: false };
      setS((p) => ({ ...p, users: [...p.users, u], userId: u.id }));
    },
    verifyEmail: () => setS((p) => ({ ...p, users: p.users.map((u) => (u.id === p.userId ? { ...u, verifiedEmail: true } : u)) })),
    updateProfile: (name: string) => setS((p) => ({ ...p, users: p.users.map((u) => (u.id === p.userId ? { ...u, name } : u)) })),
    setView: (view: "grid" | "list") => setS((p) => ({ ...p, view })),
    setDraft: (d: Partial<Draft>) => setS((p) => ({ ...p, draft: { ...p.draft, ...d } })),
    resetDraft: () => setS((p) => ({ ...p, draft: emptyDraft() })),
    submitDraft: () => {
      let id = "";
      setS((p) => {
        const d = p.draft;
        const base = {
          name: d.name, category: d.category, location: d.location, date: d.date, time: d.time, description: d.description, image: d.image,
          privateVerificationData: { characteristic: d.characteristic || "—", approximateLossLocation: d.location, approximateLossDate: d.date },
          status: "PENDING" as const, rejectReason: undefined, infoRequested: false,
        };
        if (d.editingId) {
          id = d.editingId;
          return { ...p, items: patchItem(p, d.editingId, base), draft: emptyDraft() };
        }
        id = uid("obj");
        const item: Item = { ...base, id, reportedBy: p.userId!, createdAt: now() };
        return { ...p, items: [item, ...p.items], draft: emptyDraft() };
      });
      return id;
    },
    editReport: (item: Item) => setS((p) => ({
      ...p, draft: {
        category: item.category, name: item.name, location: item.location, date: item.date, time: item.time,
        description: item.description, characteristic: item.privateVerificationData.characteristic, image: item.image, editingId: item.id,
      },
    })),
    approve: (id: string) => setS((p) => {
      const it = p.items.find((i) => i.id === id)!;
      return { ...p, items: patchItem(p, id, { status: "PUBLISHED", infoRequested: false }), notices: notify(p, it.reportedBy, `Tu reporte "${it.name}" fue aprobado y publicado.`, "success", `/mis-reportes/${id}`) };
    }),
    reject: (id: string, reason: string) => setS((p) => {
      const it = p.items.find((i) => i.id === id)!;
      return { ...p, items: patchItem(p, id, { status: "REJECTED", rejectReason: reason }), notices: notify(p, it.reportedBy, `Tu reporte "${it.name}" fue rechazado: ${reason}`, "danger", `/mis-reportes/${id}`) };
    }),
    requestInfo: (id: string) => setS((p) => {
      const it = p.items.find((i) => i.id === id)!;
      return { ...p, items: patchItem(p, id, { infoRequested: true }), notices: notify(p, it.reportedBy, `Administración necesita más información sobre "${it.name}".`, "warning", `/mis-reportes/${id}`) };
    }),
    createClaim: (c: Omit<Claim, "id" | "userId" | "status" | "createdAt">) => {
      const id = uid("sol");
      setS((p) => ({
        ...p,
        claims: [{ ...c, id, userId: p.userId!, status: "pending", createdAt: now() }, ...p.claims],
        items: patchItem(p, c.itemId, { status: "CLAIMED" }),
        notices: notify(p, p.userId!, "Tu solicitud está siendo revisada.", "warning", "/notificaciones"),
      }));
      return id;
    },
    validateClaim: (claimId: string) => setS((p) => {
      const c = p.claims.find((x) => x.id === claimId)!;
      return {
        ...p, claims: p.claims.map((x) => (x.id === claimId ? { ...x, status: "validated" } : x)),
        items: patchItem(p, c.itemId, { status: "VERIFYING" }),
        notices: notify(p, c.userId, "Tu solicitud fue aprobada. Acércate a Bienestar Estudiantil para recoger tu objeto.", "success"),
      };
    }),
    rejectClaim: (claimId: string) => setS((p) => {
      const c = p.claims.find((x) => x.id === claimId)!;
      return {
        ...p, claims: p.claims.map((x) => (x.id === claimId ? { ...x, status: "rejected" } : x)),
        items: patchItem(p, c.itemId, { status: "PUBLISHED" }),
        notices: notify(p, c.userId, "Tu solicitud de recuperación fue rechazada: los datos no coinciden.", "danger"),
      };
    }),
    deliver: (claimId: string) => setS((p) => {
      const c = p.claims.find((x) => x.id === claimId)!;
      const it = p.items.find((i) => i.id === c.itemId)!;
      let notices = notify(p, c.userId, `Tu objeto "${it.name}" fue marcado como recuperado.`, "success");
      notices = [{ id: uid("n"), userId: it.reportedBy, text: `El objeto que reportaste ("${it.name}") fue devuelto a su dueño. ¡Gracias!`, tone: "info", read: false, createdAt: now() }, ...notices];
      return { ...p, claims: p.claims.map((x) => (x.id === claimId ? { ...x, status: "delivered" } : x)), items: patchItem(p, c.itemId, { status: "RECOVERED", ownerId: c.userId }), notices };
    }),
    markRead: (id?: string) => setS((p) => ({ ...p, notices: p.notices.map((n) => (!id || n.id === id) && n.userId === p.userId ? { ...n, read: true } : n) })),
    resetDemo: () => { localStorage.removeItem(KEY); setS(initial()); },
  };
}

type Store = ReturnType<typeof useStoreImpl>;
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStoreImpl();
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}
