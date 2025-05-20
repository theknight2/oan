# Supabase Integration for OpenAlpha MCP Chat

## Overview
This document explains how to set up and use Supabase as the database backend for OpenAlpha MCP Chat.

## Setup Instructions

### 1. Environment Variables

Add the following variables to your `.env.local` file:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xgbdwdlmtdmqypggocfr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnYmR3ZGxtdGRtcXlwZ2dvY2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTYzODQsImV4cCI6MjA2MzIzMjM4NH0.ZVC1lnAtM3ecmTwGwjp0gtcATY_dinfVPVNa3fYo0dg
```

### 2. Database Tables

Create the following tables in your Supabase project:

#### Chats Table
```sql
CREATE TABLE chats (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Messages Table
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  parts JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_chat
    FOREIGN KEY (chat_id)
    REFERENCES chats(id)
    ON DELETE CASCADE
);
```

### 3. Row Level Security (Optional but Recommended)

Enable row level security and add the following policies to protect your data:

#### Chats Table Policies
```sql
-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Policy for reading only your own chats
CREATE POLICY "Users can view their own chats"
ON chats FOR SELECT
USING (auth.uid()::text = user_id);

-- Policy for inserting chats
CREATE POLICY "Users can create their own chats"
ON chats FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Policy for updating chats
CREATE POLICY "Users can update their own chats"
ON chats FOR UPDATE
USING (auth.uid()::text = user_id);

-- Policy for deleting chats
CREATE POLICY "Users can delete their own chats"
ON chats FOR DELETE
USING (auth.uid()::text = user_id);
```

#### Messages Table Policies
```sql
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy for reading only your own messages
CREATE POLICY "Users can view messages from their own chats"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND chats.user_id = auth.uid()::text
  )
);

-- Policy for inserting messages
CREATE POLICY "Users can create messages for their own chats"
ON messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND chats.user_id = auth.uid()::text
  )
);

-- Policy for deleting messages
CREATE POLICY "Users can delete messages from their own chats"
ON messages FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND chats.user_id = auth.uid()::text
  )
);
```

## Usage

The integration is already set up in the codebase. The application will automatically use Supabase for storing and retrieving chat data.

### Key Files

- `lib/supabase.ts` - Supabase client configuration
- `lib/supabase-chat-store.ts` - Implementation of chat store using Supabase
- `app/api/chats/route.ts` - API routes updated to use Supabase

## Troubleshooting

If you encounter issues with the Supabase connection:

1. Check that your environment variables are correctly set
2. Verify that your Supabase tables are created with the correct structure
3. Check the browser console for any error messages
4. Verify that the row level security policies (if enabled) are correctly configured

## Migrating from Previous Database

If you were previously using another database (like PostgreSQL with Drizzle ORM), you can migrate your data to Supabase using tools like:

- Supabase CLI for migrations
- Custom scripts to export data from the old database and import to Supabase 