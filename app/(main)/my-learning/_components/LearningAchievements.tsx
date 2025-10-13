export default function LearningAchievements() {
  const achievements = [
    {
      id: 1,
      title: "First Course Completed",
      description: "Completed your first course",
      icon: "🎯",
      earned: true,
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Studied for 7 consecutive days",
      icon: "🔥",
      earned: true,
      date: "2024-01-20",
    },
    {
      id: 3,
      title: "Knowledge Seeker",
      description: "Completed 5 courses",
      icon: "📚",
      earned: true,
      date: "2024-02-01",
    },
    {
      id: 4,
      title: "Speed Learner",
      description: "Complete a course in under 2 weeks",
      icon: "⚡",
      earned: false,
      progress: 75,
    },
    {
      id: 5,
      title: "Certification Master",
      description: "Earn 10 certificates",
      icon: "🏆",
      earned: false,
      progress: 50,
    },
    {
      id: 6,
      title: "Study Streak Legend",
      description: "Maintain a 30-day study streak",
      icon: "👑",
      earned: false,
      progress: 23,
    },
  ];

  const earnedAchievements = achievements.filter((a) => a.earned);
  const upcomingAchievements = achievements.filter((a) => !a.earned);

  return (
    <div className="bg-[#1C1F2A] border border-[#6B7280] rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
        Achievements
      </h2>

      <div className="space-y-6">
        {/* Earned Achievements */}
        <div>
          <h3 className="text-sm font-semibold text-[#F5B301] mb-3">
            Earned ({earnedAchievements.length})
          </h3>
          <div className="space-y-3">
            {earnedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-[#2A2D3A] border border-[#F5B301]/30 rounded-lg p-2 sm:p-3"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-lg sm:text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {achievement.description}
                    </div>
                    <div className="text-xs text-[#F5B301] mt-1">
                      Earned on{" "}
                      {achievement.date
                        ? new Date(achievement.date).toLocaleDateString()
                        : "Recently"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Achievements */}
        <div>
          <h3 className="text-sm font-semibold text-[#6B7280] mb-3">
            In Progress ({upcomingAchievements.length})
          </h3>
          <div className="space-y-3">
            {upcomingAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-[#2A2D3A] border border-[#6B7280] rounded-lg p-2 sm:p-3"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-lg sm:text-2xl opacity-50">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {achievement.description}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-[#1C1F2A] rounded-full h-1 sm:h-1.5">
                        <div
                          className="bg-[#6B7280] h-1 sm:h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
