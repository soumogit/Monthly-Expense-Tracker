-- Add credit_card_bill column to expenses table
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS credit_card_bill DECIMAL(10,2) DEFAULT 0;

-- Update existing records to have 0 for credit card bill if null
UPDATE expenses SET credit_card_bill = 0 WHERE credit_card_bill IS NULL;
