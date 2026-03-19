import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify caller is either Vercel Cron or an admin user
  const cronSecret = req.headers["authorization"];
  const isCron = cronSecret === `Bearer ${process.env.CRON_SECRET}`;

  if (!isCron) {
    // Check for admin user
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.slice(7);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check admin role in profile or user metadata
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    // For now, check if user email matches admin list
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
    if (!adminEmails.includes(user.email || "")) {
      return res.status(403).json({ error: "Forbidden — admin access required" });
    }
  }

  const nextPrizeCents = req.body?.next_prize_cents || 50000;

  try {
    // Get active cycle
    const { data: activeCycle } = await supabase
      .from("cycles")
      .select("id")
      .eq("status", "active")
      .single();

    if (!activeCycle) {
      return res.status(400).json({ error: "No active cycle to close" });
    }

    const { data, error } = await supabase.rpc("close_cycle", {
      p_cycle_id: activeCycle.id,
      p_next_prize_cents: nextPrizeCents,
    });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err: any) {
    console.error("Close cycle error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
