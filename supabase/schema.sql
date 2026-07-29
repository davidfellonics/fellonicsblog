-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  bio text,
  avatar_url text,
  twitter_handle text,
  website_url text,
  created_at timestamptz default now()
);

-- Posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,           -- Tiptap HTML output
  cover_image_url text,
  author_id uuid references profiles(id),
  status text default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  reading_time_minutes int,
  meta_title text,                 -- SEO override
  meta_description text,           -- SEO override (max 160 chars)
  og_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tags
create table tags (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  slug text unique not null
);

-- Post Tags (junction)
create table post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Comments
create table comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  content text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;

-- Public can read published posts
create policy "Public can read published posts"
  on posts for select using (status = 'published');

-- Author can do everything with their posts
create policy "Author full access to own posts"
  on posts for all using (auth.uid() = author_id);

-- Public can read approved comments
create policy "Public can read approved comments"
  on comments for select using (status = 'approved');

-- Anyone can insert a pending comment
create policy "Anyone can submit comments"
  on comments for insert with check (status = 'pending');

-- Author can manage all comments
create policy "Author can manage all comments"
  on comments for all using (
    exists (select 1 from profiles where id = auth.uid())
  );

-- Glossary Entries
create table glossary_entries (
  id uuid default gen_random_uuid() primary key,
  term text not null,
  date_range text,
  body text not null,
  created_at timestamptz default now()
);

alter table glossary_entries enable row level security;

create policy "Public can read glossary entries"
  on glossary_entries for select using (true);

create policy "Authenticated users can manage glossary entries"
  on glossary_entries for all using (auth.uid() is not null);

create index glossary_entries_term_idx on glossary_entries(term);

-- Indexes for performance
create index posts_slug_idx on posts(slug);
create index posts_status_published_at_idx on posts(status, published_at desc);
create index comments_post_id_idx on comments(post_id);
create index comments_status_idx on comments(status);
