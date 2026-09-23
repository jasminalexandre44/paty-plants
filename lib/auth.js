import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "paty_session";
const SECRET = process.env.AUTH_SECRET || "change-this-auth-secret";

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function createSession(user) {
  const payload = encode({ ...user, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  return `${payload}.${sign(payload)}`;
}

export function readSession() {
  const value = cookies().get(COOKIE_NAME)?.value;
  if (!value) return null;
  try {
    const [payload, signature] = value.split(".");
    if (!payload || sign(payload) !== signature) return null;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function sessionCookie(value) {
  return { name: COOKIE_NAME, value, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 };
}

export function clearSessionCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}

export function users() {
  return [
    { id: "admin", name: process.env.ADMIN_NAME || "Admin", email: process.env.ADMIN_EMAIL || "admin@patyplants.local", password: process.env.ADMIN_PASSWORD || "admin123", role: "admin" },
    { id: "demo-user", name: "Demo User", email: "user@patyplants.local", password: "user123", role: "user" },
  ];
}

export function findUser(email, password) {
  return users().find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
}

export function canManagePlant(session, plant) {
  return Boolean(session && (session.role === "admin" || session.id === plant.ownerId));
}

export { COOKIE_NAME };