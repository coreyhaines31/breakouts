import { neon } from "@neondatabase/serverless";
import { sessionIds, type Counts } from "@/lib/sessions";

const sql = neon(process.env.DATABASE_URL!);

let ready: Promise<unknown> | null = null;
function ensureTable() {
  ready ??= sql`
    create table if not exists votes (
      voter_id text primary key,
      session_id text not null,
      updated_at timestamptz not null default now()
    )
  `.catch((error) => {
    ready = null;
    throw error;
  });
  return ready;
}

export async function getVote(voterId: string): Promise<string | null> {
  await ensureTable();
  const rows = await sql`select session_id from votes where voter_id = ${voterId}`;
  return rows[0]?.session_id ?? null;
}

export async function setVote(voterId: string, sessionId: string) {
  await ensureTable();
  await sql`
    insert into votes (voter_id, session_id) values (${voterId}, ${sessionId})
    on conflict (voter_id) do update set session_id = excluded.session_id, updated_at = now()
  `;
}

export async function getCounts(): Promise<Counts> {
  await ensureTable();
  const rows = await sql`select session_id, count(*)::int as n from votes group by session_id`;
  const counts: Counts = Object.fromEntries(sessionIds.map((id) => [id, 0]));
  for (const r of rows) if (r.session_id in counts) counts[r.session_id] = r.n;
  return counts;
}

export async function resetVotes() {
  await ensureTable();
  await sql`delete from votes`;
}
