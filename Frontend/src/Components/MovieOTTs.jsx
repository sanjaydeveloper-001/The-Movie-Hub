import { providerSearchUrls } from "../utils/OttProviders";

function MovieOTTs({ providers, movie }) {
  return (
    <div className="flex flex-wrap justify-center lg:justify-start gap-5 mt-4">
      {providers.map((p) => (
        <div
          key={p.provider_id}
          onClick={() => {
            const providerName = p.provider_name;
            const url =
              providerSearchUrls[providerName]?.(movie.title) ||
              `https://www.google.com/search?q=${encodeURIComponent(
                movie.title + " " + providerName
              )}`;
            window.open(url, "_blank");
          }}
          className="flex flex-col items-center gap-2 bg-[#1a1a1a]/80 hover:bg-[#222] rounded-xl p-3 transition cursor-pointer"
          title={`Search on ${p.provider_name}`}
        >
          <img
            src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
            alt={p.provider_name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <p className="text-xs text-gray-300">{p.provider_name}</p>
        </div>
      ))}
    </div>
  );
}

export default MovieOTTs;
