CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_code_hash TEXT UNIQUE,
  google_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
 
CREATE INDEX idx_accounts_sync_code_hash ON accounts (sync_code_hash);
CREATE INDEX idx_accounts_google_id ON accounts (google_id);
 
CREATE TABLE boards (
  account_id UUID PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  ciphertext TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
