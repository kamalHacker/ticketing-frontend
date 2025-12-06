"use client";
import { createContext, useContext, useState } from "react";
import { toastStore } from "@/lib/toastStore";
import { useEffect } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    
    setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => {
    toastStore.register(showToast);
  }, []);

  return (
    <ToastContext.Provider value={{ show: showToast }}>
      {children}

      {/* Toast UI */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded shadow-lg text-white
          ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}
          transition-opacity animate-fade-in`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
