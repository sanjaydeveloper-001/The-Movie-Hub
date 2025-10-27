import reditLogo from "../assets/RedditLogo.png";
import BMS from "../assets/BMS.png";

function MovieReviews({movie}) {
  return (
    <div className="mt-8 bg-[#121212]/80 border border-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-red-400 mb-3">
        External Reviews & Discussions
      </h3>
      <p className="text-gray-400 text-sm mb-5">
        Want to explore what others think? Check out these trusted platforms for
        more opinions and reviews.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
        {/* IMDb */}
        {movie.imdb_id && (
          <a
            href={`https://www.imdb.com/title/${movie.imdb_id}/reviews`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-3 bg-[#1e1e1e]/70 border border-gray-700 rounded-lg p-4 hover:bg-[#2a2a2a]/80 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
              alt="IMDb"
              className="w-20 h-10 object-contain"
            />
            <span className="text-gray-200 font-medium hover:text-yellow-400 transition">
              IMDb Reviews
            </span>
          </a>
        )}

        {/* Reddit */}
        <a
          href={`https://www.reddit.com/search/?q=${encodeURIComponent(
            movie.title + " movie reviews"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-3 bg-[#1e1e1e]/70 border border-gray-700 rounded-lg p-4 hover:bg-[#2a2a2a]/80 transition"
        >
          <img
            src={reditLogo}
            alt="Reddit"
            className="w-20 h-10 object-contain"
          />
          <span className="text-gray-200 font-medium hover:text-orange-400 transition">
            Reddit Discussions
          </span>
        </a>

        {/* BookMyShow */}
        <a
          href={`https://in.bookmyshow.com/explore/movies-${movie.title
            .replaceAll(" ", "-")
            .toLowerCase()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-3 bg-[#1e1e1e]/70 border border-gray-700 rounded-lg p-4 hover:bg-[#2a2a2a]/80 transition"
        >
          <img
            src={BMS}
            alt="BookMyShow"
            className="w-24 h-10 object-contain"
          />
          <span className="text-gray-200 font-medium hover:text-red-400 transition">
            BookMyShow Page
          </span>
        </a>
      </div>
    </div>
  );
}

export default MovieReviews;
