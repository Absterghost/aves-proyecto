import { useState } from "react";

export default function Semillero() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("semilleroNotes")) || [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");

  function addNote(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const newNotes = [...notes, { id: Date.now(), content: text }];
    setNotes(newNotes);
    localStorage.setItem("semilleroNotes", JSON.stringify(newNotes));
    setText("");
  }

  function deleteNote(id) {
    const newNotes = notes.filter((n) => n.id !== id);
    setNotes(newNotes);
    localStorage.setItem("semilleroNotes", JSON.stringify(newNotes));
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Semillero (área privada)</h2>
      <p className="text-slate-600 mb-6">
        Aquí puedes guardar notas y actividades de tu semillero de investigación.
      </p>

      <form onSubmit={addNote} className="flex gap-2 mb-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe una nota..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded">Agregar</button>
      </form>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <span>{note.content}</span>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-500 text-sm"
            >
              Eliminar
            </button>
          </div>
        ))}

        {notes.length === 0 && (
          <p className="text-slate-500 text-sm">No hay notas guardadas.</p>
        )}
      </div>
    </section>
  );
}
