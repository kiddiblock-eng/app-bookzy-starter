"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function DemoPro() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const cloudName = "dcmlw5hak";
  const videoId = "generateur_g1nl9o";
  const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto/${videoId}.mov`;

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
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  return (
    <section id="demo" className="relative bg-white py-16 lg:py-20 overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-blue-50/30"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full mb-6">
            <Play className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">Démo en direct</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Voyez Bookzy en action
          </h2>
          <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Découvrez comment notre IA génère un eBook complet en moins de 60 secondes.
          </p>
        </div>

        <div 
          className="relative max-w-5xl mx-auto group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        >
          
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
            
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full aspect-video object-cover"
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />

            {!isPlaying && (
              <div 
                className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-900/60 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all"
                onClick={togglePlay}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                  
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50 hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            )}

            <div 
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex items-center gap-4">
                
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" fill="white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                <div className="flex-1"></div>

                <button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
                >
                  <Maximize className="w-5 h-5 text-white" />
                </button>

              </div>
            </div>

          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Démo complète : De l'idée au produit fini en 60 secondes
            </p>
          </div>

        </div>

        <div className="mt-12 text-center">
          <a
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <span>Essayer maintenant</span>
            <Play className="w-5 h-5" />
          </a>
          <p className="text-slate-500 text-sm mt-4">
            Aucune carte bancaire requise
          </p>
        </div>

      </div>
    </section>
  );
}