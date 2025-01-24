import React from "react";

export const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-50 animate-float"></div>
      <div className="absolute w-3 h-3 bg-red-500 rounded-full opacity-60 animate-float delay-1000"></div>
      <div className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-50 animate-float delay-2000"></div>
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
