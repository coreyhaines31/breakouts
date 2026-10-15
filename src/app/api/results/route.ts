import { connection } from "next/server";
import { getCounts } from "@/lib/store";

export async function GET() {
  await connection();
  const counts = await getCounts();
  return Response.json(
    { counts },
    { headers: { "Cache-Control": "no-store" } },
  );
}
