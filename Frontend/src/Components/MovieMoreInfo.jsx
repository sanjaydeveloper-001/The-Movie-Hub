import {
  FaMusic,
  FaUserTie,
  FaBuilding,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";

function MovieMoreInfo({
  movie,
  director,
  producers,
  musicDirector,
  productionCompanies,
}) {
  // ✅ Map TMDB country codes to currency codes
  const currencyMap = {
    US: "USD",
    IN: "INR",
    GB: "GBP",
    JP: "JPY",
    KR: "KRW",
    CN: "CNY",
    FR: "EUR",
    DE: "EUR",
    CA: "CAD",
    AU: "AUD",
  };

  // ✅ Format currency according to region
  const formatCurrency = (amount, countryCode) => {
    if (!amount || amount <= 0) return "Unknown";
    const currency = currencyMap[countryCode] || "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ✅ Detect movie country
  const countryCode = movie.production_countries?.[0]?.iso_3166_1 || "US";
  const countryName = movie.production_countries?.[0]?.name || "Unknown";

  return (
    <div className="bg-[#121212]/90 border border-gray-800 p-6 rounded-xl shadow-md mt-6">
      <h3 className="text-xl font-semibold text-red-400 mb-5 text-center">
        Movie Information
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-gray-300">
        {/* Release Date */}
        <div className="flex flex-col items-center bg-[#1e1e1e]/80 p-3 rounded-lg hover:bg-[#2a2a2a] transition">
          <MdCalendarMonth className="text-blue-400 text-3xl mb-2" />
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Release Date
          </span>
          <span className="font-semibold text-white text-sm mt-1">
            {movie.release_date || "Unknown"}
          </span>
        </div>

        {/* Director */}
        {director && (
          <div className="flex flex-col items-center bg-[#1e1e1e]/80 p-3 rounded-lg hover:bg-[#2a2a2a] transition">
            <img
              src={
                director.profile_path
                  ? `https://image.tmdb.org/t/p/w200${director.profile_path}`
                  : "https://via.placeholder.com/80x80?text=No+Image"
              }
              alt={director.name}
              className="w-16 h-16 object-cover rounded-full mb-2 border border-gray-700"
            />
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Director
            </span>
            <span className="font-semibold text-white text-sm mt-1">
              {director.name}
            </span>
          </div>
        )}

        {/* Producers */}
        {producers.length > 0 && (
          <div className="flex flex-col items-center bg-[#1e1e1e]/80 p-3 rounded-lg hover:bg-[#2a2a2a] transition">
            <FaUserTie className="text-green-400 text-3xl mb-2" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Producers
            </span>
            <span className="font-semibold text-white text-center text-sm mt-1">
              {producers.map((p) => p.name).join(", ")}
            </span>
          </div>
        )}

        {/* Music Director */}
        {musicDirector && (
          <div className="flex flex-col items-center bg-[#1e1e1e]/80 p-3 rounded-lg hover:bg-[#2a2a2a] transition">
            <FaMusic className="text-pink-400 text-3xl mb-2" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Music Director
            </span>
            <span className="font-semibold text-white text-sm mt-1">
              {musicDirector.name}
            </span>
          </div>
        )}

        {/* Production Companies */}
        {productionCompanies && (
          <div className="flex flex-col items-center bg-[#1e1e1e]/80 p-3 rounded-lg hover:bg-[#2a2a2a] transition">
            <FaBuilding className="text-purple-400 text-3xl mb-2" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Production
            </span>
            <span className="font-semibold text-white text-center text-sm mt-1">
              {productionCompanies}
            </span>
          </div>
        )}

        {/* Country */}
        <div className="flex flex-col items-center bg-[#1e1e1e]/80 p-3 rounded-lg hover:bg-[#2a2a2a] transition">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Country
          </span>
          <span className="font-semibold text-white text-sm mt-1">
            {countryName}
          </span>
        </div>

        {/* Budget */}
        {movie.budget > 0 && (
          <div className="flex flex-col items-center bg-[#1e1e1e]/80 p-3 rounded-lg hover:bg-[#2a2a2a] transition">
            <FaMoneyBillWave className="text-yellow-400 text-3xl mb-2" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Aprox Budget
            </span>
            <span className="font-semibold text-white text-sm mt-1">
              {formatCurrency(movie.budget, countryCode)}
            </span>
          </div>
        )}

        {/* Revenue */}
        {movie.revenue > 0 && (
          <div className="flex flex-col items-center bg-[#1e1e1e]/80 p-3 rounded-lg hover:bg-[#2a2a2a] transition">
            <FaChartLine className="text-green-400 text-3xl mb-2" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">
              Aprox Revenue
            </span>
            <span className="font-semibold text-white text-sm mt-1">
              {formatCurrency(movie.revenue, countryCode)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieMoreInfo;
