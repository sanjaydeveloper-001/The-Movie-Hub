export const providerSearchUrls = {
  Netflix: (title) => `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
  "Amazon Prime Video": (title) => `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(title)}`,
  "Disney+ Hotstar": (title) => `https://www.hotstar.com/in/search?q=${encodeURIComponent(title)}`,
  Zee5: (title) => `https://www.zee5.com/search?q=${encodeURIComponent(title)}`,
  SonyLIV: (title) => `https://www.sonyliv.com/search?q=${encodeURIComponent(title)}`,
  JioCinema: (title) => `https://www.jiocinema.com/search/${encodeURIComponent(title)}`,
  "Apple TV Plus": (title) => `https://tv.apple.com/in/search?term=${encodeURIComponent(title)}`,
  "MX Player": (title) => `https://www.mxplayer.in/search?q=${encodeURIComponent(title)}`,
  YouTube: (title) => `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`,
};
