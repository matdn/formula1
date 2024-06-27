import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import {
  CylinderGeometry,
  CircleGeometry,
  Group,
  Shape,
  ExtrudeGeometry,
} from "three";
import GameCar from "../../views/three/components/GameCar";

// Coin shape
const createCoinShape = () => {
  return new CylinderGeometry(0.5, 0.5, 0.1, 32);
};

// Star shape
const createStarShape = () => {
  const shape = new Shape();
  const outerRadius = 0.5;
  const innerRadius = 0.2;
  const spikes = 5;
  const step = Math.PI / spikes;

  shape.moveTo(outerRadius, 0);
  for (let i = 0; i < 2 * spikes; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(i * step) * radius;
    const y = Math.sin(i * step) * radius;
    shape.lineTo(x, y);
  }
  shape.closePath();

  const extrudeSettings = {
    depth: 0.1,
    bevelEnabled: false,
  };

  return new ExtrudeGeometry(shape, extrudeSettings);
};

interface PlayerProps {
  position: React.MutableRefObject<number>;
  checkCollision: (playerPos: [number, number, number]) => void;
  isInvincible: boolean;
}

const Player: React.FC<PlayerProps> = ({
  position,
  checkCollision,
  isInvincible,
}) => {
  const ref = useRef<Group>(null);
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
    });
  }, [position.current, api]);

  return (
    <animated.group ref={ref} position={spring.position}>
      <mesh position={[0, 0, 0]}>
        <meshStandardMaterial color={isInvincible ? "gold" : "green"} />
      </mesh>
      {isInvincible ? (
        <>
          <mesh
            position={[0.3, -0.38, 0]}
            scale={[11, 11, 11]}
            rotation={[1.4, 0, 0]}
          >
            <mesh>
              <coneGeometry args={[0.1, -0.5, 32]} />
              <meshStandardMaterial color="orange" transparent opacity={0.7} />
            </mesh>
          </mesh>

          <mesh position={[-0.5, 0, 2]} scale={[0.2, 0.2, 0.2]}>
            <GameCar
              rotationX={0}
              rotationY={-3.1}
              rotationZ={0.03}
              url="glbs/formula1.glb"
            />
          </mesh>
        </>
      ) : (
        <mesh position={[-0.5, 0, 2]} scale={[0.2, 0.2, 0.2]}>
          <GameCar
            rotationX={0}
            rotationY={-3.1}
            rotationZ={0.03}
            url="glbs/formula1.glb"
          />
        </mesh>
      )}
    </animated.group>
  );
};

// Obstacle component
interface ObstacleProps {
  position: [number, number, number];
  type: "red" | "yellow" | "pink";
}

const Obstacle: React.FC<ObstacleProps> = ({ position, type }) => {
  let geometry;
  let color;

  if (type === "red") {
    geometry = new CircleGeometry(0.5, 32);
    color = "red";
  } else if (type === "yellow") {
    geometry = createCoinShape();
    color = "yellow";
  } else if (type === "pink") {
    geometry = createStarShape();
    color = "pink";
  }

  return (
    <mesh position={position} geometry={geometry}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

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

const Game: React.FC<{
  onGameOver: () => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}> = ({ onGameOver, setScore }) => {
  const playerPosition = useRef<number>(0);
  const [obstacles, setObstacles] = useState<
    {
      id: number;
      position: [number, number, number];
      type: "red" | "yellow" | "pink";
    }[]
  >([]);
  const [isInvincible, setIsInvincible] = useState(false);
  const speed = useRef(0.2); // Speed of the obstacles

  const moveLeft = () => {
    playerPosition.current = Math.max(playerPosition.current - 4, -4);
  };

  const moveRight = () => {
    playerPosition.current = Math.min(playerPosition.current + 4, 4);
  };

  const checkCollision = useCallback(
    (playerPos: [number, number, number]) => {
      setObstacles((prevObstacles) =>
        prevObstacles.filter((obs) => {
          const distance = Math.sqrt(
            (playerPos[0] - obs.position[0]) ** 2 +
              (playerPos[1] - obs.position[1]) ** 2 +
              (playerPos[2] - obs.position[2]) ** 2
          );

          if (distance < 1) {
            if (obs.type === "red" && !isInvincible) {
              onGameOver();
            } else if (obs.type === "yellow") {
              setScore((prevScore) => prevScore + 10);
            } else if (obs.type === "pink") {
              setIsInvincible(true);
              setTimeout(() => setIsInvincible(false), 10000);
            }
            return false;
          }
          return true;
        })
      );
    },
    [onGameOver, setScore, isInvincible]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") moveLeft();
      if (event.key === "ArrowRight") moveRight();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      const type = random < 0.7 ? "red" : random < 0.9 ? "yellow" : "pink";
      setObstacles((prev) => [
        ...prev,
        {
          id: Date.now(),
          position: [Math.floor(Math.random() * 3) * 4 - 4, 1, -20],
          type,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    setObstacles((prev) =>
      prev.map((obs) => ({
        ...obs,
        position: [obs.position[0], obs.position[1], obs.position[2] + speed.current],
      }))
    );
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prevScore) => prevScore + (isInvincible ? 2 : 1));
    }, 1000); // Faster score increment when invincible

    return () => clearInterval(interval);
  }, [setScore, isInvincible]);

  return (
    <>
      <Lane position={[-4, 0, 0]} color="grey" />
      <Lane position={[0, 0, 0]} color="grey" />
      <Lane position={[4, 0, 0]} color="grey" />
      <Player
        position={playerPosition}
        checkCollision={checkCollision}
        isInvincible={isInvincible}
      />
      {obstacles.map((obs) => (
        <Obstacle key={obs.id} position={obs.position} type={obs.type} />
      ))}
    </>
  );
};

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
        <div
          className="game-over-screen "
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "red",
          }}
        >
          <h1>Game Over</h1>
          <p style={{ color: "yellow", fontSize: 32 }}>Score: {score}</p>
          <button className="flicker-button" onClick={handleRestart}>
            Play Again?
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              color: "white",
            }}
          >
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
