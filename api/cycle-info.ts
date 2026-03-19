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

  try {
    // Get active cycle
    const { data: activeCycle } = await supabase
      .from("cycles")
      .select("*")
      .eq("status", "active")
      .single();

    // Get past cycles with archives
    const { data: pastCycles } = await supabase
      .from("cycles")
      .select("*")
      .eq("status", "completed")
      .order("end_date", { ascending: false })
      .limit(12);

    const past = [];
    if (pastCycles) {
      for (const cycle of pastCycles) {
        const { data: archive } = await supabase
          .from("cycle_archive")
          .select("*")
          .eq("cycle_id", cycle.id)
          .single();

        past.push({ cycle, archive: archive || null });
      }
    }

    return res.status(200).json({
      active: activeCycle || null,
      past,
    });
  } catch (err: any) {
    console.error("Cycle info error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
