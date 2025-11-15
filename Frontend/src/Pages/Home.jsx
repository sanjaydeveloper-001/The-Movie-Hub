import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [page, setPage] = useState(() => {
    const p = sessionStorage.getItem("page");
    return p ? Number(p) : 1;
  });
  const [totalPages, setTotalPages] = useState(Infinity);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("default");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [intro, setIntro] = useState(() => !sessionStorage.getItem("introShown"));
  const { lang } = useContext(MovieContext);

  const navigate = useNavigate();
  const gridRef = useRef(null);
  const prevPageRef = useRef(page);

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  useEffect(() => {
    sessionStorage.setItem("page", String(page));
  }, [page]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isCancelError = (err) =>
    err?.name === "CanceledError" || axios.isCancel?.(err);

  const fetchDefaultMovies = async ({ signal } = {}) => {
    try {
      setLoading(true);
      const res = await axios.get("https://api.themoviedb.org/3/discover/movie", {
        params: {
          api_key: API_KEY,
          with_original_language: lang,
          "primary_release_date.gte": `${year}-01-01`,
          "primary_release_date.lte": `${year}-${month}-${day}`,
          sort_by: "primary_release_date.desc",
          page,
        },
        signal,
      });

      setMovies(res.data.results || []);
      setTotalPages(res.data.total_pages ?? Infinity);
      setMessage(res.data.results && res.data.results.length ? "" : "No movies available.");
      setMode("default");
    } catch (err) {
      if (isCancelError(err)) return;
      setMessage("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchQuery, { signal } = {}) => {
    try {
      setSearchLoading(true);
      setLoading(true);
      const res = await axios.get("https://api.themoviedb.org/3/search/movie", {
        params: { api_key: API_KEY, query: searchQuery, page },
        signal,
      });

      const results = res.data.results || [];
      if (results.length === 0) {
        setMovies([]);
        setMessage(`No movies found for "${searchQuery}".`);
      } else {
        setMovies(results);
        setMessage("");
      }
      setTotalPages(res.data.total_pages ?? Infinity);
      setMode("search");
    } catch (err) {
      if (isCancelError(err)) return;
      setMessage("Something went wrong while searching!");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleFilter = async ({ year: fYear, rating, language, upcoming } = {}, { signal } = {}) => {
    try {
      setLoading(true);
      const params = { api_key: API_KEY, page };

      if (language) params.with_original_language = language;

      if (upcoming) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tDay = String(tomorrow.getDate()).padStart(2, "0");
        const tMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const tYear = tomorrow.getFullYear();

        params["primary_release_date.gte"] = `${tYear}-${tMonth}-${tDay}`;
        params.sort_by = "primary_release_date.asc";
      } else {
        if (fYear) params.primary_release_year = fYear;
        if (rating) params["vote_average.gte"] = rating;
      }

      const res = await axios.get("https://api.themoviedb.org/3/discover/movie", {
        params,
        signal,
      });

      const results = res.data.results || [];
      if (results.length === 0) {
        setMovies([]);
        setMessage("No movies found for the selected filter.");
      } else {
        setMovies(results);
        setMessage("");
      }
      setTotalPages(res.data.total_pages ?? Infinity);
      setMode("filter");
    } catch (err) {
      if (isCancelError(err)) return;
      setMessage("Something went wrong while filtering!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (resetMode) => {
    if (resetMode === "all") {
      sessionStorage.removeItem("movieFilters");
    }
    sessionStorage.removeItem("searchQuery");
    setMessage("");
    setPage(1);
    fetchDefaultMovies();
  };

  useEffect(() => {
    const ac = new AbortController();
    const savedFilters = (() => {
      try {
        return JSON.parse(sessionStorage.getItem("movieFilters") || "null");
      } catch {
        return null;
      }
    })();
    const savedQuery = sessionStorage.getItem("searchQuery");

    const run = async () => {
      if (savedQuery) {
        await handleSearch(savedQuery, { signal: ac.signal });
      } else if (savedFilters) {
        await handleFilter(savedFilters, { signal: ac.signal });
      } else {
        await fetchDefaultMovies({ signal: ac.signal });
      }
    };

    run().then(() => {
      if (prevPageRef.current !== page) {
        const scrollToGrid = () => {
          if (gridRef.current) {
            gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            setTimeout(() => {
              if (gridRef.current) {
                gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 0);
          }
        };
        scrollToGrid();
      }
      prevPageRef.current = page;
    });

    return () => {
      ac.abort();
    };
  }, [page, lang]);

  return (
    <>
      {intro ? (
        <Intro onFinish={() => setIntro(false)} />
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
                    lang === "ta" ? "Tamil" : lang === "hi" ? "Hindi" : lang.toUpperCase()
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
              <div ref={gridRef}>
                <MovieGrid movies={movies} />
              </div>
            )}

            {!message && !loading && (
              <Pagination
                setPage={setPage}
                page={page}
                totalPages={totalPages}
                disabled={loading}
              />
            )}
          </section>
        </div>
      )}
    </>
  );
}
