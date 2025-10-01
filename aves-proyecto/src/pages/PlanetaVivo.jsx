const gallery = [
  {
    id: 1,
    title: "Bosques de niebla",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/12/Cloud_forest_Colombia.jpg",
  },
  {
    id: 2,
    title: "Colibrí en flor",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Hummingbird_in_Colombia.jpg",
  },
  {
    id: 3,
    title: "Paisaje cafetero",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Coffee_landscape_Colombia.jpg",
  },
];

export default function PlanetaVivo() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Planeta Vivo</h2>
      <p className="text-slate-600 mb-6">
        Una galería con imágenes que muestran la biodiversidad de Caldas y su relación con las aves.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded shadow overflow-hidden">
            <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
            <div className="p-3">
              <h3 className="font-semibold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
