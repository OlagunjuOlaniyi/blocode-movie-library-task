import { useEffect, useState } from "react";
import Link from "next/link";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<any[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Function to remove a movie from favorites
  const removeFavorite = (movieId: number) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Favorite Movies</h1>
      {favorites.length === 0 ? (
        <p>You have no favorite movies.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="border p-2 rounded shadow-md hover:shadow-lg transition-shadow"
            >
              <Link href={`/movie/${movie.id}`}>
                <a>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                  <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                  <p className="text-sm">Release Date: {movie.release_date}</p>
                </a>
              </Link>
              <button
                onClick={() => removeFavorite(movie.id)}
                className="bg-red-500 text-white mt-2 p-1 rounded hover:bg-red-600"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;