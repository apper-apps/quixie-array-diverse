import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";

const ProfileStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getStats(userId);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadStats();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  const statsData = [
    {
      title: "Quizzes Taken",
      value: stats.quizzesTaken,
      icon: "BookOpen",
      trend: { type: "up", value: "+12%" }
    },
    {
      title: "Quizzes Created",
      value: stats.quizzesCreated,
      icon: "Plus",
      trend: { type: "up", value: "+5%" }
    },
    {
      title: "Total Points",
      value: stats.totalPoints.toLocaleString(),
      icon: "Star",
      trend: { type: "up", value: "+8%" }
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: "Target",
      trend: { type: "up", value: "+3%" }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileStats;