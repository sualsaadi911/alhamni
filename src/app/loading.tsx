export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#1E4490]/10 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#1E4490] rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-[#3B5BA0] text-sm font-medium">جاري التحميل...</p>
    </div>
  );
}
