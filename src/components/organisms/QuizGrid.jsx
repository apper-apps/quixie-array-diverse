import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QuizCard from "@/components/molecules/QuizCard";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { quizService } from "@/services/api/quizService";

const QuizGrid = ({ title, category, limit }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["Personality", "Trivia", "Pop Culture", "Hypotheticals", "General Knowledge"];

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, selectedCategory, category]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizService.getAll();
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    // Filter by category prop (if provided)
    if (category && category !== "All") {
      filtered = filtered.filter(quiz => quiz.category === category);
    }

    // Filter by selected category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    // Limit results if specified
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    setFilteredQuizzes(filtered);
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
  };

  const handleRetry = () => {
    loadQuizzes();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">{title}</h2>
          {!category && (
            <CategoryFilter
              categories={categories}
              onCategoryChange={handleCategoryChange}
              className="hidden md:flex"
            />
          )}
        </div>
      )}

      {!category && (
        <div className="md:hidden">
          <CategoryFilter
            categories={categories}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      )}

      {filteredQuizzes.length === 0 ? (
        <Empty
          title="No quizzes found"
          description="Try changing your filters or create a new quiz"
          actionLabel="Create Quiz"
          actionPath="/create"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <QuizCard quiz={quiz} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default QuizGrid;