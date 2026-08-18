import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJson, writeJson } from "@/lib/localDb";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE = "repair-requests.json";

interface RepairRequest {
  id: string;
  name: string;
  email: string;
  pieceDescription: string;
  issue: string;
  requestedAt: string;
}

export async function POST(request: Request) {
  let body: Partial<RepairRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  const name = (body.name || "").toString().trim().slice(0, 100);
  const email = (body.email || "").toString().trim();
  const pieceDescription = (body.pieceDescription || "").toString().trim().slice(0, 200);
  const issue = (body.issue || "").toString().trim().slice(0, 500);

  if (name.length < 2) return NextResponse.json({ error: "Escribe tu nombre." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  if (pieceDescription.length < 3) return NextResponse.json({ error: "Describe qué pieza es." }, { status: 400 });
  if (issue.length < 3) return NextResponse.json({ error: "Cuéntanos qué le pasa a la pieza." }, { status: 400 });

  const requests = await readJson<RepairRequest[]>(FILE, []);
  const entry: RepairRequest = {
    id: `REP-${Date.now().toString(36).toUpperCase()}`,
    name,
    email,
    pieceDescription,
    issue,
    requestedAt: new Date().toISOString(),
  };
  requests.push(entry);
  await writeJson(FILE, requests);

  return NextResponse.json({ ok: true, id: entry.id });
}

// Bug de seguridad real corregido en auditoría: antes filtraba por un
// `email` que mandaba el propio cliente en la query string — cualquiera
// podía leer las reparaciones de otra persona cambiando el parámetro
// (mismo tipo de fallo que la fuga de pedidos ya corregida anteriormente,
// ver /api/orders). Ahora la identidad viene SIEMPRE de la sesión firmada,
// nunca de un valor que controle quien hace la petición.
export async function GET() {
  const cookieStore = await cookies();
  const session = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ error: "No has iniciado sesión." }, { status: 401 });

  const requests = await readJson<RepairRequest[]>(FILE, []);
  return NextResponse.json({ repairs: requests.filter((r) => r.email.toLowerCase() === session.email.toLowerCase()) });
}
