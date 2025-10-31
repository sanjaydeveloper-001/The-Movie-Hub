import { FaLinkedin, FaGithub, FaCode } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 border-t border-gray-800 py-5">
      <div
        className="max-w-full mx-auto flex flex-col md:flex-row items-center justify-between 
                   gap-4 text-sm px-16"
      >
        {/* Left Section - Brand */}
        <p className="text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="text-red-500 font-semibold">The Movie Hub</span> | Made by{" "}
          <span className="text-gray-300 font-medium">Sanjay </span>
        </p>

        {/* Middle Section - Social Links */}
        <div className="flex gap-6 justify-center">
          <a
            href="https://www.linkedin.com/in/josanweb"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-all duration-200"
          >
            <FaLinkedin size={22} />
          </a>
          <a
            href="https://github.com/sanjaydeveloper-001"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-all duration-200"
          >
            <FaGithub size={22} />
          </a>
          <a
            href="https://leetcode.com/u/Sanjay_dev_001/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition-all duration-200"
          >
            <FaCode size={22} />
          </a>
        </div>

        {/* Right Section - Legal Links */}
        <div className="flex gap-4 text-xs justify-center">
          <Link
            to="/terms"
            className="hover:text-red-400 transition-colors duration-200"
          >
            Terms & Conditions
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            to="/privacy"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
