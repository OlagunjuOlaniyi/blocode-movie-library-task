"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPopularMovies } from "./api/tmdb";
import Link from "next/link";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadMovies = useCallback(async () => {
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
  }, [currentPage, isLoading]);

  // Initial load
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Infinite scrolling
  const handleScroll = useCallback(() => {
    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const threshold = document.documentElement.offsetHeight - 100;

    if (scrollPosition >= threshold && !isLoading) {
      loadMovies();
    }
  }, [isLoading, loadMovies]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Add to favorite function

  const addToFavorites = (movie: Movie) => {
    const existingFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const isAlreadyFavorite = existingFavorites.some(
      (fav: Movie) => fav.id === movie.id
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

  const filteredMovies = movies.filter((movie: Movie) =>
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
        {filteredMovies.map((movie: Movie) => (
          <div className="flex flex-col" key={movie.id}>
            <Link href={`/pages/movie/${movie.id}`}>
              <div className="block border p-2 rounded shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${
                    movie.poster_path || ""
                  }`}
                  width={500} 
                  height={750}
                  alt={movie.title || "No Title"}
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
