import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PyramidProps {
  position: [number, number, number];
}

const Pyramid = React.forwardRef<Mesh, PyramidProps>(({ position }, ref) => (
  <mesh position={position} ref={ref}>
    <coneGeometry args={[1, 2, 4]} />
    <meshStandardMaterial color="green" />
  </mesh>
));

interface ObstacleProps {
  position: [number, number, number];
}

const Obstacle: React.FC<ObstacleProps> = ({ position }) => (
  <mesh position={position}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="red" />
  </mesh>
);

interface PlayerProps {
  position: React.MutableRefObject<number>;
  checkCollision: (playerPos: [number, number, number]) => void;
}

const Player: React.FC<PlayerProps> = ({ position, checkCollision }) => {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = position.current;
      checkCollision([position.current, 1, 0]);
    }
  });

  return <Pyramid position={[position.current, 1, 0]} ref={ref} />;
};

const Lane: React.FC<{ position: [number, number, number], color: string }> = ({ position, color }) => (
  <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[4, 100]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const Game: React.FC<{ onGameOver: () => void }> = ({ onGameOver }) => {
  const playerPosition = useRef<number>(0);
  const [obstacles, setObstacles] = useState<{ id: number, position: [number, number, number] }[]>([]);

  const moveLeft = () => {
    playerPosition.current = Math.max(playerPosition.current - 4, -4);
  };

  const moveRight = () => {
    playerPosition.current = Math.min(playerPosition.current + 4, 4);
  };

  const checkCollision = useCallback((playerPos: [number, number, number]) => {
    obstacles.forEach((obs) => {
      const distance = Math.sqrt(
        (playerPos[0] - obs.position[0]) ** 2 +
        (playerPos[1] - obs.position[1]) ** 2 +
        (playerPos[2] - obs.position[2]) ** 2
      );
      if (distance < 1) {
        onGameOver();
      }
    });
  }, [obstacles, onGameOver]);

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
      setObstacles((prev) => [
        ...prev,
        { id: Date.now(), position: [Math.floor(Math.random() * 3) * 4 - 4, 1, -20] },
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

  return (
    <>
      <Lane position={[-4, 0, 0]} color="pink" />
      <Lane position={[0, 0, 0]} color="aqua" />
      <Lane position={[4, 0, 0]} color="white" />
      <Player position={playerPosition} checkCollision={checkCollision} />
      {obstacles.map((obs) => (
        <Obstacle key={obs.id} position={obs.position} />
      ))}
    </>
  );
};

const EndlessRacer: React.FC = () => {
  const [gameOver, setGameOver] = useState(false);

  const handleGameOver = () => {
    setGameOver(true);
  };

  const handleRestart = () => {
    setGameOver(false);
  };

  return (
    <>
      {gameOver ? (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red' }}>
          <h1>Game Over</h1>
          <button onClick={handleRestart}>Restart</button>
        </div>
      ) : (
        <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Game onGameOver={handleGameOver} />
        </Canvas>
      )}
    </>
  );
};

export default EndlessRacer;
