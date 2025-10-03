import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import hojaImg from "../assets/hojas/hoja1.png";

export default function FondoAnimado() {
  const canvasRef = useRef(null);
  const climas = ["sol", "nublado", "lluvia"];
  const [clima, setClima] = useState(() => climas[Math.floor(Math.random() * climas.length)]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hojasFlotantes = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 40 + 20,
      speed: Math.random() * 2 + 0.5,
      angle: Math.random() * Math.PI * 2,
    }));

    const niebla = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 100 + 50,
      alpha: Math.random() * 0.3 + 0.1,
    }));

    const lluvia = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: 10 + Math.random() * 10,
      speed: 4 + Math.random() * 4,
    }));

    const hojaImage = new Image();
    hojaImage.src = hojaImg;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle =
        clima === "sol" ? "#a3d9a5" : clima === "nublado" ? "#8eb6a5" : "#789d8a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      hojasFlotantes.forEach(h => {
        h.x += Math.cos(h.angle) * h.speed;
        h.y += Math.sin(h.angle) * h.speed;
        h.angle += h.speed * 0.01;
        if (h.y > canvas.height) h.y = -h.size;
        if (h.x > canvas.width) h.x = -h.size;
        ctx.drawImage(hojaImage, h.x, h.y, h.size, h.size);
      });

      niebla.forEach(n => {
        ctx.fillStyle = `rgba(255,255,255,${n.alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (clima === "lluvia") {
        ctx.strokeStyle = "rgba(173,216,230,0.6)";
        ctx.lineWidth = 2;
        lluvia.forEach(r => {
          r.y += r.speed;
          if (r.y > canvas.height) r.y = -r.length;
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x, r.y + r.length);
          ctx.stroke();
        });
      }

      requestAnimationFrame(draw);
    };

    draw();
    gsap.to(niebla, { alpha: "+=0.1", duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [clima]); // Dependencia opcional solo si quieres redibujar al cambiar clima

  // --- NUEVO USEEFFECT SOLO PARA CAMBIO DE CLIMA ---
  useEffect(() => {
    const cambioClima = setInterval(() => {
      setClima(prev => {
        const indice = climas.indexOf(prev);
        return climas[(indice + 1) % climas.length];
      });
    }, 90000); // 1.5 minutos

    return () => clearInterval(cambioClima);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
