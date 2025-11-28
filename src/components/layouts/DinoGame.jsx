import React, { useRef, useEffect, useState } from "react";

export default function DinoGame({ submitScore }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("dinoRunnerHighScore")) || 0
  );
  const [gameState, setGameState] = useState("menu"); // menu, playing, gameOver

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 400;

    // ------------------ Assets ------------------
    const createDinoSprite = () => {
      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = 176;
      spriteCanvas.height = 94;
      const sctx = spriteCanvas.getContext("2d");

      const dinoColor = "#535353";
      const eyeColor = "#000";

      // Frame 1 - Running
      sctx.fillStyle = dinoColor;
      sctx.fillRect(10, 10, 24, 30);
      sctx.fillRect(5, 25, 35, 15);
      sctx.fillRect(30, 35, 8, 12);
      sctx.fillRect(6, 35, 8, 12);
      sctx.fillStyle = eyeColor;
      sctx.fillRect(28, 15, 4, 4);

      // Frame 2 - Running
      sctx.fillStyle = dinoColor;
      sctx.fillRect(54, 10, 24, 30);
      sctx.fillRect(49, 25, 35, 15);
      sctx.fillRect(74, 35, 8, 12);
      sctx.fillRect(50, 35, 8, 12);
      sctx.fillStyle = eyeColor;
      sctx.fillRect(72, 15, 4, 4);

      // Frame 3 - Jumping
      sctx.fillStyle = dinoColor;
      sctx.fillRect(98, 5, 24, 35);
      sctx.fillRect(93, 20, 35, 15);
      sctx.fillRect(118, 30, 8, 17);
      sctx.fillRect(94, 30, 8, 17);
      sctx.fillStyle = eyeColor;
      sctx.fillRect(116, 10, 4, 4);

      // Frame 4 - Ducking
      sctx.fillStyle = dinoColor;
      sctx.fillRect(142, 20, 35, 20);
      sctx.fillRect(137, 25, 45, 15);
      sctx.fillRect(162, 35, 10, 8);
      sctx.fillRect(138, 35, 10, 8);
      sctx.fillStyle = eyeColor;
      sctx.fillRect(160, 25, 4, 4);

      return spriteCanvas;
    };

    const createObstacleSprites = () => {
      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = 120;
      spriteCanvas.height = 60;
      const sctx = spriteCanvas.getContext("2d");

      // Cactus 1
      sctx.fillStyle = "#2a5c03";
      sctx.fillRect(10, 20, 8, 40);
      sctx.fillRect(2, 30, 24, 6);
      sctx.fillRect(6, 40, 16, 6);

      // Cactus 2
      sctx.fillRect(40, 10, 10, 50);
      sctx.fillRect(30, 25, 30, 6);
      sctx.fillRect(35, 35, 20, 6);
      sctx.fillRect(32, 45, 26, 6);

      // Bird
      sctx.fillStyle = "#8B4513";
      sctx.beginPath();
      sctx.arc(85, 25, 8, 0, Math.PI * 2);
      sctx.fill();
      sctx.fillRect(78, 20, 14, 4);

      // Pterodactyl
      sctx.fillStyle = "#654321";
      sctx.beginPath();
      sctx.moveTo(110, 30);
      sctx.lineTo(130, 25);
      sctx.lineTo(125, 35);
      sctx.closePath();
      sctx.fill();

      return spriteCanvas;
    };

    // ------------------ Game State ------------------
    let game = {
      dino: {
        x: 80,
        y: 250,
        width: 44,
        height: 47,
        dy: 0,
        gravity: 0.8,
        jumpPower: -16,
        isJumping: false,
        isDucking: false,
        frame: 0,
        animationSpeed: 8,
      },
      obstacles: [],
      particles: [],
      speed: 8,
      distance: 0,
      lastSpawnTime: 0,
      animationId: null,
      groundOffset: 0,
      skyOffset: 0,
      speedIncreaseTimer: 0,
    };

    const dinoSprite = createDinoSprite();
    const obstacleSprite = createObstacleSprites();

    // ------------------ Input ------------------
    const keys = {};
    const handleKeyDown = (e) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        e.preventDefault();
        if (!game.dino.isJumping) jump();
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        game.dino.isDucking = true;
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "ArrowDown") game.dino.isDucking = false;
    };
    const handleTouch = (e) => {
      e.preventDefault();
      if (!game.dino.isJumping) jump();
    };

    const jump = () => {
      game.dino.dy = game.dino.jumpPower;
      game.dino.isJumping = true;
      createParticles(game.dino.x + 22, game.dino.y + 47, 5, "#FF6B6B");
    };

    const createParticles = (x, y, count, color) => {
      for (let i = 0; i < count; i++) {
        game.particles.push({
          x,
          y,
          dx: (Math.random() - 0.5) * 4,
          dy: Math.random() * -2 - 1,
          life: 30,
          maxLife: 30,
          color,
          size: Math.random() * 3 + 1,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("mousedown", handleTouch);

    // ------------------ Game Functions ------------------
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawGround = () => {
      game.groundOffset = (game.groundOffset + game.speed) % 30;
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(0, 300, canvas.width, 100);
    };

    const drawDino = () => {
      const dino = game.dino;
      let spriteX = 0;
      let spriteY = 0;

      if (dino.isJumping) spriteX = 88;
      else if (dino.isDucking) {
        spriteX = 132;
        spriteY = 47;
      } else spriteX = Math.floor(dino.frame / dino.animationSpeed) % 2 * 44;

      ctx.drawImage(dinoSprite, spriteX, spriteY, 44, 47, dino.x, dino.y, dino.width, dino.height);
      dino.frame++;
    };

    const drawObstacles = () => {
      game.obstacles.forEach((obs) => {
        let spriteX = 0;
        if (obs.type === "cactus1") spriteX = 0;
        else if (obs.type === "cactus2") spriteX = 40;
        else if (obs.type === "bird") spriteX = 80;
        else if (obs.type === "pterodactyl") spriteX = 100;

        ctx.drawImage(obstacleSprite, spriteX, 0, obs.width, obs.height, obs.x, obs.y, obs.width, obs.height);
      });
    };

    const spawnObstacle = () => {
      const now = Date.now();
      if (now - game.lastSpawnTime > 1200) {
        const types = [
          { type: "cactus1", width: 24, height: 40, y: 260 },
          { type: "cactus2", width: 30, height: 50, y: 250 },
          { type: "bird", width: 25, height: 15, y: 220 },
        ];
        const obs = types[Math.floor(Math.random() * types.length)];
        game.obstacles.push({ ...obs, x: canvas.width });
        game.lastSpawnTime = now;
      }
    };

    const updatePhysics = () => {
      game.dino.y += game.dino.dy;
      if (game.dino.isJumping) {
        game.dino.dy += game.dino.gravity;
        if (game.dino.y >= 250) {
          game.dino.y = 250;
          game.dino.dy = 0;
          game.dino.isJumping = false;
        }
      }
      game.obstacles.forEach((obs) => (obs.x -= game.speed));
      game.obstacles = game.obstacles.filter((obs) => obs.x + obs.width > 0);
    };

    const checkCollisions = () => {
      const dinoRect = { x: game.dino.x + 5, y: game.dino.y + 5, width: game.dino.width - 10, height: game.dino.height - 10 };
      for (let obs of game.obstacles) {
        if (dinoRect.x < obs.x + obs.width && dinoRect.x + dinoRect.width > obs.x &&
            dinoRect.y < obs.y + obs.height && dinoRect.y + dinoRect.height > obs.y) {
          endGame();
        }
      }
    };

    const endGame = () => {
      setGameState("gameOver");
      cancelAnimationFrame(game.animationId);
      if (game.distance > highScore) {
        setHighScore(game.distance);
        localStorage.setItem("dinoRunnerHighScore", game.distance);
      }
      // Submit score to parent if provided
      if (submitScore) submitScore(Math.floor(game.distance));
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.distance += game.speed * 0.1;
      setScore(Math.floor(game.distance));
      spawnObstacle();
      updatePhysics();
      checkCollisions();
      drawBackground();
      drawGround();
      drawObstacles();
      drawDino();

      if (gameState === "playing") {
        game.animationId = requestAnimationFrame(gameLoop);
      }
    };

    game.animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("mousedown", handleTouch);
      cancelAnimationFrame(game.animationId);
    };
  }, [gameState, highScore, submitScore]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 select-none p-4">
      <h1 className="text-5xl font-bold mb-2 text-white drop-shadow-lg">🦖 DINO RUNNER</h1>

      {gameState === "menu" && (
        <div className="text-center mb-6">
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🚀 START RUN
          </button>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2">GAME OVER!</h2>
          <p className="text-2xl text-white mb-1">Score: {Math.floor(score)}</p>
          <p className="text-xl text-yellow-300">High Score: {Math.floor(highScore)}</p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🔄 PLAY AGAIN
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="border-4 border-white/30 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-sm"
        style={{ width: 800, height: 400 }}
      />

      <div className="mt-6 flex gap-8 text-center">
        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl min-w-32">
          <p className="text-sm text-white/80">Current Score</p>
          <p className="text-2xl font-bold text-white">{Math.floor(score)}</p>
        </div>
        <div className="bg-green-500/20 backdrop-blur-sm p-4 rounded-xl min-w-32">
          <p className="text-sm text-white/80">Best Score</p>
          <p className="text-2xl font-bold text-green-300">{Math.floor(highScore)}</p>
        </div>
      </div>
    </div>
  );
}
