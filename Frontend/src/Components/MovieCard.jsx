import { motion } from "framer-motion";
import { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs";

export default function MovieCard({ movie }) {
  const {
    addToWatchlist,
    addToFavourites,
    removeFromWatchlist,
    removeFromFavourites,
    watchlist,
    favourites,
  } = useContext(MovieContext);

  const navigate = useNavigate();

  const isInWatchlist = watchlist.some((m) => m.id === movie.id);
  const isInFavourites = favourites.some((m) => m.id === movie.id);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (isInWatchlist) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  };

  const handleFavourites = (e) => {
    e.stopPropagation();
    if (isInFavourites) removeFromFavourites(movie.id);
    else addToFavourites(movie);
  };

  return (
    <>
      {/* Main Card */}
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
            hover:shadow-red-500/10 
            transition-all 
            duration-300
          "
        />

        {/* Gradient Overlay */}
        <div
          className="
            absolute inset-0 
            bg-gradient-to-b from-black/90 via-transparent to-transparent 
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

        {/* Top Action Icons */}
        <div
          className="
            absolute top-2 left-2 right-2 
            flex justify-between items-center
            opacity-100 md:opacity-0 md:group-hover:opacity-100
            transition-opacity duration-300
          "
        >
          {/* Watchlist Icon */}
          <button
            onClick={handleWatchlist}
            title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            className={`
              p-2 rounded-full bg-black/50 backdrop-blur-sm 
              transition-all duration-300 hover:scale-110 hover:bg-black/70 
              ${isInWatchlist ? "text-blue-400" : "text-gray-300 hover:text-blue-400"}
            `}
          >
            {isInWatchlist ? (
              <BsBookmarkFill className="text-sm sm:text-md md:text-xl drop-shadow-[0_0_6px_#3b82f6]" />
            ) : (
              <BsBookmarkPlus className="text-sm sm:text-md md:text-xl text-[#3b82f6]" />
            )}
          </button>

          {/* Favourite Icon */}
          <button
            onClick={handleFavourites}
            title={isInFavourites ? "Remove from Favourites" : "Add to Favourites"}
            className={`
              p-2 rounded-full bg-black/50 backdrop-blur-sm 
              transition-all duration-300 hover:scale-110 hover:bg-black/70 
              ${isInFavourites ? "text-red-500" : "text-gray-300 hover:text-red-500"}
            `}
          >
            {isInFavourites ? (
              <FaHeart className="text-sm sm:text-md md:text-xl drop-shadow-[0_0_6px_#ef4444]" />
            ) : (
              <FaRegHeart className="text-sm sm:text-md md:text-xl text-[#ef4444]" />
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}
