// Shared types for the Stop the Slop Leaderboard

export interface Profile {
  id: string;
  display_name: string;
  linkedin_handle: string | null;
  avatar_url: string | null;
  device_fingerprint: string | null;
  is_banned: boolean;
  created_at: string;
}

export interface Cycle {
  id: string;
  start_date: string;
  end_date: string;
  prize_pool_cents: number;
  status: "active" | "completed" | "upcoming";
  winner_id: string | null;
  created_at: string;
}

export interface Flag {
  id: string;
  reporter_id: string;
  cycle_id: string;
  post_hash: string;
  post_author_name: string | null;
  post_author_handle: string | null;
  ai_score: number;
  signals: string[];
  post_text_preview: string | null;
  created_at: string;
}

export interface ReporterScore {
  id: string;
  reporter_id: string;
  cycle_id: string;
  total_flags: number;
  total_points: number;
  updated_at: string;
}

export interface OffenderScore {
  id: string;
  cycle_id: string;
  author_handle: string;
  author_name: string | null;
  total_flags_received: number;
  avg_ai_score: number;
  posts_analyzed: number;
  updated_at: string;
}

export interface CycleArchive {
  id: string;
  cycle_id: string;
  final_rankings: ReporterRanking[];
  final_offenders: OffenderRanking[];
  winner_display_name: string | null;
  winner_points: number | null;
  prize_amount_cents: number | null;
  created_at: string;
}

// API response types

export interface ReporterRanking {
  display_name: string;
  linkedin_handle: string | null;
  avatar_url: string | null;
  total_flags: number;
  total_points: number;
}

export interface OffenderRanking {
  author_handle: string;
  author_name: string | null;
  total_flags_received: number;
  avg_ai_score: number;
  posts_analyzed: number;
}

export interface LeaderboardResponse {
  reporters?: ReporterRanking[];
  offenders?: OffenderRanking[];
  cycle: Cycle;
}

export interface CycleInfoResponse {
  active: Cycle | null;
  past: Array<{
    cycle: Cycle;
    archive: CycleArchive;
  }>;
}

export interface UserStatsResponse {
  rank: number | null;
  total_points: number;
  total_flags: number;
  flags_today: number;
  max_flags_per_day: number;
  cycle_id: string | null;
}

export interface SubmitFlagRequest {
  post_hash: string;
  ai_score: number;
  signals: string[];
  post_author_name?: string;
  post_author_handle?: string;
  post_text_preview?: string;
}

export interface SubmitFlagResponse {
  success: boolean;
  error?: string;
  message?: string;
  cycle_id?: string;
}
