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
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getUserId(req.headers.authorization || null);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    post_hash,
    ai_score,
    signals,
    post_author_name,
    post_author_handle,
    post_text_preview,
  } = req.body;

  if (!post_hash || ai_score === undefined || !Array.isArray(signals)) {
    return res.status(400).json({ error: "Missing required fields: post_hash, ai_score, signals" });
  }

  try {
    const { data, error } = await supabase.rpc("submit_flag", {
      p_reporter_id: userId,
      p_post_hash: post_hash,
      p_ai_score: Math.round(ai_score),
      p_signals: JSON.stringify(signals),
      p_post_author_name: post_author_name || null,
      p_post_author_handle: post_author_handle || null,
      p_post_text_preview: post_text_preview?.slice(0, 200) || null,
    });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err: any) {
    console.error("Submit flag error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
