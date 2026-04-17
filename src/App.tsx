import { useState } from 'react';
import { Playlist, MusicPlayerFooter } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { useSnake } from './hooks/useSnake';
import { Menu } from 'lucide-react';

export default function App() {
  const { gameState } = useSnake();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-bg-deep border-[4px] border-bg-surface overflow-hidden">
      {/* Header */}
      <header className="h-[80px] px-10 flex items-center justify-between border-b border-neon-cyan/10 bg-gradient-to-b from-neon-cyan/5 to-transparent flex-shrink-0">
        <div className="flex items-center gap-4">
          <Menu className="w-5 h-5 text-neon-cyan" />
          <h1 className="font-mono font-black tracking-[4px] text-neon-cyan neon-text-cyan uppercase">NEON // ARCADE</h1>
        </div>

        <div className="flex gap-4">
          <div className="bg-bg-surface px-6 py-2 border border-neon-lime shadow-[inset_0_0_10px_rgba(57,255,20,0.2)] flex items-center gap-4">
            <span className="text-[11px] uppercase text-text-dim tracking-wider">Score matrix</span>
            <span className="font-mono text-2xl text-neon-lime neon-text-lime leading-none">
              {gameState.score.toString().padStart(6, '0')}
            </span>
          </div>
          
          <div className="bg-bg-surface px-6 py-2 border border-neon-magenta/30 flex items-center gap-4">
             <span className="text-[11px] uppercase text-text-dim tracking-wider">Hi-Score</span>
             <span className="font-mono text-xl text-neon-magenta leading-none">
                {gameState.highScore.toString().padStart(6, '0')}
             </span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden">
        {/* Sidebar */}
        <Playlist 
          currentIndex={currentTrackIndex} 
          onSelect={setCurrentTrackIndex} 
        />

        {/* Game Area */}
        <section className="relative flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.03)_0%,transparent_70%)] overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
             <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
          </div>
          
          <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
            <SnakeGame />
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-8 left-8 p-4 border-l border-t border-neon-cyan/20 w-16 h-16 pointer-events-none" />
          <div className="absolute bottom-8 right-8 p-4 border-r border-b border-neon-cyan/20 w-16 h-16 pointer-events-none" />
        </section>
      </main>

      {/* Footer Player */}
      <MusicPlayerFooter 
        currentSongIndex={currentTrackIndex} 
        setCurrentSongIndex={setCurrentTrackIndex} 
      />
    </div>
  );
}
