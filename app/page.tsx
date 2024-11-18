"use client";

import { useState, useEffect } from "react";
import { fetchPopularMovies } from "../app/api/tmdb";
import Link from "next/link";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchPopularMovies();
      setMovies(data);
    };
    loadMovies();
  }, []);

  const addToFavorites = (movie: any) => {
    const existingFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const isAlreadyFavorite = existingFavorites.some(
      (fav: any) => fav.id === movie.id
    );

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...existingFavorites, movie];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      alert(`${movie.title} added to favorites!`);
    } else {
      alert(`${movie.title} is already in favorites!`);
    }
  };

  const filteredMovies = movies.filter((movie: any) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredMovies.map((movie: any) => (
          <div className="flex flex-col">
            <Link key={movie.id} href={`/pages/movie/${movie.id}`}>
              <div className="block border p-2 rounded shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto"
                />
                <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                <p className="text-sm">Release Date: {movie.release_date}</p>
                <p className="text-sm">Rating: {movie.vote_average}</p>
              </div>
            </Link>
            <button
              onClick={() => addToFavorites(movie)}
              className="bg-blue-500 text-white mt-2 p-1 rounded hover:bg-blue-600"
            >
              Add to Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
