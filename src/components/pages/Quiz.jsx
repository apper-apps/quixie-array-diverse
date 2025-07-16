import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import QuizPlayer from "@/components/organisms/QuizPlayer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { quizService } from "@/services/api/quizService";
import { resultService } from "@/services/api/resultService";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizService.getById(parseInt(id));
      setQuiz(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (result) => {
    try {
      const quizResult = await resultService.create({
        quizId: parseInt(id),
        userId: "user-1", // Mock user ID
        score: result.score,
        totalQuestions: result.totalQuestions,
        answers: result.answers,
        completedAt: new Date().toISOString()
      });

      toast.success("Quiz completed successfully!");
      navigate(`/results/${quizResult.Id}`);
    } catch (err) {
      toast.error("Failed to save quiz results");
    }
  };

  const handleRetry = () => {
    loadQuiz();
  };

  if (loading) return <Loading message="Loading quiz..." />;
  if (error) return <Error message={error} onRetry={handleRetry} />;
  if (!quiz) return <Error message="Quiz not found" />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold mb-2">
              {quiz.title}
            </h1>
            <p className="text-gray-400">{quiz.description}</p>
          </div>
        </motion.div>

        <QuizPlayer quiz={quiz} onComplete={handleQuizComplete} />
      </div>
    </div>
  );
};

export default Quiz;