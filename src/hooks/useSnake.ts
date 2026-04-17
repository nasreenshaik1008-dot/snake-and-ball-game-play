
import { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameState } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

export function useSnake() {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    highScore: 0,
  });

  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    directionRef.current = INITIAL_DIRECTION;
    setGameState(prev => ({
      ...prev,
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
    }));
  };

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;

      const head = prev.snake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        return { ...prev, isGameOver: true, highScore: newHighScore };
      }

      // Check self collisions
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        return { ...prev, isGameOver: true, highScore: newHighScore };
      }

      const newSnake = [newHead, ...prev.snake];

      // Check food consumption
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prev.score + 10,
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, [generateFood]);

  useEffect(() => {
    if (gameState.isGameOver) return;

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [moveSnake, gameState.isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { gameState, resetGame, GRID_SIZE };
}
