"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1C1F2A] to-[#2D1B69] flex items-center justify-center p-4">
          <div className="bg-[#1C1F2A] border border-[#6B7280] rounded-lg p-8 max-w-md w-full text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-400" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">
                  Something went wrong!
                </h1>
                <p className="text-gray-400">
                  A critical error occurred. Please refresh the page or try again
                  later.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 w-full text-left">
                  <p className="text-red-400 text-sm font-mono">{error.message}</p>
                  {error.digest && (
                    <p className="text-red-300 text-xs mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={reset}
                  className="flex-1 bg-[#F5B301] hover:bg-[#F5B301]/90 text-black font-semibold px-4 py-2 rounded-md flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 border border-[#6B7280] text-white hover:bg-[#6B7280]/20 px-4 py-2 rounded-md flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex-1 border border-[#6B7280] text-white hover:bg-[#6B7280]/20 px-4 py-2 rounded-md flex items-center justify-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
