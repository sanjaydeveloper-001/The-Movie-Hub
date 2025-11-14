import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import genreIds from "../utils/generIds";

const API_KEY = import.meta.env.VITE_TMDB_API;

export default function Banner({ lang }) {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null); // for friendly UI/error handling

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Movies (ONLY released & with backdrop)
  useEffect(() => {
    // guard: ensure API key exists
    if (!API_KEY) {
      console.error(
        "TMDB API key missing. Make sure VITE_TMDB_API is set in your .env and restart Vite."
      );
      setError("API key missing. Check console for details.");
      return;
    }

    let mounted = true;
    const ac = new AbortController();

    const fetchMovies = async () => {
      try {
        setError(null);

        const res = await axios.get("https://api.themoviedb.org/3/discover/movie", {
          params: {
            api_key: API_KEY,
            with_original_language: lang,
            // ensure release is today or earlier
            "primary_release_date.lte": `${year}-${month}-${day}`,
            // only theatrical releases (use 2|3 for digital+theatrical as needed)
            with_release_type: 3,
            sort_by: "primary_release_date.desc",
            page: 1,
          },
          signal: ac.signal,
        });

        if (!mounted) return;

        if (!Array.isArray(res.data?.results)) {
          console.warn("Unexpected response from TMDB:", res.data);
          setError("Unexpected API response.");
          return;
        }

        // filter for backdrops and take first 5 valid
        const validMovies = res.data.results.filter((m) => m.backdrop_path).slice(0, 5);

        if (validMovies.length === 0) {
          setError("No released movies with backdrops found.");
          setMovies([]);
          return;
        }

        setMovies(validMovies);
        setIndex(0);
      } catch (err) {
        if (err.name === "CanceledError") {
          // aborted — ignore
          return;
        }

        // axios errors include response
        if (err?.response?.status === 401) {
          console.error("TMDB 401 — check your API key and environment variables.", err);
          setError("Unauthorized (401). Check your TMDB API key.");
        } else {
          console.error("Failed fetching banner movies:", err);
          setError("Failed to load movies. See console for details.");
        }

        setMovies([]);
      }
    };

    fetchMovies();

    return () => {
      mounted = false;
      ac.abort();
    };
  }, [lang, year, month, day]);

  // Auto Slide
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies]);

  // If there's an error, you can show a small placeholder or return null.
  if (error) {
    return (
      <div className="relative h-[40vh] md:h-[50vh] bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-2">{error}</p>
          <p className="text-xs text-gray-500">Check console for more information.</p>
        </div>
      </div>
    );
  }

  if (!movies.length) {
    // still loading or no movies, show minimal placeholder to avoid black screen
    return (
      <div className="relative h-[40vh] md:h-[50vh] bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading featured movies...</p>
      </div>
    );
  }

  const movie = movies[index];

  return (
    <div className="relative h-[70vh] md:h-[80vh] bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          className="absolute inset-0 bg-cover bg-center flex items-end"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileTap={isMobile ? { scale: 0.97, opacity: 0.9 } : {}}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-10 max-w-3xl text-white">
            <h1 className="font-extrabold mb-3 drop-shadow-xl leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            <p className="text-gray-300 mb-5 leading-relaxed line-clamp-3 text-sm sm:text-base md:text-lg max-w-2xl">
              {movie.overview}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {Array.isArray(movie.genre_ids) &&
                movie.genre_ids.map((genre, i) => (
                  <span
                    key={i}
                    className="bg-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20"
                  >
                    {genreIds[genre] ?? "—"}
                  </span>
                ))}
            </div>

            {/* View Details Button */}
            <Link
              to={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 
                bg-gradient-to-r from-[#7A0000] to-[#A00000]
                hover:from-[#A00000] hover:to-[#C00000]
                text-white font-semibold 
                px-5 py-2 sm:py-3 rounded-full
                transition duration-300 shadow-md hover:shadow-[0_0_15px_#FF0000]
                text-sm sm:text-base"
            >
              <span>View Details</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 gap-2 z-20 hidden sm:flex">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-[#C00000] scale-125" : "bg-gray-400/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
