import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { languages } from "../utils/Funtions";
export default function LanguageSelector({
  selectedLanguage,
  setSelectedLanguage,
  setEditingLang,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentLang =
    languages.find((l) => l.code === selectedLanguage)?.name || "English";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-gray-200 rounded-lg
                   shadow-md focus:border-red-500 focus:ring-2 focus:ring-red-500/40 outline-none transition-all duration-200 cursor-pointer 
                   hover:bg-[#222] font-medium text-sm"
      >
        <span>{currentLang}</span>
        <FaChevronDown
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="absolute z-50 mt-2 w-full bg-[#0d0d0d] border border-gray-700 rounded-lg shadow-lg max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-dark">
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => {
                setEditingLang(true);
                setSelectedLanguage(lang.code);
                setOpen(false);
              }}
              className={`px-4 py-2 text-gray-200 cursor-pointer text-sm transition 
                          ${
                            selectedLanguage === lang.code
                              ? "bg-red-600 text-white"
                              : "hover:bg-[#222]"
                          }`}
            >
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
