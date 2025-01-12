import { useState, useEffect } from 'react';
import { Content } from '../types';
import { fetchVideoList } from '../utils/ipfs';

export function useVideoContent() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        const videos = await fetchVideoList();
        setContent(videos);
      } catch (err) {
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  return { content, loading, error };
}