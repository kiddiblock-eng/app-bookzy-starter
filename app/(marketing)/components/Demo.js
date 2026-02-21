"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function Demo() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const cloudName = "dcmlw5hak";
  const videoId = "generateur_g1nl9o";
  const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto/${videoId}.mov`;
  const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_1280,h_720,c_fill,q_auto,f_jpg/${videoId}.jpg`;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    const video = videoRef.current;
    
    if (!container || !video) return;

    // Check if already fullscreen
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      return;
    }

    // Try fullscreen on container first (better for desktop)
    // On mobile, use video element directly for native controls
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile: use native video fullscreen
      if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      // Desktop: fullscreen the container
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }
  };

  return (
    <section id="demo" className="relative bg-white py-20 lg:py-28 overflow-hidden">
      
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-wide uppercase mb-4">
            Démo
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-5">
            60 secondes, un ebook complet
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Regardez comment Bookzy transforme une simple idée en ebook professionnel prêt à vendre.
          </p>
        </div>

        {/* Video Container */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        >
          
          {/* Video wrapper with browser-like frame */}
          <div 
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden bg-white shadow-2xl shadow-slate-900/10 border border-slate-200"
          >
            
            {/* Browser top bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-lg px-3 py-1.5 text-xs text-slate-500 font-medium text-center border border-slate-200">
                  app.bookzy.io
                </div>
              </div>
              <div className="w-16"></div>
            </div>

            {/* Video */}
            <div className="relative bg-slate-900">
              <video
                ref={videoRef}
                src={videoUrl}
                poster={thumbnailUrl}
                className="w-full aspect-video object-cover"
                playsInline
                webkit-playsinline="true"
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Play overlay - only when not playing */}
              {!isPlaying && (
                <div 
                  className="absolute inset-0 bg-slate-900/40 flex items-center justify-center cursor-pointer group/play"
                  onClick={togglePlay}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-xl transition-transform duration-200 group-hover/play:scale-105 active:scale-95">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900 ml-1" fill="currentColor" />
                  </div>
                </div>
              )}

              {/* Bottom controls */}
              <div 
                className={`
                  absolute bottom-0 left-0 right-0 
                  bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent 
                  p-3 sm:p-4 pt-10
                  transition-opacity duration-300 
                  ${showControls ? 'opacity-100' : 'opacity-0'}
                `}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white ml-0.5" fill="white" />
                    )}
                  </button>

                  {/* Mute */}
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    )}
                  </button>

                  <div className="flex-1"></div>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  >
                    <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </button>

                </div>
              </div>
            </div>

          </div>

          {/* Caption */}
          <p className="text-center text-slate-400 text-sm mt-6">
            De l'idée au PDF en moins d'une minute
          </p>

        </div>

        {/* Features under video */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-12 lg:mt-16">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">8</div>
            <div className="text-xs sm:text-sm text-slate-500">Chapitres générés</div>
          </div>
          <div className="text-center border-x border-slate-200">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">60s</div>
            <div className="text-xs sm:text-sm text-slate-500">Temps de création</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">3</div>
            <div className="text-xs sm:text-sm text-slate-500">Fichiers livrés</div>
          </div>
        </div>

      </div>
    </section>
  );
}