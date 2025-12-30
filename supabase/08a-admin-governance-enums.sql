-- =============================================
-- PENSTRIKE INKWORKS - ADMIN GOVERNANCE SCHEMA (Part A)
-- Phase 8: Enum Definitions
-- 
-- ⚠️ RUN THIS FILE FIRST
-- Wait for it to complete, then run 08b-admin-governance-tables.sql
-- =============================================

-- Create new role enum with admin support
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('reader', 'author', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new values to existing book_status enum
-- These must be committed before they can be used in any queries
ALTER TYPE book_status ADD VALUE IF NOT EXISTS 'submitted';
ALTER TYPE book_status ADD VALUE IF NOT EXISTS 'in_review';
ALTER TYPE book_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE book_status ADD VALUE IF NOT EXISTS 'archived';

-- ✅ DONE - Now run 08b-admin-governance-tables.sql
