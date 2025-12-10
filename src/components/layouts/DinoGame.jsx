// src/pages/DinoGame.jsx
import React, { useRef, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";


export default function DinoGame() {
  const canvasRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem("dinoRunnerHighScore")) || 0);
  const [gameState, setGameState] = useState("menu"); // menu, playing, gameOver
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  // Load user email from profile on mount (if axiosSecure available)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosSecure.get("/my-profile");
        if (mounted) setEmail(res.data?.email || "");
      } catch (err) {
        // ignore
      }
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 400;

    // (Game code exactly like your provided version, adapted slightly to call onGameOver)
    // ... I'll reuse your game logic but call onGameOver when game ends

    // Game assets (programmatically generated)
    const createDinoSprite = () => {
      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = 176;
      spriteCanvas.height = 94;
      const sctx = spriteCanvas.getContext("2d");
      const dinoColor = "#535353";
      const eyeColor = "#000";

      // draw frames...
      sctx.fillStyle = dinoColor;
      sctx.fillRect(10, 10, 24, 30);
      sctx.fillRect(5, 25, 35, 15);
      sctx.fillRect(30, 35, 8, 12);
      sctx.fillRect(6, 35, 8, 12);
      sctx.fillStyle = eyeColor;
      sctx.fillRect(28, 15, 4, 4);

      sctx.fillStyle = dinoColor;
      sctx.fillRect(54, 10, 24, 30);
      sctx.fillRect(49, 25, 35, 15);
      sctx.fillRect(74, 35, 8, 12);
      sctx.fillRect(50, 35, 8, 12);
      sctx.fillStyle = eyeColor;
      sctx.fillRect(72, 15, 4, 4);

      sctx.fillStyle = dinoColor;
      sctx.fillRect(98, 5, 24, 35);
      sctx.fillRect(93, 20, 35, 15);
      sctx.fillRect(118, 30, 8, 17);
      sctx.fillRect(94, 30, 8, 17);
      sctx.fillStyle = eyeColor;
      sctx.fillRect(116, 10, 4, 4);

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
      spriteCanvas.width = 160;
      spriteCanvas.height = 80;
      const sctx = spriteCanvas.getContext("2d");
      sctx.fillStyle = "#2a5c03";
      sctx.fillRect(10, 20, 8, 40);
      sctx.fillRect(2, 30, 24, 6);
      sctx.fillRect(6, 40, 16, 6);

      sctx.fillRect(40, 10, 10, 50);
      sctx.fillRect(30, 25, 30, 6);
      sctx.fillRect(35, 35, 20, 6);
      sctx.fillRect(32, 45, 26, 6);

      sctx.fillStyle = "#8B4513";
      sctx.beginPath();
      sctx.arc(110, 25, 8, 0, Math.PI * 2);
      sctx.fill();
      sctx.fillRect(103, 20, 14, 4);

      return spriteCanvas;
    };

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

    const keys = { ArrowUp: false, ArrowDown: false, Space: false };

    const handleKeyDown = (e) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        e.preventDefault();
        if (!keys.ArrowUp && !game.dino.isJumping) jump();
        keys.ArrowUp = true;
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        keys.ArrowDown = true;
        game.dino.isDucking = true;
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "ArrowUp" || e.code === "Space") keys.ArrowUp = false;
      if (e.code === "ArrowDown") {
        keys.ArrowDown = false;
        game.dino.isDucking = false;
      }
    };
    const handleTouch = (e) => {
      e.preventDefault();
      if (!game.dino.isJumping) jump();
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

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      game.skyOffset += game.speed * 0.1;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 5; i++) {
        const x = (i * 200 - game.skyOffset) % (canvas.width + 200) - 50;
        ctx.beginPath();
        ctx.arc(x, 60 + i * 30, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, 60 + i * 30, 25, 0, Math.PI * 2);
        ctx.arc(x + 50, 60 + i * 30, 20, 0, Math.PI * 2);
        ctx.fill();
      }

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
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(0, 300, canvas.width, 100);
      ctx.fillStyle = "#A52A2A";
      for (let i = -30; i < canvas.width + 30; i += 30) {
        ctx.fillRect(i + game.groundOffset, 300, 15, 5);
      }
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
        spriteX = 88;
      } else if (dino.isDucking) {
        spriteX = 132;
        spriteY = 47;
      } else {
        spriteX = Math.floor((dino.frame / dino.animationSpeed) % 2) * 44;
      }

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

        ctx.drawImage(obstacleSprite, spriteX, 0, obs.spriteWidth || 30, obs.spriteHeight || 50, obs.x, obs.y, obs.width, obs.height);
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

      const maxSpeed = 20;
      const speedPercentage = (game.speed / maxSpeed) * 100;
      ctx.fillStyle = "#FF6B6B";
      ctx.fillRect(canvas.width - 120, 20, Math.min(120, speedPercentage * 1.2), 15);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(canvas.width - 120, 20, 120, 15);
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px Arial";
      ctx.fillText("SPEED", canvas.width - 115, 35);
    };

    const spawnObstacle = () => {
      const currentTime = Date.now();
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
        game.obstacles.push({ ...obstacle, x: canvas.width, frame: 0 });
        game.lastSpawnTime = currentTime;
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
          createParticles(game.dino.x + 22, game.dino.y + 47, 3, "#4ECDC4");
        }
      }

      game.obstacles.forEach((obs) => (obs.x -= game.speed));
      game.particles.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life--;
      });
      game.particles = game.particles.filter((p) => p.life > 0);
      game.obstacles = game.obstacles.filter((obs) => obs.x + obs.width > 0);
    };

    const increaseSpeed = () => {
      game.speedIncreaseTimer++;
      if (game.speedIncreaseTimer >= 120) {
        game.speed += 0.5;
        game.speedIncreaseTimer = 0;
        createParticles(canvas.width - 60, 40, 10, "#FF6B6B");
      }
    };

    const checkCollisions = () => {
      const dino = game.dino;
      const dinoRect = { x: dino.x + 5, y: dino.y + 5, width: dino.width - 10, height: dino.height - 10 };
      for (let obs of game.obstacles) {
        if (dinoRect.x < obs.x + obs.width && dinoRect.x + dinoRect.width > obs.x && dinoRect.y < obs.y + obs.height && dinoRect.y + dinoRect.height > obs.y) {
          onGameOver();
          return;
        }
      }
    };

    const onGameOver = () => {
      // finalize score, set state, then submit to backend
      setGameState("gameOver");
      createParticles(game.dino.x + 22, game.dino.y + 22, 20, "#FF6B6B");
      if (game.distance > highScore) {
        setHighScore(game.distance);
        localStorage.setItem("dinoRunnerHighScore", game.distance);
      }
      cancelAnimationFrame(game.animationId);

      // Submit score to backend
      submitScore(Math.floor(game.distance));
    };

    const submitScore = async (finalScore) => {
      if (!email) {
        setMessage("Score not submitted (no user).");
        return;
      }
      setSubmitting(true);
      setMessage("");
      try {
        const res = await axiosSecure.post("/dinogame/play", { email, score: finalScore });
        if (res.data?.success) {
          setMessage(res.data.message || `You earned ${res.data.reward} Taka!`);
        } else {
          setMessage(res.data?.message || "Score submission failed");
        }
      } catch (err) {
        setMessage(err?.response?.data?.message || "Error submitting score");
      } finally {
        setSubmitting(false);
      }
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.distance += game.speed * 0.1;
      setScore(Math.floor(game.distance));
      increaseSpeed();
      updatePhysics();
      spawnObstacle();
      checkCollisions();
      drawBackground();
      drawGround();
      drawObstacles();
      drawParticles();
      drawDino();
      drawHUD();
      if (gameState === "playing") game.animationId = requestAnimationFrame(gameLoop);
    };

    game.animationId = requestAnimationFrame(gameLoop);

    // cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("mousedown", handleTouch);
      cancelAnimationFrame(game.animationId);
    };
  }, [gameState, highScore, axiosSecure, email]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 select-none p-4">
      <h1 className="text-5xl font-bold mb-2 text-white drop-shadow-lg">🦖 DINO RUNNER</h1>

      {gameState === "menu" && (
        <div className="text-center mb-6">
          <p className="text-xl text-white mb-6 drop-shadow">Speed increases over time! How long can you survive?</p>
          <button onClick={startGame} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200">🚀 START RUN</button>
          <div className="mt-8 bg-white/20 backdrop-blur-sm p-6 rounded-2xl max-w-md">
            <h3 className="text-lg font-bold text-white mb-3">🎮 How to Play:</h3>
            <div className="text-left text-white space-y-2">
              <p>🔼 <strong>SPACE / UP ARROW</strong> - Jump over obstacles</p>
              <p>🔽 <strong>DOWN ARROW</strong> - Duck under flying enemies</p>
              <p>👆 <strong>TAP / CLICK</strong> - Jump (Mobile)</p>
              <p>⚡ <strong>Speed increases every 2 seconds!</strong></p>
              <p>🎯 <strong>Avoid all obstacles to survive</strong></p>
            </div>
          </div>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="text-center mb-6">
          <div className="bg-red-500/90 backdrop-blur-sm p-8 rounded-2xl mb-6 transform animate-bounce">
            <h2 className="text-4xl font-bold text-white mb-2">GAME OVER!</h2>
            <p className="text-2xl text-white mb-1">Score: {Math.floor(score)}</p>
            <p className="text-xl text-yellow-300">High Score: {Math.floor(highScore)}</p>
          </div>
          <button onClick={startGame} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200">🔄 PLAY AGAIN</button>
          <div className="mt-4 text-white">
            {submitting ? "Submitting score..." : message}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="border-4 border-white/30 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-sm" style={{ width: 800, height: 400 }} />

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
