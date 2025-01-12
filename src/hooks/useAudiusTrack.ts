import { useState, useEffect, useRef } from 'react';
import { searchUser, getUserFavorites, getTrack, getAudiusHost } from '../utils/audius';
import { sample } from '../utils/helpers';

export function useAudiusTrack() {
  const [trackArtwork, setTrackArtwork] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [tracks, setTracks] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchFavoriteTrackIds() {
      try {
        const userId = await searchUser('secretpanda007');
        if (!userId) return;

        const favorites = await getUserFavorites(userId);
        if (!favorites.length) return;

        const trackIds = favorites.map(fav => fav.favorite_item_id);
        setTracks(trackIds);

        // Set initial track artwork and track ID
        if (trackIds.length > 0) {
          const initialTrackId = sample(trackIds);
          setCurrentTrackId(initialTrackId);
          const fetchArtwork = async (trackId: string) => {
            const track = await getTrack(trackId);
            if (track?.artwork) {
              setTrackArtwork(track.artwork['480x480']);
            }
          };
          fetchArtwork(initialTrackId);
        }
      } catch (error) {
        console.error('Failed to fetch Audius tracks:', error);
      }
    }

    fetchFavoriteTrackIds();
  }, []);

  useEffect(() => {
    if (!currentTrackId) return;

    async function fetchTrackArtwork() {
      const track = await getTrack(currentTrackId);
      if (track?.artwork) {
        setTrackArtwork(track.artwork['480x480']);
      }
    }

    fetchTrackArtwork();
  }, [currentTrackId]);

  const playTrack = async (trackId: string) => {
    const host = await getAudiusHost();
    if (!host) return;

    const audio = new Audio(`${host}/v1/tracks/${trackId}/stream`);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);
    setCurrentTrackId(trackId);

    audio.onended = playNextTrack;
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playNextTrack = async () => {
    if (!currentTrackId || tracks.length === 0) return;

    const currentIndex = tracks.indexOf(currentTrackId);
    let nextTrackId: string | undefined;

    if (tracks.length === 1) {
      nextTrackId = tracks[0];
    } else {
      let randomIndex = Math.floor(Math.random() * tracks.length);
      while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * tracks.length);
      }
      nextTrackId = tracks[randomIndex];
    }

    if (nextTrackId) {
      playTrack(nextTrackId);
    }
  };

  const play = () => {
    if (currentTrackId) {
      playTrack(currentTrackId!);
    }
  };

  const pause = () => {
    pauseTrack();
  };

  return { trackArtwork, play, pause, isPlaying, currentTrackId };
}
