import { useNavigate } from 'react-router-dom';
import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("movieHub_token") || sessionStorage.getItem("movieHub_token");

  const api = useMemo(() => {
    return axios.create({
      baseURL: "http://localhost:5000",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, [token]);

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/api/users/profile");
        setWatchlist(data.watchlist || []);
        setFavourites(data.favourites || []);
      } catch (err) {
        console.error("Error fetching user lists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLists();
  }, [token, api]);

  const updateList = async (type, movie) => {
    if (!token) {
      toast.error("Please Login to Save !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
        style: {
          background: "#161616", 
          color: "#ffffff",      
          border: "2px solid #ff4c4c",
          fontWeight: "semi-bold",
        },
        transition: Bounce,
      });
      return; 
    }

    try {
      const { data } = await api.post("/api/users/update-list", { type, movie });
      setWatchlist(data.watchlist || []);
      setFavourites(data.favourites || []);
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
    }
  };

  const updateFavouriteNote = (movieId, note) => {
    setFavourites((prev) =>
      prev.map((m) =>
        m.id === movieId ? { ...m, userNote: note } : m
      )
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

  if (loading) return <div>Loading...</div>;

  return (
    <MovieContext.Provider
      value={{
        watchlist,
        favourites,
        addToWatchlist,
        addToFavourites,
        removeFromWatchlist,
        removeFromFavourites,
        updateFavouriteNote,
        loading,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
