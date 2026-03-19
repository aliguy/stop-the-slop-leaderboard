import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const tab = (req.query.tab as string) || "reporters";
  const limit = Math.min(parseInt((req.query.limit as string) || "50"), 100);
  const cycleId = req.query.cycle_id as string | undefined;

  try {
    // Get target cycle
    let cycle;
    if (cycleId) {
      const { data } = await supabase
        .from("cycles")
        .select("*")
        .eq("id", cycleId)
        .single();
      cycle = data;
    } else {
      const { data } = await supabase
        .from("cycles")
        .select("*")
        .eq("status", "active")
        .single();
      cycle = data;
    }

    if (!cycle) {
      return res.status(200).json({ reporters: [], offenders: [], cycle: null });
    }

    if (tab === "offenders") {
      const { data, error } = await supabase
        .from("offender_scores")
        .select("*")
        .eq("cycle_id", cycle.id)
        .order("avg_ai_score", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return res.status(200).json({ offenders: data || [], cycle });
    }

    // Default: reporters
    const { data, error } = await supabase
      .from("reporter_scores")
      .select(
        `
        total_flags,
        total_points,
        profiles!inner (
          display_name,
          linkedin_handle,
          avatar_url
        )
      `
      )
      .eq("cycle_id", cycle.id)
      .order("total_points", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const reporters = (data || []).map((row: any) => ({
      display_name: row.profiles.display_name,
      linkedin_handle: row.profiles.linkedin_handle,
      avatar_url: row.profiles.avatar_url,
      total_flags: row.total_flags,
      total_points: row.total_points,
    }));

    return res.status(200).json({ reporters, cycle });
  } catch (err: any) {
    console.error("Leaderboard error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
