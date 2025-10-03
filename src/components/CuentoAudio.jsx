// src/components/CuentoAudio.jsx
import React from "react";

const audios = [
  "/audios/cuento1.mp3",
  "/audios/cuento2.mp3",
  "/audios/cuento3.mp3",
];

export default function CuentoAudio() {
  const audioRandom = audios[Math.floor(Math.random() * audios.length)];

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">Escucha un cuento</h3>
      <audio controls src={audioRandom} className="w-full" />
    </div>
  );
}
