import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";
import { readJson, writeJson } from "./localDb";
import { sendEmail } from "./email";

/**
 * Autenticación de demostración: contraseñas con hash real (scrypt +
 * sal), sesión en cookie firmada con HMAC. Suficiente para probar el
 * flujo completo en local, pero NO es un sistema de producción:
 * sin verificación de email, sin límite de intentos, sin rotación de
 * secretos. Antes de producción, sustituir por un proveedor real
 * (NextAuth/Auth.js, Clerk, Supabase Auth...).
 */
const USERS_FILE = "users.json";
const SESSION_COOKIE = "aldara_session";
// TODO: define AUTH_SECRET en .env.local para producción (ver .env.example).
const AUTH_SECRET = process.env.AUTH_SECRET || "aldara-dev-secret-cambia-esto";

export interface StoredUser {
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface PublicUser {
  email: string;
  name: string;
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

export async function getUsers(): Promise<StoredUser[]> {
  return readJson<StoredUser[]>(USERS_FILE, []);
}

export async function createUser(email: string, name: string, password: string): Promise<PublicUser> {
  const users = await getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Ya existe una cuenta con ese email.");
  }
  const salt = randomBytes(16).toString("hex");
  const user: StoredUser = { email, name, salt, passwordHash: hashPassword(password, salt), createdAt: new Date().toISOString() };
  users.push(user);
  await writeJson(USERS_FILE, users);
  return { email: user.email, name: user.name };
}

export async function verifyUser(email: string, password: string): Promise<PublicUser | null> {
  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  const candidate = hashPassword(password, user.salt);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(user.passwordHash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return { email: user.email, name: user.name };
}

export async function changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
  const users = await getUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) throw new Error("Cuenta no encontrada.");
  const user = users[idx];
  const candidate = hashPassword(currentPassword, user.salt);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(user.passwordHash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("La contraseña actual no es correcta.");
  const salt = randomBytes(16).toString("hex");
  users[idx] = { ...user, salt, passwordHash: hashPassword(newPassword, salt) };
  await writeJson(USERS_FILE, users);
}

export interface PasswordResetToken {
  email: string;
  tokenHash: string;
  expiresAt: string;
}

const RESET_TOKENS_FILE = "password-reset-tokens.json";
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

function hashToken(token: string): string {
  return createHmac("sha256", AUTH_SECRET).update(token).digest("hex");
}

/**
 * Recuperación de contraseña con proveedor de email demo: en vez de un
 * envío real (SendGrid/Postmark/etc.), el "email" se registra en
 * data/demo-emails.json — visible para depurar el flujo end-to-end sin
 * depender de credenciales externas. Ver README para sustituir por un
 * DemoEmailProvider real antes de producción. Por seguridad no se revela
 * si el email existe o no: el llamador siempre responde { ok: true }.
 */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  const tokens = await readJson<PasswordResetToken[]>(RESET_TOKENS_FILE, []);
  const withoutExisting = tokens.filter((t) => t.email.toLowerCase() !== email.toLowerCase());
  withoutExisting.push({ email: user.email, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString() });
  await writeJson(RESET_TOKENS_FILE, withoutExisting);

  await sendEmail({
    to: user.email,
    subject: "Recupera tu contraseña — ALDARA",
    body: `Restablece tu contraseña aquí: /account/restablecer?token=${token}&email=${encodeURIComponent(user.email)} (caduca en 1 hora)`,
  });

  return token;
}

export async function resetPasswordWithToken(email: string, token: string, newPassword: string): Promise<void> {
  const tokens = await readJson<PasswordResetToken[]>(RESET_TOKENS_FILE, []);
  const entry = tokens.find((t) => t.email.toLowerCase() === email.toLowerCase());
  if (!entry) throw new Error("El enlace de recuperación no es válido o ya se ha usado.");
  if (new Date(entry.expiresAt).getTime() < Date.now()) throw new Error("El enlace de recuperación ha caducado. Solicita uno nuevo.");

  const a = Buffer.from(hashToken(token), "hex");
  const b = Buffer.from(entry.tokenHash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("El enlace de recuperación no es válido.");

  const users = await getUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) throw new Error("Cuenta no encontrada.");
  const salt = randomBytes(16).toString("hex");
  users[idx] = { ...users[idx], salt, passwordHash: hashPassword(newPassword, salt) };
  await writeJson(USERS_FILE, users);

  await writeJson(RESET_TOKENS_FILE, tokens.filter((t) => t.email.toLowerCase() !== email.toLowerCase()));
}

function sign(value: string): string {
  return createHmac("sha256", AUTH_SECRET).update(value).digest("hex");
}

export function createSessionCookieValue(user: PublicUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSessionCookieValue(value: string | undefined): PublicUser | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  if (sign(payload) !== signature) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as PublicUser;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
