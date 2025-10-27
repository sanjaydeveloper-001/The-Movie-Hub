import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 px-6 py-12 flex flex-col justify-between">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-red-500 mb-6 text-center">
          Terms & Conditions
        </h1>
        <p className="text-gray-400 mb-6 text-sm text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-5 text-gray-400 leading-relaxed">
          <p>
            Welcome to{" "}
            <span className="text-white font-medium">The Movie Hub</span>!  
            By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions.  
            Please read them carefully before using the service.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            1. Use of the Platform
          </h2>
          <p>
            The Movie Hub provides users with movie-related data such as cast information, 
            trailers, reviews, and ratings. You agree to use our website only for personal, 
            non-commercial purposes and in accordance with applicable laws.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            2. Intellectual Property
          </h2>
          <p>
            All logos, designs, text, and content displayed on The Movie Hub are the property 
            of The Movie Hub or their respective licensors. You may not reproduce, modify, 
            or distribute any content without prior written permission.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            3. Third-Party Links
          </h2>
          <p>
            Our platform may include links to third-party sites such as TMDB or IMDb for 
            movie details. We are not responsible for the content, accuracy, or privacy 
            practices of these external websites.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            4. Limitation of Liability
          </h2>
          <p>
            The Movie Hub is provided “as is” without any warranties of accuracy, 
            reliability, or availability. We are not liable for any direct or indirect 
            damages arising from your use of the platform or reliance on displayed information.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            5. Modifications to Terms
          </h2>
          <p>
            We may revise these Terms periodically to improve our services or comply with 
            regulations. Updates will be reflected on this page with a revised date, and 
            continued use of the site constitutes acceptance of those changes.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            6. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about these Terms, please reach out to us at{" "}
            <a
              href="mailto:helpcinehub@gmail.com"
              className="text-red-400 hover:underline"
            >
              helpcinehub@gmail.com
            </a>.
          </p>

          <p className="mt-8 text-center text-sm text-gray-500">
            Thank you for using{" "}
            <span className="text-white font-semibold">The Movie Hub</span> —  
            your gateway to explore, discover, and enjoy the world of cinema. 🍿
          </p>
        </div>
      </motion.div>

      {/* Agree Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
        >
          Agree
        </button>
      </div>
    </div>
  );
}
