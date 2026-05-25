# Fellonics — Setup Guide

## Supabase Setup

### 1. Create the Supabase project

- Go to [supabase.com](https://supabase.com/) → New Project
- Name it `fellonics` (or similar)
- Choose a strong database password and save it
- Pick the region closest to your users (EU West if UK-based)
- Wait for the project to provision (~1 minute)

### 2. Get your API credentials

- Go to **Project Settings → API**
- Copy:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` (keep private — never commit)

### 3. Run the database schema

- Go to **SQL Editor** in the Supabase dashboard
- Click **New Query**
- Paste the entire contents of `/supabase/schema.sql`
- Click **Run** — all tables, policies, and indexes will be created

### 4. Create the Storage bucket

- Go to **Storage** in the Supabase dashboard
- Click **New Bucket**
- Name it exactly: `post-images`
- Toggle **Public bucket** to ON
- Click **Create bucket**

### 5. Create your admin user

- Go to **Authentication → Users**
- Click **Add user → Create new user**
- Enter your email and a strong password
- Copy the UUID shown in the users table
- Go to SQL Editor, run:

```sql
insert into profiles (id, full_name, bio, twitter_handle)
values (
  'PASTE-YOUR-UUID-HERE',
  'Your Name',
  'A short bio about you and your interest in geometry.',
  'yourtwitter'
);
```

### 6. Enable Email Auth

- Go to **Authentication → Providers**
- Ensure **Email** is enabled (default)
- Under Email → Confirm email, you can disable email confirmation for simplicity (single-admin blog)

### 7. Create your `.env.local`

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=        ← from step 2
NEXT_PUBLIC_SUPABASE_ANON_KEY=   ← from step 2
SUPABASE_SERVICE_ROLE_KEY=       ← from step 2
NEXT_PUBLIC_SITE_URL=            ← http://localhost:3000 for local dev
ANTHROPIC_API_KEY=               ← from console.anthropic.com
REVALIDATION_SECRET=             ← random string, e.g. openssl rand -hex 32
MIGRATION_AUTHOR_ID=             ← your profile UUID from step 5
```

### 8. Verify locally

```bash
npm install
npm run dev
```

- Visit `http://localhost:3000` — the landing page should load
- Visit `http://localhost:3000/admin/login` — log in with your credentials from step 5

---

## Vercel Deployment

Do this after pushing the repo to GitHub:

1. Go to [vercel.com](https://vercel.com/) → **New Project → Import from GitHub**
2. Select `davidfellonics/fellonicsblog`
3. In **Environment Variables**, add all values from `.env.local` — but set `NEXT_PUBLIC_SITE_URL` to your Vercel production URL (e.g. `https://fellonicsblog.vercel.app`)
4. Click **Deploy**
5. After first deploy, copy the production URL and update `NEXT_PUBLIC_SITE_URL` in Vercel env vars if it differs

---

## Migrating from Blogger

1. In **Google Takeout**, select only **Blogger**, choose `.zip` format, export once
2. Unzip and find the file named `blog-MM-DD-YYYY.xml` (in the `Blogger/` folder)
3. Copy it to `/scripts/data/blogger-export.xml` in this project
4. Set `MIGRATION_AUTHOR_ID` in your `.env.local` to your profile UUID from Supabase (step 5 above)
5. Run the migration script:

```bash
npx ts-node --project scripts/tsconfig.json scripts/migrate-blogger.ts
```

6. Watch the console output — skipped or failed posts will be listed:
   - `[1/103] Imported: "Post Title"` — success
   - `[SKIP] "Post Title" — slug already exists` — already imported, safe to ignore
   - `[ERROR] "Post Title": ...` — check the error and retry if needed

7. Summary is printed at the end: `Migration complete. 103 posts imported. 0 skipped. 0 errors.`

8. Log into `/admin/dashboard` to review imported posts before they go live. All imported posts are set to `published` status — unpublish any you don't want live.

### Notes

- The script is **idempotent** — safe to run multiple times. Duplicate slugs are skipped automatically.
- Cover images are extracted from the first `<img>` tag in each post's content. Blogger-hosted images should still be accessible but consider re-uploading important ones to Supabase Storage.
- Draft posts in Blogger are skipped during migration.
