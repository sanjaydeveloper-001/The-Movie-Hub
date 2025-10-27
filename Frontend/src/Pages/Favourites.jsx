import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { MovieContext } from "../context/MovieContext";
import FavouritesCard from "../Components/FavouritesCard";
import { FaHeart } from "react-icons/fa";
import { RiMovie2Fill } from "react-icons/ri";

export default function Favourites({ user }) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { favourites } = useContext(MovieContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (favourites.length === 0) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen flex flex-col items-center justify-center text-center text-white p-6">
        <div className="flex flex-col items-center space-y-4">
          <FaHeart className="text-6xl text-gray-500 drop-shadow-[0_0_10px_#ef4444]" />
          <h1 className="text-3xl font-bold text-red-500">Your Favourites List is Empty</h1>
          <p className="text-gray-400 text-lg max-w-md">
            Movies you love deserve a special place ❤️  
            Add your favorite films to keep track of what truly inspires you!
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

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <RiMovie2Fill className="text-3xl text-red-500" />
        <h1 className="text-2xl sm:text-3xl font-bold text-red-500">Your Favourites</h1>
      </div>

      {/* Favourites Grid */}
      <div
        className="
          grid gap-6 
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
          justify-items-center
        "
      >
        {favourites.map((movie) => (
          <FavouritesCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
