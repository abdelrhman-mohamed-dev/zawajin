-- Add 'seen' field to profile_visits table
-- This migration adds a boolean column to track whether a profile visit has been seen by the profile owner

ALTER TABLE profile_visits
ADD COLUMN IF NOT EXISTS seen BOOLEAN NOT NULL DEFAULT false;

-- Add a comment to the column for documentation
COMMENT ON COLUMN profile_visits.seen IS 'Indicates whether the profile owner has seen this visit';

-- Optional: Create an index on the seen column for better query performance when filtering unseen visits
CREATE INDEX IF NOT EXISTS idx_profile_visits_seen ON profile_visits(profile_owner_id, seen) WHERE seen = false;
