"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../../../api/tmdb";
import { useParams } from "next/navigation";

const MovieDetails = () => {
  //   const router = useRouter();
  //   const { id } = router.query;

  const params = useParams();
  const id = params.slug;
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const loadMovieDetails = async () => {
        const data = await fetchMovieDetails(Number(id));
        setMovie(data);
      };
      loadMovieDetails();
    }
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto"
      />
      <p>{movie.overview}</p>
      <p>Genres: {movie.genres.map((genre: any) => genre.name).join(", ")}</p>
    </div>
  );
};

export default MovieDetails;
