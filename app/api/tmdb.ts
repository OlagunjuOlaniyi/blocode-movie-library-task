import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'f7cb9f0a214b6bc7500d5307eea21bf1';

export const fetchPopularMovies = async () => {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`);
  return response.data.results;
};

export const fetchMovieDetails = async (id: number) => {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return response.data;
};
