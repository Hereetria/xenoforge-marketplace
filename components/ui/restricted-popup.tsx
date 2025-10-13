"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

interface RestrictedPopupProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
}

export default function RestrictedPopup({
  isVisible,
  onClose,
  message = "🚫 Not allowed in demo",
}: RestrictedPopupProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);

      const timer = setTimeout(() => {
        setShouldRender(false);
        setTimeout(() => onClose(), 150);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
      return undefined;
    }
  }, [isVisible, onClose]);

  const handleClose = useCallback(() => {
    setShouldRender(false);
    setTimeout(() => onClose(), 150);
  }, [onClose]);

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        handleClose();
      }
    };

    const handleResize = () => {
      if (isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isVisible, handleClose]);

  if (!shouldRender) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 fade-in-0 duration-200">
        <span className="text-lg">{message}</span>
        <button
          onClick={handleClose}
          className="ml-2 hover:bg-red-600 rounded-full p-1 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
