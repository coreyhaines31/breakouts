import { cookies } from "next/headers";
import { z } from "zod";
import { sessionIds } from "@/lib/sessions";
import { getVote, setVote } from "@/lib/store";

const COOKIE = "breakout_voter";

export async function GET() {
  const voterId = (await cookies()).get(COOKIE)?.value;
  const choice = voterId ? await getVote(voterId) : null;
  return Response.json({ choice });
}

const body = z.object({ sessionId: z.enum(sessionIds as [string, ...string[]]) });

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid session" }, { status: 400 });
  }

  const jar = await cookies();
  let voterId = jar.get(COOKIE)?.value;
  if (!voterId) {
    voterId = crypto.randomUUID();
    jar.set(COOKIE, voterId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  await setVote(voterId, parsed.data.sessionId);
  return Response.json({ choice: parsed.data.sessionId });
}
