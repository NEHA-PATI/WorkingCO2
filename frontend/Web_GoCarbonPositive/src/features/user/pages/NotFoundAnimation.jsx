import React, { useState } from 'react';
import "@features/user/styles/NotFoundAnimation.css";


export default function NotFoundAnimation() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="notfound-page min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating leaf 1 */}
        <div className="floating-element leaf-1 absolute w-16 h-16">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 10C40 20, 30 30, 30 50C30 70, 40 80, 50 85C60 80, 70 70, 70 50C70 30, 60 20, 50 10Z"
              fill="#10b981"
              opacity="0.6"
            />
            <path
              d="M50 30C48 35, 45 40, 45 50C45 60, 48 65, 50 68C52 65, 55 60, 55 50C55 40, 52 35, 50 30Z"
              fill="#059669"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Floating leaf 2 */}
        <div className="floating-element leaf-2 absolute w-20 h-20">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 10C40 20, 30 30, 30 50C30 70, 40 80, 50 85C60 80, 70 70, 70 50C70 30, 60 20, 50 10Z"
              fill="#34d399"
              opacity="0.5"
            />
            <path
              d="M50 30C48 35, 45 40, 45 50C45 60, 48 65, 50 68C52 65, 55 60, 55 50C55 40, 52 35, 50 30Z"
              fill="#10b981"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Floating circle 1 */}
        <div className="floating-element circle-1 absolute w-24 h-24 rounded-full bg-green-200 opacity-30"></div>

        {/* Floating circle 2 */}
        <div className="floating-element circle-2 absolute w-32 h-32 rounded-full bg-emerald-300 opacity-20"></div>

        {/* Orbiting particles */}
        <div className="orbit-container absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
          <div className="orbit orbit-1">
            <div className="particle w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="orbit orbit-2">
            <div className="particle w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="orbit orbit-3">
            <div className="particle w-2.5 h-2.5 bg-teal-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* 404 Text with glow effect */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 mb-4 animate-fade-in">
            404
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto rounded-full glow-effect"></div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Oops! It seems this page has been composted. Let's get you back to the right place to grow your carbon-positive journey.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => window.location.href = '/'}
            className="relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-emerald-400/50 transition-all duration-300 overflow-hidden group"
          >
            <span className="relative z-10">Go Back Home</span>
            <div className={`absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
          </button>

          <button
            onClick={() => window.location.href = '/contact'}
            className="px-8 py-4 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-all duration-300"
          >
            Contact Support
          </button>
        </div>

        {/* Footer text */}
        {/* <div className="mt-12 text-sm text-gray-500">
          <p>Error Code: <span className="font-mono font-semibold text-gray-700">404_COMPOSTED</span></p>
        </div> */}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-100 to-transparent opacity-50 pointer-events-none"></div>
    </div>
  );
}
