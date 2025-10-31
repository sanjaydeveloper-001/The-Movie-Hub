import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/Logo.png";
import { FaArrowRight, FaLanguage, FaUserLock, FaFilm } from "react-icons/fa";

export default function Intro({ onFinish, setLang, setQuery }) {
  const [showLogo, setShowLogo] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState("en");
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("localUserLanguage");

    const timer = setTimeout(() => {
      if (savedLang) {
        setShowLogo(false);
        finishIntro();
      } else {
        setShowLogo(false);
        setShowSteps(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  // ✅ Supported languages
  const languages = [
    { code: "en", name: "English" },
    { code: "ta", name: "Tamil" },
    { code: "hi", name: "Hindi" },
    { code: "ml", name: "Malayalam" },
    { code: "te", name: "Telugu" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "ko", name: "Korean" },
  ];

  // ✅ Finish function
  const finishIntro = () => {
    sessionStorage.setItem("introShown", "true");
    onFinish();
  };

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white flex items-center justify-center z-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* 🌟 Step 0: Logo Animation */}
        {showLogo && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <img
              src={logo}
              alt="MovieHub Logo"
              className="w-20 sm:w-28 md:w-36 lg:w-40 animate-zoomInOut"
            />
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mt-4 typewriter">
              The Movie Hub
            </h1>
          </motion.div>
        )}

        {/* 🌙 Step 1–3: After Animation */}
        {showSteps && (
          <motion.div
            key="steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg text-center p-6"
          >
            <AnimatePresence mode="wait">
              {/* 🧭 STEP 1 - Welcome */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <FaFilm className="text-5xl text-[#A00000] mx-auto animate-pulse" />
                  <h1 className="text-3xl font-bold">
                    Welcome to <span className="text-[#FF2A2A]">Movie Hub</span>
                  </h1>
                  <p className="text-gray-400 leading-relaxed">
                    Explore trending movies, search across languages, and save
                    your favorites — powered by{" "}
                    <span className="text-[#C00000] font-semibold">
                      TMDB API
                    </span>
                    .
                  </p>

                  <button
                    onClick={nextStep}
                    className="mt-6 bg-gradient-to-r from-[#7A0000] to-[#A00000] 
                      hover:from-[#A00000] hover:to-[#C00000]
                      px-6 py-3 rounded-xl font-semibold text-white
                      flex items-center justify-center gap-2 mx-auto shadow-[0_0_15px_#A00000] transition"
                  >
                    Continue <FaArrowRight />
                  </button>
                </motion.div>
              )}

              {/* 🌐 STEP 2 - Language Selection */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <FaLanguage className="text-5xl text-[#A00000] mx-auto" />
                  <h2 className="text-2xl font-bold">Choose Your Language</h2>
                  <p className="text-gray-400">
                    TMDB supports{" "}
                    <span className="text-[#FF3333]">60+ languages</span>.
                    Choose your preferred one.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang.code);
                          setLang(lang.code);
                          localStorage.setItem("localUserLanguage", lang.code);
                        }}
                        className={`py-2 rounded-lg font-medium transition
                          ${
                            selectedLang === lang.code
                              ? "bg-gradient-to-r from-[#7A0000] to-[#A00000] text-white shadow-[0_0_10px_#FF0000]"
                              : "bg-[#1b1b1b] text-gray-300 hover:bg-[#222]"
                          }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={prevStep}
                      className="px-5 py-2 rounded-lg bg-[#1c1c1c] text-gray-300 hover:bg-[#2b2b2b] transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#7A0000] to-[#A00000] hover:from-[#A00000] hover:to-[#C00000] shadow-[0_0_10px_#FF0000] font-semibold"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* 🔐 STEP 3 - Login / Continue */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <FaUserLock className="text-5xl text-[#A00000] mx-auto" />
                  <h2 className="text-2xl font-bold">Get Started</h2>
                  <p className="text-gray-400">
                    Login to save your{" "}
                    <span className="text-[#FF3333] font-medium">
                      watchlist & favourite movies
                    </span>
                    , or continue as guest.
                  </p>

                  <div className="flex flex-col gap-3 mt-5">
                    <button
                      onClick={() => {
                        setQuery("login");
                        finishIntro();
                      }}
                      className="py-3 rounded-lg bg-gradient-to-r from-[#7A0000] to-[#A00000] hover:from-[#A00000] hover:to-[#C00000] text-white font-semibold shadow-[0_0_10px_#FF0000] transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setQuery("signup");
                        finishIntro();
                      }}
                      className="py-3 rounded-lg bg-[#1b1b1b] text-gray-300 hover:bg-[#2b2b2b] transition"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={finishIntro}
                      className="py-3 rounded-lg border border-gray-600 hover:border-[#A00000] text-gray-400 hover:text-white transition"
                    >
                      Continue Without Login
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
