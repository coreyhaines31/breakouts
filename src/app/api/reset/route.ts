import { resetVotes } from "@/lib/store";

export async function POST() {
  await resetVotes();
  return Response.json({ ok: true });
}
