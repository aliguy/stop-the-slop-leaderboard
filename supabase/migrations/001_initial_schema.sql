-- Stop the Slop Leaderboard — Initial Schema
-- Run this in the Supabase SQL Editor for the dedicated leaderboard project

-- ══════════════════════════════════════════════════════════════
-- TABLES
-- ══════════════════════════════════════════════════════════════

-- Profiles: extends Supabase auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  linkedin_handle TEXT UNIQUE,
  avatar_url TEXT,
  device_fingerprint TEXT,
  is_banned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cycles: monthly competitions
CREATE TABLE cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  prize_pool_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('active', 'completed', 'upcoming')),
  winner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cycles_status ON cycles(status);

-- Flags: individual post flag submissions
CREATE TABLE flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  post_hash TEXT NOT NULL,
  post_author_name TEXT,
  post_author_handle TEXT,
  ai_score INTEGER NOT NULL CHECK (ai_score >= 0 AND ai_score <= 100),
  signals JSONB NOT NULL DEFAULT '[]'::jsonb,
  post_text_preview TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_hash, reporter_id)
);

CREATE INDEX idx_flags_reporter ON flags(reporter_id);
CREATE INDEX idx_flags_cycle ON flags(cycle_id);
CREATE INDEX idx_flags_author_handle ON flags(post_author_handle);

-- Reporter scores: materialized per-cycle leaderboard
CREATE TABLE reporter_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  total_flags INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(reporter_id, cycle_id)
);

CREATE INDEX idx_reporter_scores_cycle_points ON reporter_scores(cycle_id, total_points DESC);

-- Offender scores: aggregated slop poster scores per cycle
CREATE TABLE offender_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  author_handle TEXT NOT NULL,
  author_name TEXT,
  total_flags_received INTEGER NOT NULL DEFAULT 0,
  avg_ai_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  posts_analyzed INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cycle_id, author_handle)
);

CREATE INDEX idx_offender_scores_cycle ON offender_scores(cycle_id, avg_ai_score DESC);

-- Rate limits: per-user daily flag cap
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  flag_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Cycle archive: finalized results snapshot
CREATE TABLE cycle_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  final_rankings JSONB NOT NULL DEFAULT '[]'::jsonb,
  final_offenders JSONB NOT NULL DEFAULT '[]'::jsonb,
  winner_display_name TEXT,
  winner_points INTEGER,
  prize_amount_cents INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ══════════════════════════════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- Submit a flag (atomic transaction)
CREATE OR REPLACE FUNCTION submit_flag(
  p_reporter_id UUID,
  p_post_hash TEXT,
  p_ai_score INTEGER,
  p_signals JSONB,
  p_post_author_name TEXT DEFAULT NULL,
  p_post_author_handle TEXT DEFAULT NULL,
  p_post_text_preview TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_cycle_id UUID;
  v_daily_count INTEGER;
  v_existing UUID;
BEGIN
  -- Check if user is banned
  IF EXISTS (SELECT 1 FROM profiles WHERE id = p_reporter_id AND is_banned = true) THEN
    RETURN jsonb_build_object('success', false, 'error', 'account_banned');
  END IF;

  -- Validate minimum score
  IF p_ai_score < 25 THEN
    RETURN jsonb_build_object('success', false, 'error', 'score_too_low', 'message', 'Minimum AI score of 25 required');
  END IF;

  -- Get active cycle
  SELECT id INTO v_cycle_id FROM cycles WHERE status = 'active' LIMIT 1;
  IF v_cycle_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'no_active_cycle');
  END IF;

  -- Check rate limit (50/day)
  SELECT flag_count INTO v_daily_count
  FROM rate_limits
  WHERE user_id = p_reporter_id AND date = CURRENT_DATE;

  IF COALESCE(v_daily_count, 0) >= 50 THEN
    RETURN jsonb_build_object('success', false, 'error', 'rate_limit_exceeded', 'message', 'Maximum 50 flags per day');
  END IF;

  -- Check duplicate
  SELECT id INTO v_existing
  FROM flags
  WHERE post_hash = p_post_hash AND reporter_id = p_reporter_id;

  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'duplicate_flag', 'message', 'You already flagged this post');
  END IF;

  -- Insert the flag
  INSERT INTO flags (reporter_id, cycle_id, post_hash, post_author_name, post_author_handle, ai_score, signals, post_text_preview)
  VALUES (p_reporter_id, v_cycle_id, p_post_hash, p_post_author_name, p_post_author_handle, p_ai_score, p_signals, p_post_text_preview);

  -- Upsert reporter score
  INSERT INTO reporter_scores (reporter_id, cycle_id, total_flags, total_points)
  VALUES (p_reporter_id, v_cycle_id, 1, p_ai_score)
  ON CONFLICT (reporter_id, cycle_id) DO UPDATE SET
    total_flags = reporter_scores.total_flags + 1,
    total_points = reporter_scores.total_points + p_ai_score,
    updated_at = now();

  -- Upsert offender score (only if we have an author handle)
  IF p_post_author_handle IS NOT NULL AND p_post_author_handle != '' THEN
    INSERT INTO offender_scores (cycle_id, author_handle, author_name, total_flags_received, avg_ai_score, posts_analyzed)
    VALUES (v_cycle_id, p_post_author_handle, p_post_author_name, 1, p_ai_score, 1)
    ON CONFLICT (cycle_id, author_handle) DO UPDATE SET
      author_name = COALESCE(EXCLUDED.author_name, offender_scores.author_name),
      total_flags_received = offender_scores.total_flags_received + 1,
      avg_ai_score = (
        (offender_scores.avg_ai_score * offender_scores.total_flags_received + p_ai_score)
        / (offender_scores.total_flags_received + 1)
      ),
      posts_analyzed = (
        SELECT COUNT(DISTINCT f.post_hash)
        FROM flags f
        WHERE f.post_author_handle = p_post_author_handle AND f.cycle_id = v_cycle_id
      ) + 1,
      updated_at = now();
  END IF;

  -- Upsert rate limit
  INSERT INTO rate_limits (user_id, date, flag_count)
  VALUES (p_reporter_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date) DO UPDATE SET
    flag_count = rate_limits.flag_count + 1;

  RETURN jsonb_build_object('success', true, 'cycle_id', v_cycle_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Close a cycle and create the next one
CREATE OR REPLACE FUNCTION close_cycle(p_cycle_id UUID, p_next_prize_cents INTEGER DEFAULT 50000)
RETURNS JSONB AS $$
DECLARE
  v_winner_id UUID;
  v_winner_name TEXT;
  v_winner_points INTEGER;
  v_rankings JSONB;
  v_offenders JSONB;
  v_prize INTEGER;
  v_end_date DATE;
  v_next_start DATE;
  v_next_end DATE;
BEGIN
  -- Get cycle info
  SELECT prize_pool_cents, end_date INTO v_prize, v_end_date
  FROM cycles WHERE id = p_cycle_id AND status = 'active';

  IF v_prize IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'cycle_not_active');
  END IF;

  -- Find winner (highest total_points)
  SELECT rs.reporter_id, p.display_name, rs.total_points
  INTO v_winner_id, v_winner_name, v_winner_points
  FROM reporter_scores rs
  JOIN profiles p ON p.id = rs.reporter_id
  WHERE rs.cycle_id = p_cycle_id
  ORDER BY rs.total_points DESC
  LIMIT 1;

  -- Snapshot top reporters
  SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_rankings
  FROM (
    SELECT p.display_name, p.linkedin_handle, p.avatar_url, rs.total_flags, rs.total_points
    FROM reporter_scores rs
    JOIN profiles p ON p.id = rs.reporter_id
    WHERE rs.cycle_id = p_cycle_id
    ORDER BY rs.total_points DESC
    LIMIT 50
  ) t;

  -- Snapshot top offenders
  SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_offenders
  FROM (
    SELECT author_handle, author_name, total_flags_received, avg_ai_score, posts_analyzed
    FROM offender_scores
    WHERE cycle_id = p_cycle_id
    ORDER BY avg_ai_score DESC
    LIMIT 50
  ) t;

  -- Archive
  INSERT INTO cycle_archive (cycle_id, final_rankings, final_offenders, winner_display_name, winner_points, prize_amount_cents)
  VALUES (p_cycle_id, v_rankings, v_offenders, v_winner_name, v_winner_points, v_prize);

  -- Mark cycle completed
  UPDATE cycles SET status = 'completed', winner_id = v_winner_id WHERE id = p_cycle_id;

  -- Create next cycle
  v_next_start := v_end_date + 1;
  v_next_end := (date_trunc('month', v_next_start) + interval '1 month' - interval '1 day')::date;

  INSERT INTO cycles (start_date, end_date, prize_pool_cents, status)
  VALUES (v_next_start, v_next_end, p_next_prize_cents, 'active');

  RETURN jsonb_build_object(
    'success', true,
    'winner', v_winner_name,
    'winner_points', v_winner_points,
    'prize_cents', v_prize
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reporter_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE offender_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_archive ENABLE ROW LEVEL SECURITY;

-- Profiles: read all, update own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cycles: read all
CREATE POLICY "cycles_select" ON cycles FOR SELECT USING (true);

-- Flags: insert own, read all
CREATE POLICY "flags_select" ON flags FOR SELECT USING (true);
CREATE POLICY "flags_insert" ON flags FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Reporter scores: read all
CREATE POLICY "reporter_scores_select" ON reporter_scores FOR SELECT USING (true);

-- Offender scores: read all
CREATE POLICY "offender_scores_select" ON offender_scores FOR SELECT USING (true);

-- Rate limits: read own only
CREATE POLICY "rate_limits_select" ON rate_limits FOR SELECT USING (auth.uid() = user_id);

-- Cycle archive: read all
CREATE POLICY "cycle_archive_select" ON cycle_archive FOR SELECT USING (true);
