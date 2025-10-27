import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { MovieContext } from "../context/MovieContext";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaRegStickyNote, FaStickyNote } from "react-icons/fa";

export default function FavouritesCard({ movie }) {
  const { removeFromFavourites, updateFavouriteNote } = useContext(MovieContext);
  const navigate = useNavigate();
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState(movie.userNote || "");

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromFavourites(movie.id);
  };

  const handleSaveNote = (e) => {
    e.stopPropagation();
    updateFavouriteNote(movie.id, note);
    setShowNote(false);
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
          w-full h-40 sm:h-48 md:h-80 
          object-cover rounded-xl 
          group-hover:scale-105 shadow-md 
          hover:shadow-red-500/10 
          transition-all duration-300
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-b from-black/80 via-transparent to-transparent 
          rounded-xl opacity-0 
          group-hover:opacity-100 
          transition-all duration-300
        "
      ></div>

      {/* Movie Title */}
      <h2
        className="
          w-full text-gray-200 
          text-xs sm:text-sm md:text-md 
          font-semibold text-center 
          mt-2 sm:mt-3 px-2 truncate
        "
      >
        {movie.title}
      </h2>

      {/* Top Buttons */}
      <div
        className="
          absolute top-2 left-2 right-2 
          flex justify-between items-center
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          transition-opacity duration-300
        "
      >
        {/* Note Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowNote(true);
          }}
          title="Add or Edit Note"
          className="
            p-2 rounded-full bg-black/50 backdrop-blur-sm 
            transition-all duration-300 hover:scale-110 hover:bg-black/70 
            text-yellow-400 hover:text-yellow-500
          "
        >
          {movie.userNote ? (
            <FaStickyNote className="text-sm sm:text-md md:text-xl drop-shadow-[0_0_6px_#facc15]" />
          ) : (
            <FaRegStickyNote className="text-sm sm:text-md md:text-xl text-[#facc15]" />
          )}
        </button>

        {/* Delete Button */}
        <button
          onClick={handleRemove}
          title="Remove from Favourites"
          className="
            p-2 rounded-full bg-black/50 backdrop-blur-sm 
            transition-all duration-300 hover:scale-110 hover:bg-black/70 
            text-red-500 hover:text-red-600
          "
        >
          <FaTrashAlt className="text-sm sm:text-md md:text-xl drop-shadow-[0_0_6px_#ef4444]" />
        </button>
      </div>

      {/* Note Modal */}
      {showNote && (
        <div
  onClick={(e) => e.stopPropagation()}
  className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-800/50 flex flex-col items-center justify-center p-6 rounded-2xl shadow-2xl border border-gray-700"
>
  <textarea
    value={note}
    onChange={(e) => setNote(e.target.value)}
    placeholder="💭 Write your thoughts about this movie..."
    className="w-full h-32 p-3 rounded-lg bg-gray-800/80 text-gray-100 text-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
  />
  <div className="flex gap-4 mt-4">
    <button
      onClick={handleSaveNote}
      className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-lg text-white text-sm font-semibold shadow-md hover:shadow-red-500/30 transition-all duration-200"
    >
      Save
    </button>
    <button
      onClick={() => setShowNote(false)}
      className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 text-sm font-semibold shadow-md hover:shadow-gray-500/20 transition-all duration-200"
    >
      Cancel
    </button>
  </div>
</div>

      )}
    </motion.div>
  );
}
