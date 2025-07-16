import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import CommentSection from "@/components/organisms/CommentSection";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { resultService } from "@/services/api/resultService";

const Results = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResult();
  }, [id]);

  const loadResult = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resultService.getById(parseInt(id));
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Result link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleRetry = () => {
    loadResult();
  };

  if (loading) return <Loading message="Loading results..." />;
  if (error) return <Error message={error} onRetry={handleRetry} />;
  if (!result) return <Error message="Results not found" />;

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const getScoreColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Quiz Results
          </h1>
          <p className="text-gray-400">
            {result.quiz?.title}
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="text-center">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {percentage}%
                </span>
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">
                Great Job!
              </h2>
              <p className="text-gray-400">
                You scored {result.score} out of {result.totalQuestions} questions correctly
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {result.score}
                </div>
                <div className="text-sm text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error">
                  {result.totalQuestions - result.score}
                </div>
                <div className="text-sm text-gray-400">Wrong</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {result.totalQuestions}
                </div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
            </div>

            <Badge variant={getScoreColor(percentage)} className="mb-6">
              {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good!" : "Keep Practicing!"}
            </Badge>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleShare}
                variant="primary"
                className="flex items-center gap-2"
              >
                <ApperIcon name="Share" size={16} />
                Share Results
              </Button>
              <Link to={`/quiz/${result.quizId}`}>
                <Button variant="secondary" className="flex items-center gap-2">
                  <ApperIcon name="RotateCcw" size={16} />
                  Retake Quiz
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="ghost" className="flex items-center gap-2">
                  <ApperIcon name="Search" size={16} />
                  Find More Quizzes
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <h3 className="text-xl font-display font-semibold mb-4">
              Question Breakdown
            </h3>
            <div className="space-y-4">
              {result.answers?.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    answer.correct
                      ? "bg-success/10 border-success/20"
                      : "bg-error/10 border-error/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon
                      name={answer.correct ? "Check" : "X"}
                      size={16}
                      className={answer.correct ? "text-success" : "text-error"}
                    />
                    <span className="font-medium">
                      Question {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Your answer: {answer.selectedAnswer || "No answer"}
                  </p>
                  {!answer.correct && (
                    <p className="text-sm text-success mt-1">
                      Correct answer: {answer.correctAnswer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Personalized Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <h3 className="text-xl font-display font-semibold mb-4">
              Your Feedback
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {result.feedback || 
                `Based on your ${percentage}% score, you've shown ${
                  percentage >= 80 ? "excellent knowledge" : 
                  percentage >= 60 ? "good understanding" : 
                  "room for improvement"
                } in this topic. ${
                  percentage >= 80 ? "Keep up the great work!" :
                  percentage >= 60 ? "With a bit more practice, you'll master this!" :
                  "Don't worry - every expert was once a beginner!"
                }`
              }
            </p>
          </Card>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <CommentSection quizId={result.quizId} />
        </motion.div>
      </div>
    </div>
  );
};

export default Results;