import mochila from "@/assets/items/mochila.jpg";
import samsung from "@/assets/items/samsung.jpg";
import iphone from "@/assets/items/iphone.jpg";
import chompa from "@/assets/items/chompa.jpg";
import audifonos from "@/assets/items/audifonos.jpg";
import billetera from "@/assets/items/billetera.jpg";
import llaves from "@/assets/items/llaves.jpg";
import cuaderno from "@/assets/items/cuaderno.jpg";
import documento from "@/assets/items/documento.jpg";
import perro from "@/assets/items/perro.jpg";
import gato from "@/assets/items/gato.jpg";
import paraguas from "@/assets/items/paraguas.jpg";

export type Status = "PENDING" | "PUBLISHED" | "CLAIMED" | "VERIFYING" | "RECOVERED" | "REJECTED";
export type Role = "student" | "admin";

export const CATEGORIES = ["Electrónica", "Ropa", "Documentos", "Mascotas", "Accesorios", "Otros"] as const;
export const ZONES = [
  "Biblioteca", "Cafetería", "Bloque A", "Bloque B", "Auditorio",
  "Estacionamiento", "Patio", "Laboratorio", "Administración",
] as const;
export const REJECT_REASONS = [
  "Información insuficiente.", "Fotografía inválida.", "Datos inconsistentes.",
  "Objeto no corresponde al alcance.", "Otro.",
];

export interface User {
  id: string; name: string; email: string; role: Role; verifiedEmail: boolean; password?: string;
}
export interface Item {
  id: string; name: string; category: string; description: string; location: string;
  date: string; time: string; image: string; status: Status; reportedBy: string; createdAt: string;
  privateVerificationData: { characteristic: string; approximateLossLocation: string; approximateLossDate: string };
  rejectReason?: string; infoRequested?: boolean; ownerId?: string;
}
export interface Claim {
  id: string; itemId: string; userId: string; lossLocation: string; lossDate: string;
  characteristic: string; extra: string; status: "pending" | "validated" | "rejected" | "delivered"; createdAt: string;
}
export interface Notice {
  id: string; userId: string; text: string; tone: "success" | "warning" | "info" | "danger"; link?: string; read: boolean; createdAt: string;
}

export const USERS: User[] = [
  { id: "student-1", name: "Nicole Herbas", email: "estudiante@ucb.edu.bo", role: "student", verifiedEmail: true, password: "123456" },
  { id: "admin-1", name: "Bienestar Estudiantil", email: "admin@ucb.edu.bo", role: "admin", verifiedEmail: true, password: "123456" },
  { id: "student-2", name: "Diego Mamani", email: "diego.mamani@ucb.edu.bo", role: "student", verifiedEmail: true },
  { id: "student-3", name: "Camila Rojas", email: "camila.rojas@ucb.edu.bo", role: "student", verifiedEmail: true },
  { id: "student-4", name: "Andrés Quispe", email: "andres.quispe@ucb.edu.bo", role: "student", verifiedEmail: false },
];

const d = (offset: number) => {
  const x = new Date(); x.setDate(x.getDate() - offset);
  return x.toISOString().slice(0, 10);
};
const mk = (
  id: string, name: string, category: string, location: string, off: number, time: string, image: string,
  description: string, characteristic: string, status: Status = "PUBLISHED", reportedBy = "student-2",
): Item => ({
  id, name, category, location, date: d(off), time, image, description, status, reportedBy, createdAt: d(off),
  privateVerificationData: { characteristic, approximateLossLocation: location, approximateLossDate: d(off) },
});

export const seedItems = (): Item[] => [
  mk("obj-1", "Mochila negra", "Accesorios", "Biblioteca", 0, "10:30", mochila, "Mochila negra de tela con bolsillo frontal y cierre doble.", "Tiene una pequeña marca en el bolsillo interno"),
  mk("obj-2", "Celular Samsung", "Electrónica", "Biblioteca", 1, "15:10", samsung, "Celular Samsung gris oscuro, triple cámara.", "Fondo de pantalla con una foto de playa; funda rota en una esquina", "PUBLISHED", "student-3"),
  mk("obj-3", "iPhone negro", "Electrónica", "Bloque B", 2, "09:00", iphone, "iPhone negro de doble cámara, sin funda.", "Raya pequeña al lado del botón de volumen"),
  mk("obj-4", "Chompa azul", "Ropa", "Cafetería", 3, "13:45", chompa, "Chompa de lana azul, talla M.", "Etiqueta con iniciales C.R. bordadas", "PUBLISHED", "student-1"),
  mk("obj-5", "Audífonos blancos", "Electrónica", "Biblioteca", 4, "11:20", audifonos, "Audífonos inalámbricos blancos con estuche de carga.", "El estuche tiene un sticker de estrella por dentro", "PUBLISHED", "student-3"),
  mk("obj-6", "Billetera negra", "Accesorios", "Bloque A", 5, "08:15", billetera, "Billetera de cuero negro, plegable.", "Contiene una foto familiar y carnet de biblioteca"),
  mk("obj-7", "Llaves", "Otros", "Estacionamiento", 6, "18:40", llaves, "Juego de 3 llaves con llavero de montaña.", "Una de las llaves es de auto marca Toyota"),
  mk("obj-8", "Cuaderno verde", "Documentos", "Laboratorio", 8, "16:00", cuaderno, "Cuaderno espiral de tapa verde.", "Apuntes de Química Orgánica con nombre en la primera hoja", "PUBLISHED", "student-4"),
  mk("obj-9", "Credencial / documento", "Documentos", "Administración", 10, "12:00", documento, "Credencial con cinta azul en porta-carnet transparente.", "Número de carnet termina en 482", "PUBLISHED", "student-3"),
  mk("obj-10", "Perro pequeño", "Mascotas", "Patio", 1, "14:30", perro, "Cachorro café, muy amigable. Está bajo cuidado de Bienestar Estudiantil.", "Tiene una mancha blanca en el pecho y collar rojo"),
  mk("obj-11", "Gato atigrado", "Mascotas", "Bloque B", 12, "10:00", gato, "Gato gris atigrado, tranquilo.", "Ojos verdes y punta de la cola más oscura"),
  mk("obj-12", "Paraguas azul", "Otros", "Cafetería", 15, "17:20", paraguas, "Paraguas largo azul marino con mango curvo.", "Mango con cinta adhesiva gris"),
  mk("obj-13", "Calculadora científica", "Electrónica", "Bloque A", 0, "09:40", "", "Calculadora Casio gris.", "Nombre grabado en la tapa trasera", "PENDING", "student-1"),
  mk("obj-14", "Botella térmica", "Otros", "Auditorio", 2, "19:00", "", "Botella metálica negra.", "Sticker de la UCB abajo", "PENDING", "student-3"),
];

export const seedNotices = (): Notice[] => [
  { id: "n-1", userId: "student-1", text: "Tu reporte fue aprobado.", tone: "success", link: "/mis-reportes", read: false, createdAt: d(1) },
  { id: "n-2", userId: "student-1", text: "Se encontró un objeto que podría coincidir con tu búsqueda.", tone: "info", link: "/objeto/obj-1", read: false, createdAt: d(0) },
];

export const STATUS_LABEL: Record<Status, string> = {
  PENDING: "En revisión", PUBLISHED: "Publicado", CLAIMED: "Recuperación solicitada",
  VERIFYING: "Verificando propietario", RECOVERED: "Recuperado", REJECTED: "Rechazado",
};

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-BO", { day: "numeric", month: "long" });
