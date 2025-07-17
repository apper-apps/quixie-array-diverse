import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import QuizGrid from "@/components/organisms/QuizGrid";

const Categories = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = [
    {
      name: "All",
      icon: "Grid3x3",
      color: "from-primary to-secondary",
      description: "All available quizzes"
    },
    {
      name: "Personality",
      icon: "User",
      color: "from-purple-500 to-pink-500",
      description: "Discover your personality traits and characteristics"
    },
    {
      name: "Trivia",
      icon: "Brain",
      color: "from-blue-500 to-indigo-500",
      description: "Test your knowledge across various topics"
    },
    {
      name: "Pop Culture",
      icon: "Tv",
      color: "from-yellow-500 to-orange-500",
      description: "Movies, music, celebrities, and trending topics"
    },
    {
      name: "Hypotheticals",
      icon: "Lightbulb",
      color: "from-green-500 to-teal-500",
      description: "What would you do in interesting scenarios?"
    },
{
      name: "General Knowledge",
      icon: "Book",
      color: "from-red-500 to-pink-500",
      description: "Test your general knowledge and learn new facts"
    },
    {
      name: "Books",
      icon: "BookOpen",
      color: "from-blue-500 to-indigo-500",
      description: "Literary quizzes about your favorite books, authors, and stories"
    },
    {
      name: "Love and Relationships",
      icon: "Heart",
      color: "from-pink-500 to-rose-500",
      description: "Explore relationship dynamics and romantic compatibility"
    }
  ];

  const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold gradient-text mb-4">
            Quiz Categories
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose from our diverse collection of quiz categories and find the perfect challenge for your mood
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className={`
                bg-surface rounded-xl p-6 border transition-all duration-300
                ${selectedCategory === category.name 
                  ? "border-primary glow" 
                  : "border-white/10 hover:border-white/20"
                }
              `}>
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                  <ApperIcon name={category.icon} size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-sm">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Category Header */}
        {selectedCategoryData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${selectedCategoryData.color} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={selectedCategoryData.icon} size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">
                  {selectedCategory} Quizzes
                </h2>
                <p className="text-gray-400">{selectedCategoryData.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quiz Grid */}
        <QuizGrid category={selectedCategory === "All" ? null : selectedCategory} />
      </div>
    </div>
  );
};

export default Categories;