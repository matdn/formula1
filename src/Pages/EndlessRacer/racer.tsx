import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { animated, useSpring } from '@react-spring/three';

interface PlayerProps {
  position: React.MutableRefObject<number>;
  checkCollision: (playerPos: [number, number, number]) => void;
  isInvincible: boolean;
}

const Player: React.FC<PlayerProps> = ({ position, checkCollision, isInvincible }) => {
  const ref = useRef<Mesh>(null);
  const [spring, api] = useSpring(() => ({
    position: [position.current, 1, 0],
    rotation: [0, 0, 0],
    config: { tension: 400, friction: 30 },
  }));

  useFrame(() => {
    if (ref.current) {
      checkCollision([spring.position.get()[0], 1, 0]);
    }
  });

  useEffect(() => {
    api.start({
      position: [position.current, 1, 0],
      rotation: [0, 0, (position.current !== 0) ? Math.PI / 4 * Math.sign(position.current) : 0],
    });
  }, [position.current, api]);

  return (
    <animated.mesh ref={ref} position={spring.position} rotation={spring.rotation}>
      <coneGeometry args={[1, 2, 4]} />
      <meshStandardMaterial color={isInvincible ? "gold" : "green"} />
    </animated.mesh>
  );
};

// Obstacle à remplacer par les roues
interface ObstacleProps {
  position: [number, number, number];
  color: string;
}

const Obstacle: React.FC<ObstacleProps> = ({ position, color }) => (
  <mesh position={position}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

// Lane component
interface LaneProps {
  position: [number, number, number];
  color: string;
}

const Lane: React.FC<LaneProps> = ({ position, color }) => (
  <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[4, 100]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

// Game component
const Game: React.FC<{ onGameOver: () => void; setScore: React.Dispatch<React.SetStateAction<number>>; }> = ({ onGameOver, setScore }) => {
  const playerPosition = useRef<number>(0);
  const [obstacles, setObstacles] = useState<{ id: number, position: [number, number, number], type: 'red' | 'yellow' | 'pink' }[]>([]);
  const [isInvincible, setIsInvincible] = useState(false);

  const moveLeft = () => {
    playerPosition.current = Math.max(playerPosition.current - 4, -4);
  };

  const moveRight = () => {
    playerPosition.current = Math.min(playerPosition.current + 4, 4);
  };

  const checkCollision = useCallback((playerPos: [number, number, number]) => {
    setObstacles((prevObstacles) =>
      prevObstacles.filter((obs) => {
        const distance = Math.sqrt(
          (playerPos[0] - obs.position[0]) ** 2 +
          (playerPos[1] - obs.position[1]) ** 2 +
          (playerPos[2] - obs.position[2]) ** 2
        );

        if (distance < 1) {
          if (obs.type === 'red' && !isInvincible) {
            onGameOver();
          } else if (obs.type === 'yellow') {
            setScore((prevScore) => prevScore + 10);
          } else if (obs.type === 'pink') {
            setIsInvincible(true);
            setTimeout(() => setIsInvincible(false), 10000); // Invincibility for 10 seconds
          }
          return false; // Remove the obstacle if collided
        }
        return true; // Keep the obstacle if not collided
      })
    );
  }, [onGameOver, setScore, isInvincible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') moveLeft();
      if (event.key === 'ArrowRight') moveRight();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      const type = random < 0.7 ? 'red' : random < 0.9 ? 'yellow' : 'pink'; 
      setObstacles((prev) => [
        ...prev,
        { id: Date.now(), position: [Math.floor(Math.random() * 3) * 4 - 4, 1, -20], type },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    setObstacles((prev) =>
      prev.map((obs) => ({
        ...obs,
        position: [obs.position[0], obs.position[1], obs.position[2] + 0.1],
      }))
    );
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prevScore) => prevScore + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [setScore]);

  return (
    <>
      <Lane position={[-4, 0, 0]} color="grey" />
      <Lane position={[0, 0, 0]} color="grey" />
      <Lane position={[4, 0, 0]} color="grey" />
      <Player position={playerPosition} checkCollision={checkCollision} isInvincible={isInvincible} />
      {obstacles.map((obs) => (
        <Obstacle key={obs.id} position={obs.position} color={obs.type === 'red' ? 'red' : obs.type === 'yellow' ? 'yellow' : 'pink'} />
      ))}
    </>
  );
};

// EndlessRacer component
const EndlessRacer: React.FC = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleGameOver = () => {
    setGameOver(true);
  };

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
  };

  return (
    <>
      {gameOver ? (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red' }}>
          <h1>Game Over</h1>
          <p>Score: {score}</p>
          <button onClick={handleRestart}>Restart</button>
        </div>
      ) : (
        <>
          <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white' }}>
            <h1>Score: {score}</h1>
          </div>
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Game onGameOver={handleGameOver} setScore={setScore} />
          </Canvas>
        </>
      )}
    </>
  );
};

export default EndlessRacer;
