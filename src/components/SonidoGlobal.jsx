import React, { useEffect, useRef, useState } from "react";

export default function SonidoGlobal() {
  const audioRef = useRef(null);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;

    const playAudio = () => {
      audio.play().catch(() => {
        const unlock = () => {
          audio.play().catch(() => {});
          window.removeEventListener("click", unlock);
        };
        window.addEventListener("click", unlock);
      });
    };

    playAudio();
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activo) audio.pause();
    else audio.play().catch(() => {});
    setActivo(!activo);
  };

  return (
    <>
      <audio ref={audioRef} src="/sonidos/naturaleza.mp3" loop autoPlay style={{ display: "none" }} />
      <button
        onClick={toggleAudio}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          zIndex: 9999,
        }}
        title={activo ? "Silenciar sonido" : "Activar sonido"}
      >
        {activo ? "🔊" : "🔇"}
      </button>
    </>
  );
}
