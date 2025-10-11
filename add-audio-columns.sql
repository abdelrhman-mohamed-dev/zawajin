-- Add columns for audio message support
-- Run this SQL script if DB_SYNCHRONIZE didn't automatically create the columns

-- Add fileUrl column to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS "fileUrl" text;

-- Add audioDuration column to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS "audioDuration" integer;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'messages'
  AND column_name IN ('fileUrl', 'audioDuration');
