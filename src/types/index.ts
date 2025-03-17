import { Database } from '@/integrations/supabase/types';

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  role: 'artist' | 'manager';
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type SocialMedia = {
  id: string;
  profile_id: string;
  platform: string;
  username: string;
  url: string;
  followers: number;
  engagement_rate: number | null;
  last_updated: string;
};

export type Milestone = {
  id: string;
  artist_id: string;
  title: string;
  date: string;
  description: string | null;
  category: 'release' | 'performance' | 'award';
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  artist_id: string;
  milestone_id: string | null;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type MoodboardImage = {
  id: string;
  artist_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

export type MusicTrack = {
  id: string;
  artist_id: string;
  title: string;
  release_date: string | null;
  audio_url: string | null;
  cover_art_url: string | null;
  created_at: string;
};

export type ArtistManager = {
  id: string;
  artist_id: string;
  manager_id: string;
  created_at: string;
};
