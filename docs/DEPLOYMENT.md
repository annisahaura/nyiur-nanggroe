# Nyiur Nanggroe — Production Deployment Guide

This guide explains how to deploy the Nyiur Nanggroe platform to Vercel and set up Supabase.

## Prerequisites

1. **Vercel CLI** or a Vercel account connected to your GitHub repository.
2. A **Supabase project** (Free or Pro tier) with PostgreSQL database.
3. Access keys for external API integrations (OpenAI, Gemini, Midtrans).

---

## Step 1: Database Setup on Supabase

1. Go to the **Supabase Dashboard** and create a new project.
2. Initialize the database schema:
   - Run migrations if using Supabase CLI: `npm run db:push` or apply SQL scripts directly.
3. Enable Row Level Security (RLS) on all production tables.
4. Set up Supabase Storage buckets for product images and seller profile banners (make them public/authenticated as required).

---

## Step 2: Deploy to Vercel

1. Link your repository in Vercel.
2. Add the following **Environment Variables** (check `.env.production` for template):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `MIDTRANS_SERVER_KEY`
   - `MIDTRANS_CLIENT_KEY`
   - `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
   - `MIDTRANS_IS_PRODUCTION`
   - `NEXT_PUBLIC_APP_URL`
3. Click **Deploy**. Vercel will build and serve your Next.js application globally.

---

## Step 3: Production SSL and Headers

Security configurations inside [vercel.json](file:///d:/lama/NYIURNANGGROE/vercel.json) will automatically enforce:
- SSL enforcement
- HTTP Strict Transport Security (HSTS)
- Denying embedding inside frames (X-Frame-Options: DENY)
- Preventing content sniffing (X-Content-Type-Options: nosniff)
