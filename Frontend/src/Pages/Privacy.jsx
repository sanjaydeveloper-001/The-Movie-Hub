import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
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
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mb-6 text-sm text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-5 text-gray-400 leading-relaxed">
          <p>
            Welcome to <span className="text-white font-medium">The Movie Hub</span>. 
            We value your trust and are committed to safeguarding your personal information.  
            This Privacy Policy explains how we collect, use, and protect your data when you use our platform.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            1. Information We Collect
          </h2>
          <p>
            We may collect basic personal information such as your name, email address, and 
            preferences when you create an account, save movies to your watchlist, or interact 
            with features of our app.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            2. How We Use Your Information
          </h2>
          <p>
            The data we collect is used to enhance your experience on The Movie Hub — for example, 
            saving your watchlist and favourites, improving movie recommendations, and providing 
            a seamless browsing experience.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">3. Cookies</h2>
          <p>
            We use cookies to improve website performance and remember your preferences.  
            You can manage or disable cookies in your browser settings if you wish.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">4. Data Security</h2>
          <p>
            Your privacy is important to us. We implement reasonable technical measures to 
            protect your data, but please note that no method of transmission over the internet 
            is completely secure.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            5. Third-Party Services
          </h2>
          <p>
            The Movie Hub may use third-party APIs, such as TMDB, to fetch movie details and posters.  
            These third parties have their own privacy policies, and we recommend reviewing them 
            for more information.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">6. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information.  
            For any privacy-related concerns or requests, please contact us at{" "}
            <a
              href="mailto:helpcinehub@gmail.com"
              className="text-blue-400 hover:underline"
            >
              helpcinehub@gmail.com
            </a>.
          </p>

          <h2 className="text-lg text-white font-semibold mt-6">
            7. Policy Updates
          </h2>
          <p>
            We may revise this Privacy Policy periodically to reflect improvements or legal 
            requirements. Any updates will be posted here with the date of the latest revision.
          </p>

          <p className="mt-8 text-center text-sm text-gray-500">
            Thank you for being part of{" "}
            <span className="text-white font-semibold">The Movie Hub</span>.  
            Your trust and privacy mean a lot to us. 🎬
          </p>
        </div>
      </motion.div>

      {/* Agree Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
        >
          Agree 
        </button>
      </div>
    </div>
  );
}
