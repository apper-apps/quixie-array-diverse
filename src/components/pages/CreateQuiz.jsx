import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
import { quizService } from "@/services/api/quizService";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    category: "",
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "multiple-choice",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false }
    ],
    explanation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

const categories = [
    "Personality",
    "Trivia", 
    "Pop Culture",
    "Hypotheticals",
    "General Knowledge",
    "Books",
    "Love and Relationships"
  ];
  const steps = [
    { number: 1, title: "Basic Info", icon: "FileText" },
    { number: 2, title: "Add Questions", icon: "Plus" },
    { number: 3, title: "Preview", icon: "Eye" },
    { number: 4, title: "Publish", icon: "Upload" }
  ];

  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();
    if (!quizData.title || !quizData.description || !quizData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCurrentStep(2);
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    
    if (!currentQuestion.text) {
      toast.error("Please enter a question");
      return;
    }

    const filledOptions = currentQuestion.options.filter(opt => opt.text.trim());
    if (filledOptions.length < 2) {
      toast.error("Please provide at least 2 answer options");
      return;
    }

    const correctAnswers = filledOptions.filter(opt => opt.isCorrect);
    if (correctAnswers.length !== 1) {
      toast.error("Please select exactly one correct answer");
      return;
    }

    const question = {
      Id: quizData.questions.length + 1,
      text: currentQuestion.text,
      type: currentQuestion.type,
      options: filledOptions,
      correctAnswer: correctAnswers[0].text,
      explanation: currentQuestion.explanation
    };

    setQuizData({
      ...quizData,
      questions: [...quizData.questions, question]
    });

    // Reset form
    setCurrentQuestion({
      text: "",
      type: "multiple-choice",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ],
      explanation: ""
    });

    toast.success("Question added successfully!");
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index][field] = value;
    
    // If marking as correct, unmark others
    if (field === "isCorrect" && value) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

const handlePublish = async () => {
    if (quizData.questions.length < 10) {
      toast.error("Please add at least 10 questions for comprehensive analysis");
      return;
    }

    try {
      setIsSubmitting(true);
      const quiz = await quizService.create({
        ...quizData,
        creatorId: "user-1", // Mock user ID
        participantCount: 0,
        averageScore: 0,
        createdAt: new Date().toISOString()
      });

      toast.success("Quiz created successfully!");
      navigate(`/quiz/${quiz.Id}`);
    } catch (err) {
      toast.error("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Create Your Quiz
          </h1>
          <p className="text-gray-400">
            Share your knowledge and creativity with the community
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2",
                    currentStep >= step.number
                      ? "bg-primary border-primary text-white"
                      : "border-gray-600 text-gray-400"
                  )}>
                    <ApperIcon name={step.icon} size={16} />
                  </div>
                  <span className={cn(
                    "ml-2 text-sm font-medium",
                    currentStep >= step.number ? "text-primary" : "text-gray-400"
                  )}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-8 h-0.5 mx-4",
                      currentStep > step.number ? "bg-primary" : "bg-gray-600"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Card>
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quiz Title *
                  </label>
                  <Input
                    type="text"
                    value={quizData.title}
                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                    placeholder="Enter an engaging quiz title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    value={quizData.description}
                    onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                    placeholder="Describe what your quiz is about..."
                    className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        type="button"
                        variant={quizData.category === category ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setQuizData({ ...quizData, category })}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Continue
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Step 2: Add Questions */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Add Questions</h2>
                  <Badge variant="primary">
                    {quizData.questions.length} question{quizData.questions.length !== 1 ? 's' : ''} added
                  </Badge>
                </div>

                <form onSubmit={handleQuestionSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Question *
                    </label>
                    <Input
                      type="text"
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                      placeholder="Enter your question..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Answer Options *
                    </label>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="correct-answer"
                            checked={option.isCorrect}
                            onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
                            className="w-4 h-4 text-primary"
                          />
                          <Input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + index)}...`}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-400 min-w-[80px]">
                            {option.isCorrect ? "Correct" : "Option"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={currentQuestion.explanation}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                      placeholder="Explain why this is the correct answer..."
                      className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <div className="flex gap-2">
                      <Button type="submit" variant="secondary">
                        Add Question
                      </Button>
{quizData.questions.length >= 10 && (
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => setCurrentStep(3)}
                        >
                          Preview Quiz
                        </Button>
                      )}
{quizData.questions.length > 0 && quizData.questions.length < 10 && (
                        <div className="text-sm text-gray-400 mt-2">
                          Add {10 - quizData.questions.length} more question{10 - quizData.questions.length !== 1 ? 's' : ''} for comprehensive analysis (minimum 10 required)
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </Card>

              {/* Added Questions */}
              {quizData.questions.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Added Questions</h3>
                  <div className="space-y-3">
                    {quizData.questions.map((question, index) => (
                      <div key={question.Id} className="p-4 bg-surface/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">Q{index + 1}: {question.text}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setQuizData({
                                ...quizData,
                                questions: quizData.questions.filter(q => q.Id !== question.Id)
                              });
                              toast.success("Question removed");
                            }}
                          >
                            <ApperIcon name="X" size={16} />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-400">
                          Correct answer: {question.correctAnswer}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 3 && (
            <Card>
              <h2 className="text-xl font-semibold mb-6">Preview Your Quiz</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-surface/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">{quizData.title}</h3>
                  <p className="text-gray-400 mb-2">{quizData.description}</p>
                  <Badge variant="primary">{quizData.category}</Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Questions ({quizData.questions.length})</h4>
                  <div className="space-y-4">
                    {quizData.questions.map((question, index) => (
                      <div key={question.Id} className="p-4 bg-surface/50 rounded-lg">
                        <h5 className="font-medium mb-3">Q{index + 1}: {question.text}</h5>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={cn(
                                "p-2 rounded text-sm",
                                option.text === question.correctAnswer
                                  ? "bg-success/20 text-success"
                                  : "bg-surface text-gray-400"
                              )}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option.text}
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <p className="text-sm text-gray-400 mt-2">
                            Explanation: {question.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back to Edit
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setCurrentStep(4)}
                  >
                    Publish Quiz
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Publish */}
          {currentStep === 4 && (
            <Card className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Upload" size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">Ready to Publish?</h2>
                <p className="text-gray-400">
                  Your quiz is ready to be shared with the community
                </p>
              </div>

              <div className="mb-6 p-4 bg-surface/50 rounded-lg">
                <h3 className="font-semibold mb-2">Quiz Summary</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Title: {quizData.title}</p>
                  <p>Category: {quizData.category}</p>
                  <p>Questions: {quizData.questions.length}</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(3)}
                  disabled={isSubmitting}
                >
                  Back to Preview
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Upload" size={16} />
                      Publish Quiz
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreateQuiz;