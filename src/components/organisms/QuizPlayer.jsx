import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/atoms/ProgressBar";
import { cn } from "@/utils/cn";

const QuizPlayer = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowFeedback(true);
    setAnswers([...answers, { questionId: question.Id, selectedAnswer: null, correct: false }]);
    toast.error("Time's up!");
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setShowFeedback(true);
    
    const isCorrect = answer === question.correctAnswer;
    setAnswers([...answers, { 
      questionId: question.Id, 
      selectedAnswer: answer, 
      correct: isCorrect 
    }]);

    if (isCorrect) {
      toast.success("Correct!");
    } else {
      toast.error("Wrong answer!");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(30);
      setIsAnswered(false);
    } else {
      // Quiz complete
      const score = answers.filter(a => a.correct).length;
      onComplete({
        score,
        totalQuestions,
        answers: [...answers, { 
          questionId: question.Id, 
          selectedAnswer: selectedAnswer, 
          correct: selectedAnswer === question.correctAnswer 
        }]
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <ApperIcon name="Clock" size={16} className="text-gray-400" />
              <span className={cn(
                "text-sm font-medium",
                timeLeft <= 5 ? "text-error" : "text-gray-300"
              )}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Score: {answers.filter(a => a.correct).length}/{answers.length}
          </div>
        </div>
        <ProgressBar value={progress} className="mb-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-display font-semibold mb-4">
              {question.text}
            </h2>
            
            {question.media && (
              <div className="mb-4">
                <img 
                  src={question.media} 
                  alt="Question media" 
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            )}
            
            <div className="grid gap-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === option.text;
                const isCorrect = option.text === question.correctAnswer;
                
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                    onClick={() => handleAnswerSelect(option.text)}
                    disabled={isAnswered}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-300 text-left",
                      !isAnswered && "hover:border-primary hover:bg-primary/5",
                      isAnswered && isSelected && isCorrect && "bg-success/20 border-success text-success",
                      isAnswered && isSelected && !isCorrect && "bg-error/20 border-error text-error animate-shake",
                      isAnswered && !isSelected && isCorrect && "bg-success/10 border-success/50",
                      !isAnswered && "bg-surface border-white/10 text-white cursor-pointer",
                      isAnswered && !isSelected && !isCorrect && "bg-surface/50 border-white/5 text-gray-400"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                        isAnswered && isSelected && isCorrect && "bg-success border-success text-white",
                        isAnswered && isSelected && !isCorrect && "bg-error border-error text-white",
                        isAnswered && !isSelected && isCorrect && "bg-success/20 border-success",
                        !isAnswered && "border-white/30"
                      )}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option.text}</span>
                      {isAnswered && isCorrect && (
                        <ApperIcon name="Check" size={20} className="text-success" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <ApperIcon name="X" size={20} className="text-error" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Feedback Section */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="bg-surface/50">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  selectedAnswer === question.correctAnswer ? "bg-success/20" : "bg-error/20"
                )}>
                  <ApperIcon 
                    name={selectedAnswer === question.correctAnswer ? "Check" : "X"} 
                    size={20} 
                    className={selectedAnswer === question.correctAnswer ? "text-success" : "text-error"}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">
                    {selectedAnswer === question.correctAnswer ? "Correct!" : "Wrong Answer"}
                  </h3>
                  {question.explanation && (
                    <p className="text-gray-400 text-sm">{question.explanation}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1);
              setSelectedAnswer(null);
              setShowFeedback(false);
              setTimeLeft(30);
              setIsAnswered(false);
            }
          }}
          disabled={currentQuestion === 0}
        >
          <ApperIcon name="ChevronLeft" size={20} />
          Previous
        </Button>

        {showFeedback && (
          <Button
            variant="primary"
            onClick={handleNextQuestion}
            className="flex items-center gap-2"
          >
            {currentQuestion < totalQuestions - 1 ? "Next Question" : "Finish Quiz"}
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;