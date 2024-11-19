"use client";

import { useState, useEffect } from "react";
import { fetchPopularMovies } from "../app/api/tmdb";
import Link from "next/link";

export default function Home({ initialMovies }: { initialMovies: any[] }) {
  const [movies, setMovies] = useState(initialMovies || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMovies = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await fetchPopularMovies(currentPage);
      setMovies((prevMovies) => [...prevMovies, ...data]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setIsLoading(false);
  };

  // Initial load
  useEffect(() => {
    loadMovies();
  }, []);

  // Infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 100;

      if (scrollPosition >= threshold && !isLoading) {
        loadMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, currentPage]);

  // Add to favorite function

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

      // Dispatch custom event
      window.dispatchEvent(new Event("favoritesUpdated"));

      alert(`${movie.title} added to favorites!`);
    } else {
      alert(`${movie.title} is already in favorites!`);
    }
  };

  // Update favorite count from localStorage

  useEffect(() => {
    const updateFavoriteCount = () => {
      const storedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      setFavoriteCount(storedFavorites.length);
    };

    // Initial load
    updateFavoriteCount();

    // Listen to custom "favoritesUpdated" event
    window.addEventListener("favoritesUpdated", updateFavoriteCount);

    // Cleanup listener
    return () => {
      window.removeEventListener("favoritesUpdated", updateFavoriteCount);
    };
  }, []);

  // Search functionality

  const filteredMovies = movies.filter((movie: any) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[60%] mb-4 p-2 border rounded"
        />
        <Link href={`/pages/favorites`}>
          <p className="mr-4 text-blue-500">
            Favorite
            <span className="absolute bg-white text-black ml-[4px] px-[2px] rounded-full text-[12px]">
              {favoriteCount}
            </span>
          </p>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
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
              className="bg-blue-500 text-white mt-2 p-1 rounded hover:bg-blue-600 w-[60%]"
            >
              Add to Favorites
            </button>
          </div>
        ))}
      </div>
      {isLoading && <p className="text-center mt-4">Loading more movies...</p>}
    </div>
  );
}
