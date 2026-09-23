import { NextResponse } from "next/server";
import { createSession, findUser, sessionCookie } from "@/lib/auth";

export async function POST(request) {
  const { email, password } = await request.json();
  const user = findUser(email || "", password || "");
  if (!user) return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });

  const response = NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } });
  response.cookies.set(sessionCookie(createSession({ id: user.id, name: user.name, role: user.role })));
  return response;
}