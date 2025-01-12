import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';

export function ShareButton() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowWidth <= 1000) {
    return null;
  }

  const handleShare = async () => {
    try {
      // Check if running in HTTPS or localhost
      const isSecureContext = window.isSecureContext;

      if (navigator.share && isSecureContext) {
        await navigator.share({
          title: 'Action Classification Game',
          text: 'Help classify actions in this fun game!',
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        const message = document.createElement('div');
        message.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm';
        message.textContent = 'Link copied to clipboard!';
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2000);
      }
    } catch (error) {
      // Show error message only if it's not a user cancellation
      if (!(error instanceof Error) || !error.message.includes('cancelled')) {
        const message = document.createElement('div');
        message.className = 'fixed top-20 left-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm';
        message.textContent = 'Could not share. Try copying the URL from your browser.';
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed top-4 left-4 bg-gradient-to-br from-purple-900/50 to-black border border-purple-800/50 rounded-full p-3
                 text-white hover:bg-black/70 transition-colors"
      aria-label="Share"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
}
