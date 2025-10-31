import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

export default function Pagination({ page, setPage }) {

  useEffect(()=>{
    const p = sessionStorage.getItem("page");
    setPage(p ? parseInt(p) : 1);
  })

  return (
    <div className="flex justify-center items-center gap-5 mt-10">
      {/* ⬅ Prev Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          let i = page;
          if(i <= 1) return;
          setPage(page -1 ); 
          sessionStorage.setItem("page", page - 1)
        }}
        className="cursor-pointer flex items-center gap-2 bg-[#0d1b2a] text-gray-300 
                   hover:bg-[#1b263b] hover:text-white hover:shadow-[0_0_12px_#3b82f6]
                   px-4 py-2 rounded-lg transition duration-200"
      >
        <ChevronLeft size={18} />
        <span className="text-sm font-medium">Prev</span>
      </motion.button>

      {/* 📄 Page Number */}
      <span className="text-gray-400 font-semibold text-md">
        Page{" "}
        <span className="text-red-700 px-2 py-1">
          {page}
        </span>
      </span>

      {/* ➡ Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {setPage(page + 1); sessionStorage.setItem("page", page + 1)}}
        className="cursor-pointer flex items-center gap-2 bg-[#0d1b2a] text-gray-300 
                   hover:bg-[#1b263b] hover:text-white hover:shadow-[0_0_12px_#3b82f6]
                   px-4 py-2 rounded-lg transition duration-200"
      >
        <span className="text-sm font-medium">Next</span>
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}
