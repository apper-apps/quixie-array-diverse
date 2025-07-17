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
const getAnalysisColor = () => {
    return "primary"; // All analyses use primary color
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
            Your Analysis
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
                <ApperIcon name="Brain" size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">
                Analysis Complete
              </h2>
              <p className="text-gray-400">
                Based on your {result.totalQuestions} responses, here's your personalized analysis
              </p>
            </div>

<div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {result.totalQuestions}
                </div>
                <div className="text-sm text-gray-400">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  <ApperIcon name="Brain" size={24} />
                </div>
                <div className="text-sm text-gray-400">Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  <ApperIcon name="Star" size={24} />
                </div>
                <div className="text-sm text-gray-400">Personalized</div>
              </div>
            </div>

            <Badge variant={getAnalysisColor()} className="mb-6">
              Personalized Analysis
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

{/* Personalized Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <h3 className="text-xl font-display font-semibold mb-4">
              Your Personalized Analysis
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {result.analysis || 
                "Based on your responses, you demonstrate unique patterns in your thinking and decision-making. Your answers reveal interesting insights about your personality, preferences, and approach to various situations. This analysis is tailored specifically to your response patterns and provides a personalized perspective on your characteristics."
              }
            </p>
          </Card>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CommentSection quizId={result.quizId} />
        </motion.div>

      </div>
    </div>
  );
};

export default Results;