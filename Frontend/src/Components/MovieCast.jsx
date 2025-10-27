import React from 'react'

function MovieCast({cast}) {
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
                  <img
                    src={
                      c.profile_path
                        ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
                        : "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={c.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border border-gray-700"
                  />
                  <h5 className="mt-2 text-sm font-semibold text-gray-100 text-center truncate w-full">
                    {c.name}
                  </h5>
                  <p className="text-xs text-gray-400 text-center truncate w-full">
                    {c.character ? `as ${c.character}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default MovieCast