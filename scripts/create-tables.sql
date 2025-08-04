-- Create the expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  rent DECIMAL(10,2) DEFAULT 0,
  food DECIMAL(10,2) DEFAULT 0,
  groceries DECIMAL(10,2) DEFAULT 0,
  electricity DECIMAL(10,2) DEFAULT 0,
  recharge DECIMAL(10,2) DEFAULT 0,
  transport DECIMAL(10,2) DEFAULT 0,
  medical DECIMAL(10,2) DEFAULT 0,
  shopping DECIMAL(10,2) DEFAULT 0,
  others DECIMAL(10,2) DEFAULT 0,
  investment DECIMAL(10,2) DEFAULT 0,
  emergency_fund DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);
