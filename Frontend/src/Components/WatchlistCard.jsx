import { motion } from "framer-motion";
import { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import { useNavigate } from "react-router-dom";
import { BsBookmarkXFill } from "react-icons/bs";

export default function WatchlistCard({ movie }) {
  const { removeFromWatchlist } = useContext(MovieContext);
  const navigate = useNavigate();

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromWatchlist(movie.id);
  };

  return (
    <motion.div
      onClick={() => navigate(`/movie/${movie.id}`)}
      whileTap={{ scale: 0.97 }}
      className="group relative overflow-hidden cursor-pointer rounded-xl"
    >
      {/* Poster */}
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={movie.title}
        className="
          w-full 
          h-40 sm:h-48 md:h-80 
          object-cover 
          rounded-xl 
          group-hover:scale-105 
          shadow-md 
          hover:shadow-blue-500/10 
          transition-all 
          duration-300
        "
      />

      {/* Gradient Overlay */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-b from-black/80 via-transparent to-transparent 
          rounded-xl 
          opacity-0 
          group-hover:opacity-100 
          transition-all 
          duration-300
        "
      ></div>

      {/* Movie Title */}
      <h2
        className="
          w-full 
          text-gray-200 
          text-xs sm:text-sm md:text-md 
          font-semibold 
          text-center 
          mt-2 sm:mt-3 
          px-2 truncate
        "
      >
        {movie.title}
      </h2>

      {/* Remove Button */}
      <div
        className="
          absolute top-2 right-2 
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          transition-opacity duration-300
        "
      >
        <button
          onClick={handleRemove}
          title="Remove from Watchlist"
          className="
            p-2 rounded-full bg-black/50 backdrop-blur-sm 
            transition-all duration-300 hover:scale-110 hover:bg-black/70 
            text-blue-400 hover:text-blue-500
          "
        >
          <BsBookmarkXFill className="text-sm sm:text-md md:text-xl drop-shadow-[0_0_6px_#3b82f6]" />
        </button>
      </div>
    </motion.div>
  );
}
