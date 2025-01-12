import React from 'react';
import { useAudiusProfile } from '../hooks/useAudiusProfile';
import { useAudiusTrack } from '../hooks/useAudiusTrack';

export function AudiusControls() {
  const { profilePicture } = useAudiusProfile();
  const { trackArtwork, play, pause, isPlaying } = useAudiusTrack();

  const handleArtworkClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 flex gap-2">
      {/* Profile Picture Circle */}
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-900/50 to-black border border-purple-800/50">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 animate-pulse" />
        )}
      </div>

      {/* Track Artwork Circle */}
      <div
        className={`w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-900/50 to-black border border-purple-800/50 cursor-pointer ${
          isPlaying ? 'animate-spin-slow' : ''
        }`}
        onClick={handleArtworkClick}
      >
        {trackArtwork ? (
          <img
            src={trackArtwork}
            alt="Track"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 animate-pulse" />
        )}
      </div>

    </div>
  );
}
