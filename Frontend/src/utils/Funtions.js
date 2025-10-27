// ✅ Convert language ISO → Full name
const languageMap = {
  en: "English",
  ta: "Tamil",
  hi: "Hindi",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  ja: "Japanese",
  ko: "Korean",
  fr: "French",
  es: "Spanish",
  de: "German",
  zh: "Chinese",
};

export const getLanguageName = (code) =>
  languageMap[code?.toLowerCase()] || code?.toUpperCase() || "Unknown";

// ✅ Convert runtime → readable format (2h 10m)
export const formatRuntime = (minutes) => {
  if (!minutes || isNaN(minutes)) return "N/A";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs > 0 ? `${hrs}h ` : ""}${mins > 0 ? `${mins}m` : ""}`.trim();
};
