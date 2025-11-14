function getInitials(name) {
  if (!name) return "NA";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function MovieCast({ cast = [] }) {
  if (!Array.isArray(cast) || cast.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3 text-red-400">Top Cast</h2>
      <div className="overflow-x-auto pb-3 scrollbar-dark">
        <div className="flex gap-5 min-w-max">
          {cast.map((c) => (
            <div
              key={c.id}
              className="flex-shrink-0 w-28 sm:w-32 bg-[#1c1c1c]/80 p-3 rounded-xl hover:bg-[#242424] transition flex flex-col items-center cursor-pointer"
            >
              {c.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
                  alt={c.name || "Cast member"}
                  loading="lazy"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border border-gray-700"
                />
              ) : (
                <div
                  aria-label={c.name || "No photo"}
                  title={c.name || ""}
                  className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full border border-gray-700 bg-gray-700 text-gray-100 font-semibold text-lg"
                >
                  {getInitials(c.name)}
                </div>
              )}

              <h5 className="mt-2 text-sm font-semibold text-gray-100 text-center w-full">
                {c.name}
              </h5>
              <p className="text-xs text-gray-400 text-center w-full">
                {c.character ? `as ${c.character}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieCast;
