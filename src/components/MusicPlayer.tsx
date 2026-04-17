
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Song } from '../types';

export const DUMMY_PLAYLIST: Song[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Generation #01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://picsum.photos/seed/neon/400/400',
    duration: 372,
  },
  {
    id: '2',
    title: 'Synthwave Drift',
    artist: 'AI Generation #02',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://picsum.photos/seed/cyber/400/400',
    duration: 425,
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'AI Generation #03',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://picsum.photos/seed/digital/400/400',
    duration: 388,
  },
];

export function Playlist({ 
  currentIndex, 
  onSelect 
}: { 
  currentIndex: number, 
  onSelect: (index: number) => void 
}) {
  return (
    <aside className="border-r border-neon-cyan/20 p-6 bg-bg-surface/50 h-full overflow-y-auto">
      <h3 className="text-[10px] uppercase tracking-[2px] text-text-dim mb-6 font-mono font-bold">Mainframe // Playlist</h3>
      <div className="space-y-4">
        {DUMMY_PLAYLIST.map((song, index) => (
          <div
            key={song.id}
            onClick={() => onSelect(index)}
            className={`p-4 cursor-pointer transition-all border-l-2 ${
              currentIndex === index 
              ? 'border-neon-magenta bg-neon-magenta/5' 
              : 'border-transparent bg-white/2 hover:bg-white/5'
            }`}
          >
            <span className="block font-medium text-sm text-text-main">{song.title}</span>
            <span className="text-[10px] text-text-dim uppercase tracking-wider">{song.artist}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function MusicPlayerFooter({
  currentSongIndex,
  setCurrentSongIndex
}: {
  currentSongIndex: number,
  setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = DUMMY_PLAYLIST[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Playback error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % DUMMY_PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + DUMMY_PLAYLIST.length) % DUMMY_PLAYLIST.length);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
      setCurrentTime(formatTime(audioRef.current.currentTime));
      if (!isNaN(audioRef.current.duration)) {
        setTotalTime(formatTime(audioRef.current.duration));
      }
    }
  };

  return (
    <footer className="h-24 bg-bg-surface border-t border-neon-cyan/10 grid grid-cols-[280px_1fr_280px] items-center px-8 fixed bottom-0 left-0 right-0 z-50">
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />

      {/* Now Playing */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-magenta border border-white/20 overflow-hidden relative">
          <img 
            src={currentSong.coverUrl} 
            className="w-full h-full object-cover opacity-80" 
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_cyan] animate-ping" />
             </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-text-main truncate max-w-[180px]">{currentSong.title}</div>
          <div className="text-[10px] text-text-dim font-mono tracking-tight">{currentTime} / {totalTime}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button onClick={handlePrev} className="text-text-main hover:text-neon-cyan transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 border border-text-main rounded-full flex items-center justify-center hover:border-neon-cyan hover:text-neon-cyan transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
          </button>
          <button onClick={handleNext} className="text-text-main hover:text-neon-cyan transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative w-full max-w-md h-1 bg-[#2a2a35] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
          />
        </div>
      </div>

      {/* Volume/Status */}
      <div className="flex justify-end items-center gap-4 text-text-dim">
        <span className="text-[10px] font-bold font-mono tracking-widest">VOL // SYNC</span>
        <div className="w-24 h-1 bg-[#2a2a35] relative">
          <div className="absolute top-0 left-0 h-full w-[70%] bg-text-dim" />
        </div>
      </div>
    </footer>
  );
}
