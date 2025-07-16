import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ProfileStats from "@/components/organisms/ProfileStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { userService } from "@/services/api/userService";
import { quizService } from "@/services/api/quizService";
import { resultService } from "@/services/api/resultService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock user ID - in real app this would come from auth
      const userId = "user-1";
      
      const [userData, quizzesData, resultsData] = await Promise.all([
        userService.getById(userId),
        quizService.getByUserId(userId),
        resultService.getByUserId(userId)
      ]);
      
      setUser(userData);
      setUserQuizzes(quizzesData);
      setRecentResults(resultsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadProfile();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "LayoutDashboard" },
    { id: "created", label: "Created Quizzes", icon: "Plus" },
    { id: "history", label: "Quiz History", icon: "History" },
    { id: "achievements", label: "Achievements", icon: "Trophy" }
  ];

  if (loading) return <Loading message="Loading profile..." />;
  if (error) return <Error message={error} onRetry={handleRetry} />;
  if (!user) return <Error message="User not found" />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar size="xl" alt={user.username} />
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-display font-bold mb-2">
                    {user.username}
                  </h1>
                  <p className="text-gray-400 mb-4">
                    Quiz enthusiast and knowledge seeker
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="primary">Quiz Master</Badge>
                    <Badge variant="secondary">Community Member</Badge>
                    <Badge variant="success">Active Creator</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <ApperIcon name="Settings" size={16} />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ApperIcon name="Share" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <ProfileStats userId={user.Id} />
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <Link to="/categories">
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentResults.slice(0, 3).map((result, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <ApperIcon name="Trophy" size={16} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{result.quiz?.title}</p>
                          <p className="text-xs text-gray-400">
                            Score: {result.score}/{result.totalQuestions}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Achievements */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Achievements</h3>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {user.achievements?.slice(0, 3).map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                        <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                          <ApperIcon name="Award" size={16} className="text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{achievement.title}</p>
                          <p className="text-xs text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "created" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Your Created Quizzes</h3>
                  <Link to="/create">
                    <Button variant="primary" className="flex items-center gap-2">
                      <ApperIcon name="Plus" size={16} />
                      Create New Quiz
                    </Button>
                  </Link>
                </div>
                {userQuizzes.length === 0 ? (
                  <Empty
                    title="No quizzes created yet"
                    description="Start creating your first quiz to share with the community"
                    actionLabel="Create Quiz"
                    actionPath="/create"
                  />
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userQuizzes.map((quiz) => (
                      <Card key={quiz.Id}>
                        <Badge variant="secondary" className="mb-2">
                          {quiz.category}
                        </Badge>
                        <h4 className="font-semibold mb-2">{quiz.title}</h4>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                          {quiz.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Users" size={14} />
                            <span>{quiz.participantCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Clock" size={14} />
                            <span>{quiz.questions?.length || 0} questions</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Quiz History</h3>
                {recentResults.length === 0 ? (
                  <Empty
                    title="No quiz history yet"
                    description="Take your first quiz to start building your history"
                    actionLabel="Browse Quizzes"
                    actionPath="/categories"
                  />
                ) : (
                  <div className="space-y-4">
                    {recentResults.map((result) => (
                      <Card key={result.Id}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{result.quiz?.title}</h4>
                            <p className="text-sm text-gray-400">
                              Completed on {new Date(result.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {Math.round((result.score / result.totalQuestions) * 100)}%
                            </div>
                            <p className="text-sm text-gray-400">
                              {result.score}/{result.totalQuestions}
                            </p>
                          </div>
                          <div className="ml-4">
                            <Link to={`/results/${result.Id}`}>
                              <Button variant="ghost" size="sm">
                                View Results
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "achievements" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Achievements</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.achievements?.map((achievement) => (
                    <Card key={achievement.Id}>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-warning to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ApperIcon name="Award" size={32} className="text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">{achievement.title}</h4>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;