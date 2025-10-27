import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import { motion } from "framer-motion";
import {
  FaStar,
  FaClock,
  FaGlobe,
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaPlayCircle,
} from "react-icons/fa";
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs";
import { MdCalendarMonth } from "react-icons/md";
import { getLanguageName, formatRuntime } from "../utils/Funtions";

import MovieReviews from "../Components/MovieReviews";
import MovieMoreInfo from "../Components/MovieMoreInfo";
import MovieCast from "../Components/MovieCast";
import MovieOTTs from "../Components/MovieOTTs";
import Wiki from "../Components/Wiki";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    addToWatchlist,
    addToFavourites,
    removeFromWatchlist,
    removeFromFavourites,
    watchlist,
    favourites,
  } = useContext(MovieContext);

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [providers, setProviders] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [wiki, setWiki] = useState(null);

  const API_KEY = import.meta.env.VITE_TMDB_API;

  const isInWatchlist = watchlist.some((m) => m.id === Number(id));
  const isInFavourites = favourites.some((m) => m.id === Number(id));

  const handleWatchlist = () => {
    if (isInWatchlist) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  };

  const handleFavourites = () => {
    if (isInFavourites) removeFromFavourites(movie.id);
    else addToFavourites(movie);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        // 🎬 Movie Details
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`
        );
        const movieData = await movieRes.json();
        setMovie(movieData);

        // 🎥 Trailer
        const officialTrailer = movieData.videos?.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (officialTrailer)
          setTrailer(`https://www.youtube.com/watch?v=${officialTrailer.key}`);
        else
          setTrailer(
            `https://www.youtube.com/results?search_query=${encodeURIComponent(
              movieData.title + " official trailer"
            )}`
          );

        // 👥 Cast & Crew
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast.slice(0, 15));
        setCrew(creditsData.crew);

        // 🎞️ OTT Providers
        const providerRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
        );
        const providerData = await providerRes.json();
        const indiaProviders = providerData.results?.IN?.flatrate || [];
        setProviders(indiaProviders);

        // 📖 Wikipedia Summary
        const wikiRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            movieData.title
          )}`
        );
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          if (wikiData.extract) {
            setWiki({
              summary: wikiData.extract,
              url: wikiData.content_urls?.desktop?.page,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!movie)
    return (
      <p className="text-center mt-20 text-gray-400 text-lg">Loading...</p>
    );

  // 🎬 Extract crew info
  const director = crew.find((p) => p.job === "Director");
  const producers = crew.filter((p) => p.job === "Producer");
  const musicDirector = crew.find((p) => p.job === "Original Music Composer");
  const productionCompanies = movie.production_companies
    ?.map((c) => c.name)
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 blur-lg"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 to-black/95"></div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 lg:left-5 right-5 lg:right-auto z-20 bg-gray-800/70 hover:bg-gray-700 text-white p-3 rounded-full transition cursor-pointer"
      >
        <FaArrowLeft className="sm:text-lg text-sm" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 py-10 flex flex-col gap-12">
        {/* Poster + Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Poster */}
          <div className="flex justify-center md:justify-start w-full sm:w-4/5 md:w-2/5 lg:w-1/3 px-4">
            <div className="w-[70%] sm:w-[60%] md:w-full max-w-[350px] aspect-[2/3]">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-full rounded-2xl shadow-2xl border border-gray-800 object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-red-500">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-gray-400 italic text-base sm:text-lg">
                “{movie.tagline}”
              </p>
            )}

            {/* Details */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-gray-300 text-sm sm:text-base">
              <p className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />{" "}
                {movie.vote_average?.toFixed(1)} / 10
              </p>
              <p className="flex items-center gap-2">
                <MdCalendarMonth className="text-blue-400" />{" "}
                {movie.release_date}
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-green-400" />{" "}
                {formatRuntime(movie.runtime)}
              </p>
              <p className="flex items-center gap-2">
                <FaGlobe className="text-purple-400" />{" "}
                {getLanguageName(movie.original_language)}
              </p>
            </div>

            <p className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto lg:mx-0">
              {movie.overview}
            </p>

            {/* Wikipedia */}
            {wiki && (
              <Wiki wiki={wiki} />
            )}

            {/* Genres */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-3">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-[#1c1c1c]/80 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <button
                onClick={() => window.open(trailer, "_blank")}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-medium shadow-md hover:scale-105 transition"
              >
                <FaPlayCircle className="text-lg" />
                <span className="text-sm">Watch Trailer</span>
              </button>

              {/* Watchlist */}
              <button
                onClick={handleWatchlist}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition cursor-pointer
                  ${
                    isInWatchlist
                      ? "bg-gradient-to-r from-blue-700/60 to-blue-500 text-white"
                      : "bg-[#1b1b1b] text-blue-400 border border-blue-700/40 hover:bg-blue-900/20"
                  }`}
              >
                {isInWatchlist ? (
                  <BsBookmarkFill className="text-lg" />
                ) : (
                  <BsBookmarkPlus className="text-lg" />
                )}
                <span className="text-xs">
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </span>
              </button>

              {/* Favourite */}
              <button
                onClick={handleFavourites}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition cursor-pointer
                  ${
                    isInFavourites
                      ? "bg-gradient-to-r from-pink-700/60 to-red-600 text-white"
                      : "bg-[#1b1b1b] text-red-400 border border-red-700/40 hover:bg-red-900/20"
                  }`}
              >
                {isInFavourites ? (
                  <FaHeart className="text-lg" />
                ) : (
                  <FaRegHeart className="text-lg" />
                )}
                <span className="text-xs">
                  {isInFavourites ? "In Favourites" : "Add to Favourite"}
                </span>
              </button>
            </div>

            {/* OTT Providers */}
            <MovieOTTs providers={providers} />
          </div>
        </div>

        {/* Cast Section */}
        <MovieCast cast={cast} />

        {/* Movie Info Section */}
        <MovieMoreInfo 
          movie={movie}
          director={director}
          producers={producers}
          musicDirector={musicDirector}
          productionCompanies={productionCompanies}
        />

        {/* 🌐 External Reviews Section */}
        <MovieReviews movie={movie} />
      </div>
    </motion.div>
  );
}
