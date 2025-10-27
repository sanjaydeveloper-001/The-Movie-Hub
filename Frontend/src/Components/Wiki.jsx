import {FaWikipediaW} from "react-icons/fa";

function Wiki({ wiki }) {
  return (
    <div className="mt-4 bg-[#1a1a1a]/80 border border-gray-800 p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-2 text-gray-300 font-semibold">
        <FaWikipediaW className="text-blue-400" />
        <span>From Wikipedia</span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-2">
        {wiki.summary}
      </p>
      <a
        href={wiki.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 text-sm hover:underline cursor-pointer"
      >
        Read more →
      </a>
    </div>
  );
}

export default Wiki;
