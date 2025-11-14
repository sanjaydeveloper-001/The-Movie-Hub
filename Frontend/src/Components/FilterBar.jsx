import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import LanguageSelector from "../Components/langSelection"; // <-- added

export default function FilterBar({ onSearch, onFilter, onReset, searchLoading }) {
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [language, setLanguage] = useState("ta");
  const [upcoming, setUpcoming] = useState(false);
  const [message, setMessage] = useState("");

  // Holds filters that were present before user turned on "upcoming"
  const [savedFiltersOnUpcoming, setSavedFiltersOnUpcoming] = useState(null);

  // For LanguageSelector save/cancel flow
  const [editingLang, setEditingLang] = useState(false);
  const [prevLanguage, setPrevLanguage] = useState(language);

  useEffect(() => {
    const savedFilters = (() => {
      try {
        return JSON.parse(sessionStorage.getItem("movieFilters") || "null");
      } catch {
        return null;
      }
    })();
    const savedQuery = sessionStorage.getItem("searchQuery");

    if (savedFilters) {
      // If saved filters had upcoming=true, restore saved values to savedFiltersOnUpcoming
      if (savedFilters.upcoming) {
        setSavedFiltersOnUpcoming({
          year: savedFilters.year || "",
          rating: savedFilters.rating || "",
          language: savedFilters.language || "ta",
        });
        // Keep language (user likely expects upcoming to use selected language)
        setLanguage(savedFilters.language || "ta");
        // Clear year/rating visually (they should not be editable while upcoming is active)
        setYear("");
        setRating("");
        setUpcoming(true);
      } else {
        // Normal restore
        setYear(savedFilters.year || "");
        setRating(savedFilters.rating || "");
        setLanguage(savedFilters.language || "ta");
        setUpcoming(Boolean(savedFilters.upcoming));
      }
    }

    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  // Keep prevLanguage in sync so cancel works properly when opening selector
  useEffect(() => {
    setPrevLanguage(language);
  }, []); // only on mount; we update prevLanguage when user clicks to edit below

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 3) {
      setMessage("Type at least 3 char to search");
      sessionStorage.removeItem("searchQuery");
      return;
    }
    setMessage("");
    sessionStorage.setItem("searchQuery", query.trim());
    await onSearch(query.trim());
  };

  const handleClearSearch = () => {
    setQuery("");
    sessionStorage.removeItem("searchQuery");
    onReset();
  };

  // Toggle upcoming with save/restore behavior
  const toggleUpcoming = () => {
    if (!upcoming) {
      // Turning upcoming ON -> save current filters and clear year/rating
      setSavedFiltersOnUpcoming({ year: year || "", rating: rating || "", language: language || "ta" });
      setYear("");
      setRating("");
      setUpcoming(true);
    } else {
      // Turning upcoming OFF -> restore saved filters (if present)
      if (savedFiltersOnUpcoming) {
        setYear(savedFiltersOnUpcoming.year || "");
        setRating(savedFiltersOnUpcoming.rating || "");
        setLanguage(savedFiltersOnUpcoming.language || "ta");
      }
      setSavedFiltersOnUpcoming(null);
      setUpcoming(false);
    }
  };

  const handleApply = () => {
    // If upcoming is ON we intentionally send empty year/rating (they are disabled)
    const filters = {
      year: upcoming ? "" : year,
      rating: upcoming ? "" : rating,
      language,
      upcoming,
    };

    // Save to sessionStorage
    sessionStorage.setItem("movieFilters", JSON.stringify(filters));

    // upcoming is separate from search, so clear searchQuery when applying filters
    sessionStorage.removeItem("searchQuery");
    onFilter(filters);
  };

  const handleReset = () => {
    sessionStorage.removeItem("movieFilters");
    sessionStorage.removeItem("searchQuery");
    setQuery("");
    setYear("");
    setRating("");
    setLanguage("ta");
    setUpcoming(false);
    setSavedFiltersOnUpcoming(null);
    setShowFilters(false);
    setEditingLang(false);
    setPrevLanguage("ta");
    onReset();
  };

  // handle saving language selection from the inline language editor
  const handleSaveLanguage = () => {
    setEditingLang(false);
    setPrevLanguage(language);
  };

  // cancel: restore previous selection
  const handleCancelLanguage = () => {
    setLanguage(prevLanguage || "ta");
    setEditingLang(false);
  };

  // small helper classes for disabled state
  const disabledInputClasses = "cursor-not-allowed opacity-50 pointer-events-none";

  return (
    <div className="bg-[#121212] p-4 rounded-xl shadow-lg border border-gray-800 mb-6">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder={`${message || "🔍 Search movies..."}`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setMessage("");
            }}
            className={`w-full px-4 py-2 rounded-lg bg-[#1c1c1c] ${message ? "text-rose-500" : "text-white"}
                         focus:outline-none focus:ring-2 focus:ring-[#A00000]`}
          />
          {query && (
            <FaTimes
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500 cursor-pointer transition"
              onClick={handleClearSearch}
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex w-full sm:w-max gap-2 justify-between sm:justify-start">
          <button
            type="submit"
            disabled={searchLoading}
            className="cursor-pointer bg-gradient-to-r from-[#7A0000] to-[#A00000]
                        hover:from-[#A00000] hover:to-[#C00000]
                        shadow-md hover:shadow-[0_0_10px_#FF0000]
                        px-5 py-2 rounded-lg text-white font-medium transition flex items-center gap-2 disabled:opacity-60"
          >
            <FaSearch /> Search
          </button>

          <button
            type="button"
            onClick={() => setShowFilters((p) => !p)}
            className="cursor-pointer bg-gradient-to-r from-[#232323] to-[#2E2E2E]
                        hover:from-[#383838] hover:to-[#444444]
                        shadow-sm hover:shadow-[0_0_8px_#555]
                        px-5 py-2 rounded-lg text-gray-200 font-medium transition"
          >
            {showFilters ? "Close Filters" : "Filter"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer bg-gradient-to-r from-[#2E2E2E] to-[#3A3A3A]
                        hover:from-[#444] hover:to-[#555]
                        shadow-sm hover:shadow-[0_0_8px_#555]
                        px-5 py-2 rounded-lg text-gray-300 font-medium transition"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Filter section (improved layout + styled upcoming toggle) */}
      {showFilters && (
        <div className="mt-5 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 animate-fadeIn items-end">
          {/* Year */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Release Year</label>
            <input
              type="number"
              placeholder="e.g. 2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={upcoming}
              className={`w-full px-3 py-2 rounded-lg bg-[#1c1c1c] text-white
                         focus:outline-none focus:ring-2 focus:ring-[#A00000]
                         appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                         ${upcoming ? disabledInputClasses : ""}`}
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Minimum Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 7.5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              disabled={upcoming}
              className={`w-full px-3 py-2 rounded-lg bg-[#1c1c1c] text-white
                         focus:outline-none focus:ring-2 focus:ring-[#A00000]
                         appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                         ${upcoming ? disabledInputClasses : ""}`}
            />
          </div>

          {/* Language - swapped select for LanguageSelector component */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Language</label>

            {/* Language selector component */}
            <div className="inline-block w-full">
              <div
                onClick={() => {
                  // keep previous language for cancel if user opens editor
                  setPrevLanguage(language);
                }}
              >
                <LanguageSelector
                  selectedLanguage={language}
                  setSelectedLanguage={setLanguage}
                  setEditingLang={setEditingLang}
                />
              </div>
            </div>
          </div>

          {/* Upcoming toggle & Apply (aligned) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between w-full">
              <div>
                <label className="block text-sm text-gray-300">Upcoming movies</label>
                <p className="text-xs text-gray-500">In the selected language</p>
              </div>

              {/* Custom toggle styled to match theme */}
              <button
                type="button"
                onClick={toggleUpcoming}
                aria-pressed={upcoming}
                className={`relative w-14 h-8 rounded-full p-1 transition-transform focus:outline-none focus:ring-2 focus:ring-[#A00000]
                           ${upcoming ? "bg-gradient-to-r from-[#7A0000] to-[#A00000]" : "bg-[#2a2a2a]"}`}
              >
                <span
                  className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform
                              ${upcoming ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>

            <button
              onClick={handleApply}
              className="cursor-pointer w-full bg-gradient-to-r from-[#7A0000] to-[#A00000]
                         hover:from-[#A00000] hover:to-[#C00000]
                         hover:shadow-[0_0_12px_#FF0000]
                         py-2 rounded-lg text-white font-semibold transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
