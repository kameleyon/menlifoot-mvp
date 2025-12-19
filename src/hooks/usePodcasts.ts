import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Podcast {
  id: string;
  title: string;
  description: string | null;
  platform: string;
  original_url: string;
  embed_url: string;
  episode_number: number | null;
  duration: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
}

export const usePodcasts = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [latestPodcast, setLatestPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && data) {
        setPodcasts(data);
        if (data.length > 0) {
          setLatestPodcast(data[0]);
        }
      }
      setLoading(false);
    };

    fetchPodcasts();
  }, []);

  return { podcasts, latestPodcast, loading };
};
