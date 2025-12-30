-- =============================================
-- STEP 1: Run this FIRST
-- =============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create account_type enum (if not exists)
DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('reader', 'author');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create book_status enum (if not exists)  
DO $$ BEGIN
    CREATE TYPE book_status AS ENUM ('draft', 'pending', 'published', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create payment_status enum (if not exists)
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
