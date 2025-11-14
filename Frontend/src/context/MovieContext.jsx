import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [actionLoading, setActionLoading] = useState({ type: null, id: null });
  const [lang, setLang] = useState(
    () => localStorage.getItem("localUserLanguage") || "en"
  );

  const token =
    localStorage.getItem("movieHub_token") ||
    sessionStorage.getItem("movieHub_token");

  const api = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_BACKEND_LINK,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, [token]);

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!token) return;
      try {
        const { data } = await api.get("/api/users/profile");
        setUser(data);
        if(data.language){
          setLang(data.language);
          localStorage.setItem("localUserLanguage", data.language);
        }
        else{
          setLang( localStorage.getItem("localUserLanguage") || "en");
        }
        setWatchlist(data.watchlist || []);
        setFavourites(data.favourites || []);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      }

      console.log(user);
    };
    fetchUserLists();
  }, [token, api]);

  const updateList = async (type, movie) => {
    if (!token) {
      toast.error("Please Login to Save!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
        style: {
          background: "#161616",
          color: "#ffffff",
          border: "2px solid #ff4c4c",
        },
        transition: Bounce,
      });
      return;
    }

    setActionLoading({ type, id: movie.id });

    try {
      const { data } = await api.post("/api/users/update-list", {
        type,
        movie,
      });
      setWatchlist(data.watchlist || []);
      setFavourites(data.favourites || []);
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  const updateFavouriteNote = (movieId, note) => {
    setFavourites((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, userNote: note } : m))
    );
  };

  const addToWatchlist = (movie) => updateList("watchlist", movie);
  const addToFavourites = (movie) => updateList("favourites", movie);
  const removeFromWatchlist = (id) => {
    const movie = watchlist.find((m) => m.id === id);
    if (movie) updateList("watchlist", movie);
  };
  const removeFromFavourites = (id) => {
    const movie = favourites.find((m) => m.id === id);
    if (movie) updateList("favourites", movie);
  };

  return (
    <MovieContext.Provider
      value={{
        user,
        lang,
        setUser,
        setLang,
        watchlist,
        favourites,
        addToWatchlist,
        addToFavourites,
        removeFromWatchlist,
        removeFromFavourites,
        updateFavouriteNote,
        actionLoading,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
