import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUserId(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const userId = await getUserId(req.headers.authorization || null);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Get active cycle
    const { data: cycle } = await supabase
      .from("cycles")
      .select("id")
      .eq("status", "active")
      .single();

    if (!cycle) {
      return res.status(200).json({
        rank: null,
        total_points: 0,
        total_flags: 0,
        flags_today: 0,
        max_flags_per_day: 50,
        cycle_id: null,
      });
    }

    // Get user's score for this cycle
    const { data: score } = await supabase
      .from("reporter_scores")
      .select("total_flags, total_points")
      .eq("reporter_id", userId)
      .eq("cycle_id", cycle.id)
      .single();

    // Calculate rank
    let rank: number | null = null;
    if (score) {
      const { count } = await supabase
        .from("reporter_scores")
        .select("*", { count: "exact", head: true })
        .eq("cycle_id", cycle.id)
        .gt("total_points", score.total_points);

      rank = (count || 0) + 1;
    }

    // Get today's flag count
    const { data: rateLimit } = await supabase
      .from("rate_limits")
      .select("flag_count")
      .eq("user_id", userId)
      .eq("date", new Date().toISOString().split("T")[0])
      .single();

    return res.status(200).json({
      rank,
      total_points: score?.total_points || 0,
      total_flags: score?.total_flags || 0,
      flags_today: rateLimit?.flag_count || 0,
      max_flags_per_day: 50,
      cycle_id: cycle.id,
    });
  } catch (err: any) {
    console.error("User stats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
