import {
  FaMusic,
  FaUserTie,
  FaBuilding,
  FaMoneyBillWave,
  FaChartLine,
  FaUser,
} from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";

function RoleIcon({ role }) {
  switch (role) {
    case "director":
      return <FaUserTie className="text-2xl" />;
    case "producer":
      return <FaUserTie className="text-2xl" />;
    case "music":
      return <FaMusic className="text-2xl" />;
    case "company":
      return <FaBuilding className="text-2xl" />;
    default:
      return <FaUser className="text-2xl" />;
  }
}

function PersonAvatar({ person, role = "person", sizeClass = "w-16 h-16" }) {
  if (person?.profile_path) {
    return (
      <img
        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
        alt={person?.name || "Person"}
        loading="lazy"
        className={`${sizeClass} object-cover rounded-full mb-2 border border-gray-700`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full border border-gray-700 bg-gray-700 text-gray-100 mb-2`}
      title={person?.name || ""}
    >
      <RoleIcon role={role} />
    </div>
  );
}

export default function MovieMoreInfo({
  movie,
  director,
  producers = [],
  musicDirector,
  productionCompanies,
}) {
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

  const formatCurrency = (amount, countryCode) => {
    if (!amount || amount <= 0) return "Unknown";
    const currency = currencyMap[countryCode] || "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const countryCode = movie.production_countries?.[0]?.iso_3166_1 || "US";
  const countryName = movie.production_countries?.[0]?.name || "Unknown";

  const labelClass = "text-gray-400 text-xs uppercase tracking-wide";
  const valueClass = "font-semibold text-white text-sm mt-1";

  const productionCompaniesDisplay = Array.isArray(productionCompanies)
    ? productionCompanies.map((c) => (typeof c === "string" ? c : c.name)).join(", ")
    : productionCompanies;

  return (
    <div className="bg-[#121212]/90 border border-gray-800 p-6 rounded-xl shadow-md mt-6">
      <h3 className="text-xl font-semibold text-red-400 mb-5 text-center">
        Movie Information
      </h3>

      {/* IMPORTANT: removed justify-items-center to allow full width boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-gray-300">

        {/* FULL WIDTH RELEASE DATE */}
        <div className="w-full flex flex-col items-center justify-center bg-[#1e1e1e]/80 p-4 rounded-lg min-h-[150px] text-center">
          <MdCalendarMonth className="text-blue-400 text-3xl mb-2" />
          <span className={labelClass}>Release Date</span>
          <span className={valueClass}>{movie.release_date || "Unknown"}</span>
        </div>

        {/* FULL WIDTH DIRECTOR */}
        {director && (
          <div className="w-full flex flex-col items-center justify-center bg-[#1e1e1e]/80 p-4 rounded-lg min-h-[150px] text-center">
            <PersonAvatar person={director} role="director" />
            <span className={labelClass}>Director</span>
            <span className={valueClass}>{director.name}</span>
          </div>
        )}

        {/* FULL WIDTH PRODUCERS */}
        {producers.length > 0 && (
          <div className="w-full flex flex-col items-center justify-center bg-[#1e1e1e]/80 p-4 rounded-lg min-h-[150px] text-center">
            <PersonAvatar person={producers[0]} role="producer" />
            <span className={labelClass}>Producer</span>
            <span className={valueClass}>{producers[0].name}</span>

            {producers.length > 1 && (
              <div className="mt-3 text-center">
                <span className="text-gray-400 text-xs uppercase">Other Producers:</span>
                <p className="text-sm text-gray-300 mt-1">
                  {producers.slice(1).map((p) => p.name).join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* FULL WIDTH MUSIC DIRECTOR */}
        {musicDirector && (
          <div className="w-full flex flex-col items-center justify-center bg-[#1e1e1e]/80 p-4 rounded-lg min-h-[150px] text-center">
            <PersonAvatar person={musicDirector} role="music" />
            <span className={labelClass}>Music Director</span>
            <span className={valueClass}>{musicDirector.name}</span>
          </div>
        )}

        {/* FULL WIDTH PRODUCTION */}
        {productionCompaniesDisplay && (
          <div className="w-full flex flex-col items-center justify-center bg-[#1e1e1e]/80 p-4 rounded-lg min-h-[150px] text-center">
            <PersonAvatar person={{ name: productionCompaniesDisplay }} role="company" />
            <span className={labelClass}>Production</span>
            <span className={valueClass}>{productionCompaniesDisplay}</span>
          </div>
        )}

        {/* FULL WIDTH COUNTRY */}
        <div className="w-full flex flex-col items-center justify-center bg-[#1e1e1e]/80 p-4 rounded-lg min-h-[150px] text-center">
          <span className={labelClass}>Country</span>
          <span className={valueClass}>{countryName}</span>
        </div>

        {/* FULL WIDTH BUDGET */}
        {movie.budget > 0 && (
          <div className="w-full flex flex-col items-center justify-center bg-[#1e1e1e]/80 p-4 rounded-lg min-h-[150px] text-center">
            <FaMoneyBillWave className="text-yellow-400 text-3xl mb-2" />
            <span className={labelClass}>Approx Budget</span>
            <span className={valueClass}>{formatCurrency(movie.budget, countryCode)}</span>
          </div>
        )}

        {/* FULL WIDTH REVENUE */}
        {movie.revenue > 0 && (
          <div className="w-full flex flex-col items-center justify-center bg-[#1e1e1e]/80 p-4 rounded-lg min-h-[150px] text-center">
            <FaChartLine className="text-green-400 text-3xl mb-2" />
            <span className={labelClass}>Approx Revenue</span>
            <span className={valueClass}>{formatCurrency(movie.revenue, countryCode)}</span>
          </div>
        )}

      </div>
    </div>
  );
}
