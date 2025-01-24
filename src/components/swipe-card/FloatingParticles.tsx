import React from "react";

export const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Bottom left particles */}
      <div className="absolute left-4 bottom-8 w-3 h-3 backdrop-blur-sm bg-white/10 rounded-full opacity-60 animate-float-bl"></div>
      <div className="absolute left-8 bottom-12 w-2 h-2 backdrop-blur-sm bg-yellow-400/30 rounded-full opacity-40 animate-float-bl delay-1000"></div>

      {/* Top right particles */}
      <div className="absolute right-6 top-10 w-4 h-4 backdrop-blur-sm bg-white/20 rounded-full opacity-50 animate-float-tr"></div>
      <div className="absolute right-12 top-16 w-2 h-2 backdrop-blur-sm bg-yellow-400/30 rounded-full opacity-30 animate-float-tr delay-1500"></div>

      {/* Center particles */}
      <div className="absolute left-1/2 top-1/2 w-3 h-3 backdrop-blur-sm bg-white/30 rounded-full opacity-40 animate-float-center"></div>
      <div className="absolute left-[45%] top-[45%] w-2 h-2 backdrop-blur-sm bg-yellow-400/20 rounded-full opacity-30 animate-float-center delay-700"></div>

      {/* Bottom right glow */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl"></div>

      {/* Top left glow */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
    </div>
  );
};

// Add this to your tailwind.config.js if not already present:
// {
//   theme: {
//     extend: {
//       animation: {
//         float: 'float 3s ease-in-out infinite',
//       },
//       keyframes: {
//         float: {
//           '0%, 100%': { transform: 'translate(0, 0)' },
//           '50%': { transform: 'translate(20px, -20px)' },
//         },
//       },
//     },
//   },
// }
