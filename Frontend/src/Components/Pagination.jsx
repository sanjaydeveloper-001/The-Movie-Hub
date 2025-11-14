import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, setPage, totalPages = Infinity, disabled = false }) {
  // Prev handler: use functional update to avoid stale closures
  const handlePrev = () => {
    setPage(prev => {
      const next = Math.max(1, prev - 1);
      // only write if changed
      if (next !== prev) sessionStorage.setItem("page", String(next));
      return next;
    });
  };

  // Next handler: respect totalPages
  const handleNext = () => {
    setPage(prev => {
      const next = Math.min(totalPages, prev + 1);
      if (next !== prev) sessionStorage.setItem("page", String(next));
      return next;
    });
  };

  const isPrevDisabled = disabled || page <= 1;
  const isNextDisabled = disabled || page >= totalPages;

  return (
    <div className="flex justify-center items-center gap-5 mt-10">
      {/* ⬅ Prev Button */}
      <motion.button
        whileHover={{ scale: isPrevDisabled ? 1 : 1.05 }}
        whileTap={{ scale: isPrevDisabled ? 1 : 0.95 }}
        onClick={handlePrev}
        disabled={isPrevDisabled}
        aria-disabled={isPrevDisabled}
        className={`cursor-pointer flex items-center gap-2 bg-[#0d1b2a] text-gray-300 
                   hover:bg-[#1b263b] hover:text-white hover:shadow-[0_0_12px_#3b82f6]
                   px-4 py-2 rounded-lg transition duration-200
                   ${isPrevDisabled ? "opacity-50 cursor-not-allowed hover:shadow-none" : ""}`}
      >
        <ChevronLeft size={18} />
        <span className="text-sm font-medium">Prev</span>
      </motion.button>

      {/* 📄 Page Number */}
      <span className="text-gray-400 font-semibold text-md" aria-live="polite">
        Page{" "}
        <span className="text-red-700 px-2 py-1" aria-atomic="true">
          {page}
        </span>
        {isFinite(totalPages) && (
          <span className="text-gray-400 ml-2">/ {totalPages}</span>
        )}
      </span>

      {/* ➡ Next Button */}
      <motion.button
        whileHover={{ scale: isNextDisabled ? 1 : 1.05 }}
        whileTap={{ scale: isNextDisabled ? 1 : 0.95 }}
        onClick={handleNext}
        disabled={isNextDisabled}
        aria-disabled={isNextDisabled}
        className={`cursor-pointer flex items-center gap-2 bg-[#0d1b2a] text-gray-300 
                   hover:bg-[#1b263b] hover:text-white hover:shadow-[0_0_12px_#3b82f6]
                   px-4 py-2 rounded-lg transition duration-200
                   ${isNextDisabled ? "opacity-50 cursor-not-allowed hover:shadow-none" : ""}`}
      >
        <span className="text-sm font-medium">Next</span>
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}
