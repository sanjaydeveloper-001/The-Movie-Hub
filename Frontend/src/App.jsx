import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";
import { AnimatePresence } from "framer-motion";
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
import ForgotPassword from "./Pages/ForgotPassword";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  return (
    <AnimatePresence mode="wait">
      <MovieProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
            <Header />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar
              pauseOnHover={false}
              theme="dark"
              transition={Bounce}
            />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/profile" element={<ProfilePage />} />
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
