
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSnake } from '../hooks/useSnake';
import { Trophy, RefreshCcw, Gamepad2 } from 'lucide-react';

export function SnakeGame() {
  const { gameState, resetGame, GRID_SIZE } = useSnake();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative group p-[2px] bg-neon-cyan/20">
        {/* Game Area */}
        <div 
          className="relative bg-bg-surface overflow-hidden border-2 border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.1)]"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vh, 500px)',
            height: 'min(80vh, 500px)',
          }}
        >
          {/* Visual Grid Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '25px 25px'
            }}
          />

          {/* Rendering Snake */}
          {gameState.snake.map((segment, index) => (
            <motion.div
              key={`${index}-${segment.x}-${segment.y}`}
              layoutId={`snake-${index}`}
              className="relative z-10 p-[2px]"
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            >
              <div 
                className={`w-full h-full rounded-sm ${
                  index === 0 
                  ? 'bg-white shadow-[0_0_15px_#fff] z-20' 
                  : 'bg-neon-lime shadow-[0_0_8px_#39ff14]'
                }`}
              />
            </motion.div>
          ))}

          {/* Rendering Food */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="z-10 p-[4px]"
            style={{
              gridColumnStart: gameState.food.x + 1,
              gridRowStart: gameState.food.y + 1,
            }}
          >
            <div className="w-full h-full rounded-full bg-neon-magenta shadow-[0_0_12px_#ff00ff]" />
          </motion.div>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameState.isGameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm"
              >
                <div className="mb-6 px-4 py-2 border-y border-neon-magenta/30">
                  <h2 className="text-4xl font-black text-neon-magenta tracking-tighter uppercase mb-1">Game Over</h2>
                  <p className="text-text-dim font-mono text-[10px] tracking-[0.2em] uppercase">System Failure / Link Lost</p>
                </div>
                
                <div className="mb-8">
                  <p className="text-text-dim uppercase font-mono text-xs mb-1">Final Score</p>
                  <p className="text-5xl font-bold text-neon-lime font-mono">{gameState.score}</p>
                </div>

                <button
                  onClick={resetGame}
                  className="group relative flex items-center gap-3 bg-bg-surface border border-neon-cyan text-neon-cyan px-8 py-4 font-mono uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-all"
                >
                  <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Re-Initiate
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-bg-surface border border-white/5 px-6 py-4 mt-8">
        <Gamepad2 className="w-5 h-5 text-neon-cyan opacity-50" />
        <div className="flex flex-col">
          <span className="text-text-dim text-[10px] font-mono leading-tight uppercase tracking-widest">Interface Status</span>
          <p className="text-text-main/80 font-mono text-[10px] tracking-tight">USE ARROW KEYS TO NAVIGATE SYSTEM</p>
        </div>
      </div>
    </div>
  );
}
