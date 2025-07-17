import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import QuizPlayer from "@/components/organisms/QuizPlayer";
import { resultService } from "@/services/api/resultService";
import { quizService } from "@/services/api/quizService";

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
      // Generate analysis based on quiz responses
      const analysis = generateQuizAnalysis(result.quiz, result.answers);
      
      const quizResult = await resultService.create({
        quizId: quiz.Id,
        userId: "user-1", // Mock user ID
        analysis: analysis,
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

const generateQuizAnalysis = (quiz, answers) => {
    const category = quiz.category;
    const title = quiz.title;
    
    // Simple, direct results based on quiz type
    if (title.includes("Leader")) {
      return "You are a collaborative leader who values input from others and builds consensus while making decisions.";
    } else if (title.includes("Introvert") || title.includes("Extrovert")) {
      return "You are an extrovert who gains energy from social interaction and prefers discussing ideas with others.";
    } else if (title.includes("Dragon")) {
      return "You would be chosen by Tairn - a powerful, strategic dragon who values determination and fierce loyalty.";
    } else if (title.includes("Evelyn Hugo")) {
      return "You embody Evelyn's era of authentic love - willing to protect what matters most despite external pressures.";
    } else if (title.includes("Theo or Charlie")) {
      return "You are Team Theo - you value depth, loyalty, and direct communication in relationships.";
    } else if (title.includes("Love Language")) {
      return "Your primary love language is Words of Affirmation - you feel most loved through verbal appreciation and encouragement.";
    } else if (title.includes("Ready for")) {
      return "You are ready for a serious relationship - you have the emotional maturity and communication skills for commitment.";
    } else if (title.includes("Red Flag")) {
      return "You are most likely to ignore isolation tactics - be aware of partners who gradually separate you from friends and family.";
    } else if (title.includes("Zombie")) {
      return "You are a strategic survivor who prioritizes planning and collaboration for long-term success.";
    } else if (title.includes("Song") || title.includes("Music")) {
      return "You have strong music knowledge across different eras and genres - you scored well on these iconic songs.";
    } else if (title.includes("Landmarks") || title.includes("World")) {
      return "You have solid geography knowledge and cultural awareness of world landmarks and facts.";
    } else if (title.includes("TV Character")) {
      return "You match characters who are decisive, professional, and handle challenges with direct communication.";
    } else if (title.includes("It Ends With Us")) {
      return "You understand the complex themes of breaking cycles and the courage required to make difficult but necessary choices.";
    } else if (category === "Pop Culture") {
      return "You have excellent knowledge of this topic and understand the cultural significance of the stories and characters.";
    } else if (category === "Trivia") {
      return "Great job! You demonstrated solid knowledge across the questions in this quiz.";
    } else if (category === "General Knowledge") {
      return "You have strong general knowledge and good cultural awareness of world facts.";
    } else if (category === "Hypotheticals") {
      return "You showed strategic thinking and strong decision-making skills in these scenarios.";
    } else {
      return "You completed the quiz successfully and showed thoughtful responses to the questions.";
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