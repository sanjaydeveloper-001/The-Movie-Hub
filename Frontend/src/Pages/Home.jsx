import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Banner from "../Components/Banner";
import MovieGrid from "../Components/MovieGrid";
import FilterBar from "../Components/FilterBar";
import Pagination from "../Components/Pagination";
import Intro from "../Components/Intro";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";

const API_KEY = import.meta.env.VITE_TMDB_API;

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("default");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [intro, setIntro] = useState(() => !sessionStorage.getItem("introShown"));
  const [query, setQuery] = useState("");
  const { lang, setLang } = useContext(MovieContext);
  const navigate = useNavigate();

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (query) navigate(`/${query}`);
  }, [query, navigate]);

  const fetchDefaultMovies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=${lang}&primary_release_date.gte=${year}-01-01&primary_release_date.lte=${year}-${month}-${day}&page=${page}`
      );
      setMovies(res.data.results);
      setMessage(res.data.results.length ? "" : "No movies available.");
      setMode("default");
    } catch {
      setMessage("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setSearchLoading(true);
      setLoading(true);
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
    } catch {
      setMessage("Something went wrong while searching!");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleFilter = async ({ year, rating, language }) => {
    try {
      setLoading(true);
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
    } catch {
      setMessage("Something went wrong while filtering!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (mode) => {
    if (mode === "all") {
      localStorage.removeItem("movieFilters");
    }
    localStorage.removeItem("searchQuery");
    setMessage("");
    fetchDefaultMovies();
  };

  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("movieFilters"));
    const savedQuery = sessionStorage.getItem("searchQuery");

    if (savedQuery) {
      handleSearch(savedQuery);
    } else if (savedFilters) {
      handleFilter(savedFilters);
    } else {
      fetchDefaultMovies();
    }
  }, [page, setLang]);

  return (
    <>
      {intro ? (
        <Intro
          onFinish={() => setIntro(false)}
          setQuery={setQuery}
        />
      ) : (
        <div className="bg-[#0f0f0f] min-h-screen text-white">
          <Banner lang={lang} />
          <section className="mx-auto py-6 px-6 md:px-10">
            <FilterBar
              onSearch={handleSearch}
              onFilter={handleFilter}
              onReset={handleReset}
              searchLoading={searchLoading}
            />
            <h2 className="text-2xl font-semibold mb-4 text-red-500">
              🎬{" "}
              {mode === "default"
                ? `Popular ${
                    lang === "ta"
                      ? "Tamil"
                      : lang === "hi"
                      ? "Hindi"
                      :
                      lang.toUpperCase()
                  } Movies`
                : mode === "filter"
                ? "Filtered Movies"
                : "Search Results"}
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400 text-lg">Loading movies...</p>
              </div>
            ) : message ? (
              <div className="text-center py-20 text-gray-400 text-lg">
                {message}
                <div className="mt-4">
                  <button
                    onClick={() => handleReset("all")}
                    className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg text-white font-medium transition"
                  >
                     Back
                  </button>
                </div>
              </div>
            ) : (
              <MovieGrid movies={movies} />
            )}

            {!message && !loading && (
              <Pagination setPage={setPage} page={page} />
            )}
          </section>
        </div>
      )}
    </>
  );
}
