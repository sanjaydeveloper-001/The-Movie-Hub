import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { MovieContext } from "../context/MovieContext";
import WatchlistCard from "../Components/WatchlistCard";
import { MdMovieFilter } from "react-icons/md";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { toast } from "react-toastify";

export default function Watchlist({ user }) {
  const { watchlist } = useContext(MovieContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
  useEffect(() => {
    if (!user) {
    navigate("/login");
    toast("Please login to view your watchlist", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    })
  }
  }, [user, navigate]);

  // Empty Watchlist UI
  if (watchlist.length === 0) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen flex flex-col items-center justify-center text-center text-white p-6">
        <div className="flex flex-col items-center space-y-4">
          <BsBookmarkHeartFill className="text-6xl text-gray-500 drop-shadow-[0_0_10px_#ef4444]" />
          <h1 className="text-3xl font-bold text-red-500">Your Watchlist is Empty</h1>
          <p className="text-gray-400 text-lg max-w-md">
            Looks like you haven’t added any movies yet.  
            Start exploring and add your favorite films to your watchlist to keep track of what you want to watch next! 🎬
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition-all duration-300"
          >
            Explore Movies
          </button>
        </div>
      </div>
    );
  }

  // Watchlist Grid UI
  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <MdMovieFilter className="text-3xl text-red-500" />
        <h1 className="text-2xl sm:text-3xl font-bold text-red-500">Your Watchlist</h1>
      </div>

      {/* Movie Cards Grid */}
      <div
        className="
          grid gap-6 
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
          justify-items-center
        "
      >
        {watchlist.map((movie) => (
          <WatchlistCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
