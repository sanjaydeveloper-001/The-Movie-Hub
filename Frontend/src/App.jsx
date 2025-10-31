import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ToastContainer, Bounce } from "react-toastify";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import MovieDetails from "./Pages/MovieDetails";
import Watchlist from "./Pages/Watchlist";
import Favourites from "./Pages/Favourites";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import axios from "axios";
import ForgotPassword from "./Pages/ForgotPassword";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("movieHub_token") || sessionStorage.getItem("movieHub_token");
    if (storedToken) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_LINK}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("movieHub_token");
        }
      };
      fetchUser();
    }
  }, [setUser]);

  return (
    <AnimatePresence mode="wait">
      <MovieProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
            <Header user={user} setUser={setUser} />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme="dark"
              transition={Bounce}
            />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />

                <Route
                  path="/watchlist"
                  element={<Watchlist user={user} />}
                />
                <Route
                  path="/favourites"
                  element={<Favourites user={user} />}
                />

                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />

                <Route
                  path="/signup"
                  element={<Signup setUser={setUser} />}
                />
                <Route
                  path="/login"
                  element={<Login setUser={setUser} />}
                />
                <Route 
                  path="/forgotpassword"
                  element={<ForgotPassword />}
                />
                <Route
                  path="/profile"
                  element={<ProfilePage/>}
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </MovieProvider>
    </AnimatePresence>

  );
}

export default App;
