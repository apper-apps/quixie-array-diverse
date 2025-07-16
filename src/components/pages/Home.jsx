import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import QuizGrid from "@/components/organisms/QuizGrid";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/20 via-secondary/10 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold gradient-text mb-6"
            >
              Quiz Your Way to Fun,
              <br />
              Insights & Connections!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Challenge yourself, explore new perspectives, and connect with a vibrant community of curious minds through quizzes that are far from ordinary.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/categories">
                <Button size="lg" className="flex items-center gap-2">
                  <ApperIcon name="Play" size={20} />
                  Start Quiz
                </Button>
              </Link>
              <Link to="/create">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <ApperIcon name="Plus" size={20} />
                  Create Quiz
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Quizzes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <QuizGrid title="Featured Quizzes" limit={6} />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-surface/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Why Choose Quixie?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              More than just a quiz app - it's about community, exploration, and meaningful connections.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "Brain",
                title: "AI-Powered Quizzes",
                description: "Smart algorithms that adapt to your responses for personalized experiences"
              },
              {
                icon: "Users",
                title: "Vibrant Community",
                description: "Connect with like-minded quiz enthusiasts and share your results"
              },
              {
                icon: "Trophy",
                title: "Achievements & Rewards",
                description: "Earn badges, unlock content, and climb the leaderboards"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={feature.icon} size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore diverse quiz categories from personality tests to brain-bending trivia
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Personality", icon: "User", color: "from-purple-500 to-pink-500" },
              { name: "Trivia", icon: "Brain", color: "from-blue-500 to-indigo-500" },
              { name: "Pop Culture", icon: "Tv", color: "from-yellow-500 to-orange-500" },
              { name: "Hypotheticals", icon: "Lightbulb", color: "from-green-500 to-teal-500" },
              { name: "General Knowledge", icon: "Book", color: "from-red-500 to-pink-500" }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <Link to={`/categories?category=${category.name}`}>
                  <div className={`bg-gradient-to-br ${category.color} rounded-lg p-6 text-center text-white hover:shadow-lg transition-shadow`}>
                    <ApperIcon name={category.icon} size={32} className="mx-auto mb-2" />
                    <h3 className="font-medium text-sm">{category.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;