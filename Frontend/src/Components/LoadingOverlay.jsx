export default function LoadingOverlay({ text = "Please wait..." }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
      <div className="w-10 h-10 border-4 border-t-transparent border-red-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-200 text-lg font-medium animate-pulse">{text}</p>
    </div>
  );
}
