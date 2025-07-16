import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const QuizCard = ({ quiz, className }) => {
  const getCategoryColor = (category) => {
    const colors = {
      "Personality": "secondary",
      "Trivia": "info",
      "Pop Culture": "warning",
      "Hypotheticals": "success",
      "General Knowledge": "default"
    };
    return colors[category] || "default";
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(className)}
    >
      <Link to={`/quiz/${quiz.Id}`}>
        <Card className="h-full hover:glow transition-all duration-300 cursor-pointer group">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <Badge variant={getCategoryColor(quiz.category)}>
                {quiz.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <ApperIcon name="Users" size={14} />
                <span>{quiz.participantCount}</span>
              </div>
            </div>
            
            <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {quiz.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-2">
              {quiz.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar size="sm" alt={quiz.creator?.username} />
                <span className="text-sm text-gray-300">{quiz.creator?.username}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <ApperIcon name="Clock" size={14} />
                <span>{quiz.questions?.length || 0} questions</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default QuizCard;