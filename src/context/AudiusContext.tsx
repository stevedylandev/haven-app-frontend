import React, { createContext, useContext } from 'react';
import { useAudiusTrack } from '../hooks/useAudiusTrack';

interface AudiusContextProps {
  trackArtwork: string | null;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  currentTrackId: string | null;
}

const AudiusContext = createContext<AudiusContextProps | undefined>(undefined);

export const AudiusProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { trackArtwork, play, pause, isPlaying, currentTrackId } = useAudiusTrack();

  return (
    <AudiusContext.Provider value={{ trackArtwork, play, pause, isPlaying, currentTrackId }}>
      {children}
    </AudiusContext.Provider>
  );
};

export const useAudius = () => {
  const context = useContext(AudiusContext);
  if (!context) {
    throw new Error('useAudius must be used within an AudiusProvider');
  }
  return context;
};
