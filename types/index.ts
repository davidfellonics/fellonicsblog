export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  alt_text: string;
  body: string;
  display_order: number;
  created_at: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  date_range: string | null;
  body: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  twitter_handle: string | null;
  website_url: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_id: string | null;
  status: "draft" | "published";
  post_type: "academic" | "reflection";
  published_at: string | null;
  reading_time_minutes: number | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostWithTags extends Post {
  tags: Tag[];
  author: Profile | null;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface CommentWithPost extends Comment {
  post: { title: string; slug: string } | null;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

export type Database = {
  public: {
    Tables: {
      glossary_entries: {
        Row: GlossaryEntry;
        Insert: {
          id?: string;
          term: string;
          date_range?: string | null;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          term?: string;
          date_range?: string | null;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & { created_at?: string };
        Update: Partial<Omit<Profile, "id">>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Post, "id">>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, "id"> & { id?: string };
        Update: Partial<Omit<Tag, "id">>;
      };
      post_tags: {
        Row: PostTag;
        Insert: PostTag;
        Update: Partial<PostTag>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Comment, "id">>;
      };
    };
  };
};
