"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";

export default function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("الرجاء اختيار ملف صورة صالح");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onChange(data.url);
      } else {
        setError(data.error || "فشل الرفع يرجى المحاولة لاحقاً");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input type="file" ref={inputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      {value ? (
        <div className="relative group w-full h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-sm">
            <button type="button" onClick={() => inputRef.current?.click()} 
              className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors shadow-lg">
              <UploadCloud size={16} /> تغيير
            </button>
            <button type="button" onClick={() => onChange("")} 
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg">
              <X size={16} /> إزالة
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => !uploading && inputRef.current?.click()}
             className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
               error 
                 ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                 : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-primary-400'
             }`}>
          {uploading ? (
            <div className="flex flex-col items-center text-primary-600">
              <Loader2 className="animate-spin mb-3 text-primary-500" size={28} />
              <span className="text-sm font-bold text-slate-600">جاري الرفع...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-400 text-center">
              <UploadCloud size={32} className={`mb-2 ${error ? 'text-red-400' : 'text-slate-400 group-hover:text-primary-500'}`} />
              <span className={`text-sm font-bold ${error ? 'text-red-600' : 'text-slate-600'}`}>
                انقر لاختيار ملف ورفعه مباشرة
              </span>
              <span className={`text-xs mt-1 ${error ? 'text-red-400' : 'text-slate-400'}`}>PNG, JPG, WEBP المدعومة</span>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><X size={12}/> {error}</p>}
    </div>
  );
}
