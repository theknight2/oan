-- Chats Table
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  role TEXT NOT NULL,
  parts JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_chat
    FOREIGN KEY (chat_id)
    REFERENCES chats(id)
    ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Chats Table Policies
CREATE POLICY "Users can view their own chats"
ON chats FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own chats"
ON chats FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own chats"
ON chats FOR UPDATE
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own chats"
ON chats FOR DELETE
USING (auth.uid()::text = user_id);

-- Messages Table Policies
CREATE POLICY "Users can view messages from their own chats"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND chats.user_id = auth.uid()::text
  )
);

CREATE POLICY "Users can create messages for their own chats"
ON messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND chats.user_id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete messages from their own chats"
ON messages FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND chats.user_id = auth.uid()::text
  )
);

-- Indexes for better performance
CREATE INDEX idx_chats_user_id ON chats (user_id);
CREATE INDEX idx_messages_chat_id ON messages (chat_id); 