"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface LearningStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  totalLessons: number;
  completedLessons: number;
  learningStreak: number;
  certificatesCount: number;
}

interface LearningStatsContextType {
  stats: LearningStats | null;
  setStats: (stats: LearningStats) => void;
  updateCertificateCount: (increment: number) => void;
  updateCompletedCourses: (increment: number) => void;
  refreshStats: () => Promise<void>;
}

const LearningStatsContext = createContext<LearningStatsContextType | undefined>(
  undefined
);

export function LearningStatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<LearningStats | null>(null);

  const updateCertificateCount = useCallback((increment: number) => {
    setStats((prev) =>
      prev
        ? {
            ...prev,
            certificatesCount: Math.max(0, prev.certificatesCount + increment),
          }
        : null
    );
  }, []);

  const updateCompletedCourses = useCallback((increment: number) => {
    setStats((prev) =>
      prev
        ? {
            ...prev,
            completedCourses: Math.max(0, prev.completedCourses + increment),
          }
        : null
    );
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const response = await fetch("/api/enrollments");
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  return (
    <LearningStatsContext.Provider
      value={{
        stats,
        setStats,
        updateCertificateCount,
        updateCompletedCourses,
        refreshStats,
      }}
    >
      {children}
    </LearningStatsContext.Provider>
  );
}

export function useLearningStats() {
  const context = useContext(LearningStatsContext);
  if (context === undefined) {
    throw new Error("useLearningStats must be used within a LearningStatsProvider");
  }
  return context;
}
