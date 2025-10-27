import { useEffect, useState } from "react";
import axios from "axios";
import Banner from "../components/Banner";
import MovieGrid from "../Components/MovieGrid";
import FilterBar from "../Components/FilterBar";
import Pagination from "../Components/Pagination";

const API_KEY = import.meta.env.VITE_TMDB_API;

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [defaultMovies, setDefaultMovies] = useState([]);
  const [mode, setMode] = useState("default"); // ✅ "default" | "filter" | "search"

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // ✅ Fetch default Tamil movies
  const fetchDefaultMovies = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=ta&release_date.lte=${year}-${month}-${day}&release_date.gte=${year}-01-01&page=${page}`
      );
      setMovies(res.data.results);
      setDefaultMovies(res.data.results);
      setMessage(res.data.results.length ? "" : "No movies available.");
      setMode("default");
    } catch (err) {
      setMessage("Failed to load movies.");
    }
  };

  // 🔍 Search movies
  const handleSearch = async (query) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
      );

      if (res.data.results.length === 0) {
        setMovies([]);
        setMessage(`No movies found for "${query}".`);
      } else {
        setMovies(res.data.results);
        setMessage("");
      }
      setMode("search");
    } catch (err) {
      setMessage("Something went wrong while searching!");
    }
  };

  // 🎛 Filter movies
  const handleFilter = async ({ year, rating, language }) => {
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`;
      if (language) url += `&with_original_language=${language}`;
      if (year) url += `&primary_release_year=${year}`;
      if (rating) url += `&vote_average.gte=${rating}`;

      const res = await axios.get(url);

      if (res.data.results.length === 0) {
        setMovies([]);
        setMessage("No movies found for the selected filter.");
      } else {
        setMovies(res.data.results);
        setMessage("");
      }
      setMode("filter");
    } catch (err) {
      setMessage("Something went wrong while filtering!");
    }
  };

  // 🔙 Reset to defaults
  const handleReset = (mode) => {
    if(mode === "all"){
      localStorage.removeItem("movieFilters");
    }
    localStorage.removeItem("searchQuery");
    setMessage("");
    fetchDefaultMovies();
  };

  // ✅ Load Tamil movies initially
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("movieFilters"));
    const savedQuery = localStorage.getItem("searchQuery");

    if(savedQuery) {
      handleSearch(savedQuery);
    } else if (savedFilters) {
      handleFilter(savedFilters);
    } else {
      fetchDefaultMovies();
    }
  }, [page]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      <Banner />
      <section className="mx-auto py-6 px-6 md:px-10">
        <FilterBar onSearch={handleSearch} onFilter={handleFilter} onReset={handleReset} />

        <h2 className="text-2xl font-semibold mb-4 text-red-500">
          🎬 {mode === "default"
            ? "Popular Tamil Movies"
            : mode === "filter"
            ? "Filtered Movies"
            : "Search Results"}
        </h2>

        {message ? (
          <div className="text-center py-20 text-gray-400 text-lg">
            {message}
            <div className="mt-4">
              <button
                onClick={handleReset("all")}
                className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg text-white font-medium transition"
              >
                ⬅ Back
              </button>
            </div>
          </div>
        ) : (
          <MovieGrid movies={movies} />
        )}

        {/* ✅ Pagination only for default mode */}
        {mode === "default" && !message && <Pagination setPage={setPage} page={page} />}
      </section>
    </div>
  );
}
