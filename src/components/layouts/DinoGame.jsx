import React, { useRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function DinoGame() {
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

    // Game assets (programmatically generated)
    const createDinoSprite = () => {
      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = 176; // 4 frames * 44px
      spriteCanvas.height = 94; // 2 rows * 47px
      const sctx = spriteCanvas.getContext("2d");

      // Colors
      const dinoColor = "#535353";
      const eyeColor = "#000";

      // Frame 1 - Running 1
      sctx.fillStyle = dinoColor;
      sctx.fillRect(10, 10, 24, 30); // Body
      sctx.fillRect(5, 25, 35, 15); // Main body
      sctx.fillRect(30, 35, 8, 12); // Back leg
      sctx.fillRect(6, 35, 8, 12); // Front leg
      // Eye
      sctx.fillStyle = eyeColor;
      sctx.fillRect(28, 15, 4, 4);

      // Frame 2 - Running 2
      sctx.fillStyle = dinoColor;
      sctx.fillRect(54, 10, 24, 30);
      sctx.fillRect(49, 25, 35, 15);
      sctx.fillRect(74, 35, 8, 12);
      sctx.fillRect(50, 35, 8, 12);
      sctx.fillStyle = eyeColor;
      sctx.fillRect(72, 15, 4, 4);

      // Frame 3 - Jumping
      sctx.fillStyle = dinoColor;
      sctx.fillRect(98, 5, 24, 35); // Higher body
      sctx.fillRect(93, 20, 35, 15);
      sctx.fillRect(118, 30, 8, 17); // Straight legs
      sctx.fillRect(94, 30, 8, 17);
      sctx.fillStyle = eyeColor;
      sctx.fillRect(116, 10, 4, 4);

      // Frame 4 - Ducking
      sctx.fillStyle = dinoColor;
      sctx.fillRect(142, 20, 35, 20); // Lower, wider body
      sctx.fillRect(137, 25, 45, 15);
      sctx.fillRect(162, 35, 10, 8); // Shorter legs
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

      // Cactus 2 (taller)
      sctx.fillRect(40, 10, 10, 50);
      sctx.fillRect(30, 25, 30, 6);
      sctx.fillRect(35, 35, 20, 6);
      sctx.fillRect(32, 45, 26, 6);

      // Bird
      sctx.fillStyle = "#8B4513";
      sctx.beginPath();
      sctx.arc(85, 25, 8, 0, Math.PI * 2);
      sctx.fill();
      // Wings (animated)
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

    // Game state
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
      speed: 8, // Starting speed
      distance: 0,
      lastSpawnTime: 0,
      animationId: null,
      groundOffset: 0,
      skyOffset: 0,
      speedIncreaseTimer: 0,
    };

    // Create sprites
    const dinoSprite = createDinoSprite();
    const obstacleSprite = createObstacleSprites();

    // Input handling
    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      Space: false,
    };

    const handleKeyDown = (e) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        e.preventDefault();
        if (!keys.ArrowUp && !game.dino.isJumping) {
          jump();
        }
        keys.ArrowUp = true;
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        keys.ArrowDown = true;
        game.dino.isDucking = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        keys.ArrowUp = false;
      }
      if (e.code === "ArrowDown") {
        keys.ArrowDown = false;
        game.dino.isDucking = false;
      }
    };

    const handleTouch = (e) => {
      e.preventDefault();
      if (!game.dino.isJumping) {
        jump();
      }
    };

    const jump = () => {
      if (!game.dino.isJumping) {
        game.dino.dy = game.dino.jumpPower;
        game.dino.isJumping = true;
        createParticles(game.dino.x + 22, game.dino.y + 47, 5, "#FF6B6B");
      }
    };

    const createParticles = (x, y, count, color) => {
      for (let i = 0; i < count; i++) {
        game.particles.push({
          x: x,
          y: y,
          dx: (Math.random() - 0.5) * 4,
          dy: Math.random() * -2 - 1,
          life: 30,
          maxLife: 30,
          color: color,
          size: Math.random() * 3 + 1,
        });
      }
    };

    // Event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("mousedown", handleTouch);

    // Drawing functions
    const drawBackground = () => {
      // Animated sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Moving clouds
      game.skyOffset += game.speed * 0.1;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 5; i++) {
        const x = ((i * 200 - game.skyOffset) % (canvas.width + 200)) - 50;
        ctx.beginPath();
        ctx.arc(x, 60 + i * 30, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, 60 + i * 30, 25, 0, Math.PI * 2);
        ctx.arc(x + 50, 60 + i * 30, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mountains
      ctx.fillStyle = "#8DA9B4";
      ctx.beginPath();
      ctx.moveTo(0, 200);
      for (let i = 0; i < canvas.width + 100; i += 100) {
        const x = (i - game.skyOffset * 0.3) % (canvas.width + 100);
        ctx.lineTo(x, 150 + Math.sin(i * 0.01 + game.skyOffset * 0.01) * 20);
      }
      ctx.lineTo(canvas.width, 200);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    };

    const drawGround = () => {
      game.groundOffset = (game.groundOffset + game.speed) % 30;

      // Ground base
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(0, 300, canvas.width, 100);

      // Ground pattern
      ctx.fillStyle = "#A52A2A";
      for (let i = -30; i < canvas.width + 30; i += 30) {
        ctx.fillRect(i + game.groundOffset, 300, 15, 5);
      }

      // Ground highlight
      ctx.strokeStyle = "#DEB887";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.lineTo(canvas.width, 300);
      ctx.stroke();
    };

    const drawDino = () => {
      const dino = game.dino;
      let spriteX = 0;
      let spriteY = 0;

      if (dino.isJumping) {
        spriteX = 88; // Jumping frame
      } else if (dino.isDucking) {
        spriteX = 132; // Ducking frame
        spriteY = 47; // Second row
      } else {
        // Running animation
        spriteX = Math.floor((dino.frame / dino.animationSpeed) % 2) * 44;
      }

      ctx.drawImage(
        dinoSprite,
        spriteX,
        spriteY,
        44,
        47,
        dino.x,
        dino.y,
        dino.width,
        dino.height
      );

      dino.frame++;
    };

    const drawObstacles = () => {
      game.obstacles.forEach((obs) => {
        let spriteX = 0;

        if (obs.type === "cactus1") spriteX = 0;
        else if (obs.type === "cactus2") spriteX = 40;
        else if (obs.type === "bird") spriteX = 80;
        else if (obs.type === "pterodactyl") spriteX = 100;

        ctx.drawImage(
          obstacleSprite,
          spriteX,
          0,
          obs.spriteWidth || 30,
          obs.spriteHeight || 50,
          obs.x,
          obs.y,
          obs.width,
          obs.height
        );
      });
    };

    const drawParticles = () => {
      game.particles.forEach((particle) => {
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    const drawHUD = () => {
      ctx.fillStyle = "#000";
      ctx.font = "bold 20px Arial";
      ctx.fillText(`SCORE: ${Math.floor(game.distance)}`, 20, 30);
      ctx.fillText(`HIGH SCORE: ${Math.floor(highScore)}`, 20, 55);
      ctx.fillText(`SPEED: ${game.speed.toFixed(1)}`, 20, 80);

      // Speed meter
      const maxSpeed = 20;
      const speedPercentage = (game.speed / maxSpeed) * 100;
      ctx.fillStyle = "#FF6B6B";
      ctx.fillRect(canvas.width - 120, 20, speedPercentage * 1.2, 15);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(canvas.width - 120, 20, 120, 15);

      // Speed indicator text
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px Arial";
      ctx.fillText("SPEED", canvas.width - 115, 35);
    };

    // Game logic
    const spawnObstacle = () => {
      const currentTime = Date.now();
      // Spawn obstacles more frequently as speed increases
      const baseSpawnTime = 1500;
      const speedFactor = Math.max(300, 800 - game.speed * 50);
      const spawnTime = baseSpawnTime - speedFactor;

      if (currentTime - game.lastSpawnTime > spawnTime) {
        const types = [
          { type: "cactus1", width: 24, height: 40, y: 260 },
          { type: "cactus2", width: 30, height: 50, y: 250 },
          { type: "bird", width: 25, height: 15, y: 220 },
          { type: "pterodactyl", width: 35, height: 20, y: 210 },
        ];

        const obstacle = types[Math.floor(Math.random() * types.length)];

        game.obstacles.push({
          ...obstacle,
          x: canvas.width,
          frame: 0,
        });

        game.lastSpawnTime = currentTime;
      }
    };

    const updatePhysics = () => {
      // Dino physics
      game.dino.y += game.dino.dy;

      if (game.dino.isJumping) {
        game.dino.dy += game.dino.gravity;
        if (game.dino.y >= 250) {
          game.dino.y = 250;
          game.dino.dy = 0;
          game.dino.isJumping = false;
          createParticles(game.dino.x + 22, game.dino.y + 47, 3, "#4ECDC4");
        }
      }

      // Update obstacles
      game.obstacles.forEach((obs) => (obs.x -= game.speed));

      // Update particles
      game.particles.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life--;
      });
      game.particles = game.particles.filter((p) => p.life > 0);

      // Clean up off-screen objects
      game.obstacles = game.obstacles.filter((obs) => obs.x + obs.width > 0);
    };

    const increaseSpeed = () => {
      game.speedIncreaseTimer++;
      // Increase speed every 2 seconds
      if (game.speedIncreaseTimer >= 120) {
        game.speed += 0.5;
        game.speedIncreaseTimer = 0;

        // Visual feedback for speed increase
        createParticles(canvas.width - 60, 40, 10, "#FF6B6B");
      }
    };

    const checkCollisions = () => {
      const dino = game.dino;
      const dinoRect = {
        x: dino.x + 5,
        y: dino.y + 5,
        width: dino.width - 10,
        height: dino.height - 10,
      };

      // Check obstacle collisions
      for (let obs of game.obstacles) {
        if (
          dinoRect.x < obs.x + obs.width &&
          dinoRect.x + dinoRect.width > obs.x &&
          dinoRect.y < obs.y + obs.height &&
          dinoRect.y + dinoRect.height > obs.y
        ) {
          endGame();
          return;
        }
      }
    };

    const endGame = () => {
      setGameState("gameOver");
      createParticles(game.dino.x + 22, game.dino.y + 22, 20, "#FF6B6B");
      if (game.distance > highScore) {
        setHighScore(game.distance);
        localStorage.setItem("dinoRunnerHighScore", game.distance);
      }
      cancelAnimationFrame(game.animationId);
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update game state
      game.distance += game.speed * 0.1;
      setScore(Math.floor(game.distance));

      // Increase speed over time
      increaseSpeed();

      updatePhysics();
      spawnObstacle();
      checkCollisions();

      // Draw everything
      drawBackground();
      drawGround();
      drawObstacles();
      drawParticles();
      drawDino();
      drawHUD();

      if (gameState === "playing") {
        game.animationId = requestAnimationFrame(gameLoop);
      }
    };

    // Start game
    game.animationId = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("mousedown", handleTouch);
      cancelAnimationFrame(game.animationId);
    };
  }, [gameState, highScore]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 select-none p-4">
      
      <Helmet>
        <title>Dino Run Game || Learn and Earned</title>
      </Helmet>

      <h1 className="text-5xl font-bold mb-2 text-white drop-shadow-lg">
        🦖 DINO RUNNER
      </h1>

      {gameState === "menu" && (
        <div className="text-center mb-6">
          <p className="text-xl text-white mb-6 drop-shadow">
            Speed increases over time! How long can you survive?
          </p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🚀 START RUN
          </button>
          <div className="mt-8 bg-white/20 backdrop-blur-sm p-6 rounded-2xl max-w-md">
            <h3 className="text-lg font-bold text-white mb-3">
              🎮 How to Play:
            </h3>
            <div className="text-left text-white space-y-2">
              <p>
                🔼 <strong>SPACE / UP ARROW</strong> - Jump over obstacles
              </p>
              <p>
                🔽 <strong>DOWN ARROW</strong> - Duck under flying enemies
              </p>
              <p>
                👆 <strong>TAP / CLICK</strong> - Jump (Mobile)
              </p>
              <p>
                ⚡ <strong>Speed increases every 2 seconds!</strong>
              </p>
              <p>
                🎯 <strong>Avoid all obstacles to survive</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="text-center mb-6">
          <div className="bg-red-500/90 backdrop-blur-sm p-8 rounded-2xl mb-6 transform animate-bounce">
            <h2 className="text-4xl font-bold text-white mb-2">GAME OVER!</h2>
            <p className="text-2xl text-white mb-1">
              Score: {Math.floor(score)}
            </p>
            <p className="text-xl text-yellow-300">
              High Score: {Math.floor(highScore)}
            </p>
          </div>
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
          <p className="text-2xl font-bold text-green-300">
            {Math.floor(highScore)}
          </p>
        </div>
      </div>
    </div>
  );
}
