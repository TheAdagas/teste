
import React, { useEffect, useRef, useState } from 'react';
import './index.css';

const App = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const particles = useRef([]);
  const mouseOver = useRef(false);
  const [typedText, setTypedText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const message = "Feito com amor para você ❤️";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const heartShape = (t) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return { x, y };
    };

    for (let i = 0; i < 1000; i++) {
      const t = Math.random() * Math.PI * 2;
      const pos = heartShape(t);
      const x = canvas.width / 2 + pos.x * 15;
      const y = canvas.height / 2 + pos.y * 15;
      particles.current.push({
        homeX: x,
        homeY: y,
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        size: 2 + Math.random() * 2,
        alpha: 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let p of particles.current) {
        if (mouseOver.current) {
          p.vx += (Math.random() - 0.5) * 2;
          p.vy += (Math.random() - 0.5) * 2;
        } else {
          const dx = p.homeX - p.x;
          const dy = p.homeY - p.y;
          p.vx += dx * 0.01;
          p.vy += dy * 0.01;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.9;
        p.vy *= 0.9;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 105, 180, ${p.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseEnter = () => (mouseOver.current = true);
    const handleMouseLeave = () => (mouseOver.current = false);

    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setTypedText((prev) => prev + message[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText("https://amore-chi.vercel.app");
      alert("Link copiado para a área de transferência!");
    } catch (err) {
      alert("Erro ao copiar link.");
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="absolute bottom-32 w-full flex justify-center items-center z-10">
        <h1 className="text-pink-400 text-4xl md:text-5xl font-bold animate-pulse drop-shadow-lg">{typedText}</h1>
      </div>
      <div className="absolute bottom-10 w-full flex justify-center gap-4 z-10">
        <button onClick={toggleAudio} className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl shadow-md">
          {isPlaying ? '⏸️ Pausar Música' : '▶️ Tocar Música'}
        </button>
        <button onClick={share} className="bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-xl shadow-md">
          🔗 Compartilhar
        </button>
        <audio ref={audioRef} src="background-music.mp3" loop />
      </div>
    </>
  );
};

export default App;
