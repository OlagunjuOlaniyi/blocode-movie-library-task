"use client";

import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../../../api/tmdb";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  genres: Genre[];
}

const MovieDetails = () => {
  const params = useParams();
  const id = params.slug;
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (id) {
      const loadMovieDetails = async () => {
        const data = await fetchMovieDetails(Number(id));
        setMovie(data);
      };
      loadMovieDetails();
    }
  }, [id]);

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

  if (!movie) return <div>Loading...</div>;

  return (
    <div>
      <div className="p-4 flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex flex-col">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || ""}
            alt={movie.title || "No Title"}
            width={300}
            height={450}
            className="min-w-[300px] h-auto"
          />
          <button
            onClick={() => addToFavorites(movie)}
            className="bg-blue-500 text-white mt-2 p-1 rounded hover:bg-blue-600 "
          >
            Add to Favorites
          </button>
        </div>
        <div className="flex flex-col gap-4 lg:p-4">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p>{movie.overview}</p>
          <p className="text-sm">
            Genres: {movie.genres.map((genre: Genre) => genre.name).join(", ")}
          </p>
        </div>
      </div>

      <div className="mt-[50px] flex justify-center">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || ""}
          alt={movie.title || "No Title"}
          width={1000}
          height={1500}
          className="lg:w-[60%] h-auto"
        />
      </div>
    </div>
  );
};

export default MovieDetails;
