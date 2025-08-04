-- Add username column to expenses table
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS username VARCHAR(50) NOT NULL DEFAULT 'default_user';

-- Create an index on username for faster queries
CREATE INDEX IF NOT EXISTS idx_expenses_username ON expenses(username);

-- Update the existing index to include username
DROP INDEX IF EXISTS idx_expenses_date;
CREATE INDEX IF NOT EXISTS idx_expenses_date_username ON expenses(date, username);
