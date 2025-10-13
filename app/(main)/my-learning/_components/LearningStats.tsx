"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLearningStats } from "@/contexts/LearningStatsContext";

interface LearningStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  totalLessons: number;
  completedLessons: number;
  learningStreak: number;
  certificatesCount: number;
}

export default function LearningStats() {
  const { stats, setStats, refreshStats } = useLearningStats();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await refreshStats();
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshStats]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="bg-[#1C1F2A] border-[#6B7280] p-3 sm:p-6 animate-pulse"
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 bg-[#6B7280] rounded"></div>
                <div className="w-16 h-4 bg-[#6B7280] rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="w-12 h-8 bg-[#6B7280] rounded"></div>
                <div className="w-20 h-4 bg-[#6B7280] rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="bg-[#1C1F2A] border-[#6B7280] p-3 sm:p-6">
          <CardContent className="p-0">
            <div className="text-center">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-xl font-bold text-white">0</div>
              <div className="text-sm text-[#6B7280]">Courses Enrolled</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsData = [
    {
      title: "Courses Enrolled",
      value: stats.totalCourses.toString(),
      change:
        stats.completedCourses > 0
          ? `${stats.completedCourses} completed`
          : "Start learning!",
      icon: "📚",
    },
    {
      title: "Hours Learned",
      value: Math.round(stats.totalHours).toString(),
      change:
        stats.totalHours > 0
          ? `${Math.round(stats.totalHours * 0.3)} this week`
          : "Keep going!",
      icon: "⏱️",
    },
    {
      title: "Certificates",
      value: stats.certificatesCount.toString(),
      change: stats.certificatesCount > 0 ? "Great job!" : "Complete courses",
      icon: "🏆",
    },
    {
      title: "Weekly Learning",
      value: `${Math.round(stats.totalHours / 7)}h`,
      change: stats.totalHours > 0 ? "Past 7-day average" : "No data yet",
      icon: "🔥",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="bg-[#1C1F2A] border-[#6B7280] p-3 sm:p-6 hover:border-[#F5B301]/50 transition-colors duration-200"
        >
          <CardContent className="p-0">
            <div className="flex items-center mb-2 sm:mb-4">
              <div className="text-xl sm:text-2xl">{stat.icon}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl sm:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[#6B7280]">{stat.title}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
