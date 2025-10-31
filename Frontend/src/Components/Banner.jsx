import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import genreIds from "../utils/generIds";

const API_KEY = import.meta.env.VITE_TMDB_API;

export default function Banner({lang}) {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  // ✅ Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Fetch Movies
  useEffect(() => {
    const fetchMovies = async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=${lang}&primary_release_date.gte=${year}-01-01&primary_release_date.lte=${year}-${month}-${day}&sort_by=primary_release_date.desc`
      );
      setMovies(res.data.results.slice(0, 5));
    };
    fetchMovies();
  }, []);

  // ✅ Auto Slide
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;
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
          // ✅ Add whileTap animation only for small screens
          whileTap={isMobile ? { scale: 0.97, opacity: 0.9 } : {}}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

          {/* Bottom-left content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-10 max-w-3xl text-white">
            {/* Movie Title */}
            <h1 className="font-extrabold mb-3 drop-shadow-xl leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            {/* Overview */}
            <p className="text-gray-300 mb-5 leading-relaxed line-clamp-3 text-sm sm:text-base md:text-lg max-w-2xl">
              {movie.overview}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genre_ids.map((genre, i) => (
                <span
                  key={i}
                  className="bg-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20"
                >
                  {genreIds[genre]}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots (Indicators) */}
      <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 gap-2 z-20 hidden sm:flex">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-[#C00000] scale-125" : "bg-gray-400/60"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
