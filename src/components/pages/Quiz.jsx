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
    const responses = answers.map(answer => answer.selectedAnswer);
    
    // Analysis based on quiz category
    switch(category) {
      case "Personality":
        return generatePersonalityAnalysis(quiz.title, responses);
      case "Love and Relationships":
        return generateRelationshipAnalysis(quiz.title, responses);
      case "Pop Culture":
        return generatePopCultureAnalysis(quiz.title, responses);
      case "Trivia":
        return generateTriviaAnalysis(quiz.title, responses);
      case "General Knowledge":
        return generateKnowledgeAnalysis(quiz.title, responses);
      case "Hypotheticals":
        return generateHypotheticalAnalysis(quiz.title, responses);
      default:
        return generateGenericAnalysis(quiz.title, responses);
    }
  };

  const generatePersonalityAnalysis = (title, responses) => {
    const traits = analyzeTrait(responses);
    
    if (title.includes("Leader")) {
      return `Based on your responses, you demonstrate ${traits.leadership} leadership qualities. Your approach to decision-making shows ${traits.style} tendencies, and you handle challenges with ${traits.resilience}. You're likely to be ${traits.communication} in your communication style and ${traits.vision} in your long-term thinking.`;
    } else if (title.includes("Introvert") || title.includes("Extrovert")) {
      return `Your responses indicate ${traits.social} social preferences. You recharge through ${traits.energy} and prefer ${traits.processing} when making decisions. Your communication style is ${traits.expression} and you handle stress by ${traits.coping}.`;
    } else if (title.includes("Dragon")) {
      return `Your warrior spirit shows ${traits.courage} in facing challenges. You demonstrate ${traits.loyalty} to those you care about and ${traits.adaptability} when overcoming obstacles. Your approach to conflict is ${traits.strategy} and your motivation comes from ${traits.purpose}.`;
    } else if (title.includes("Evelyn Hugo")) {
      return `Your approach to life shows ${traits.authenticity} in staying true to yourself. You handle public perception with ${traits.resilience} and make decisions based on ${traits.values}. Your relationships are characterized by ${traits.depth} and your legacy focus is ${traits.impact}.`;
    }
    
    return `Your personality profile shows ${traits.primary} characteristics with ${traits.secondary} tendencies. You approach challenges with ${traits.problem_solving} and your interpersonal style is ${traits.social_style}.`;
  };

  const generateRelationshipAnalysis = (title, responses) => {
    const patterns = analyzeRelationshipPatterns(responses);
    
    if (title.includes("Love Language")) {
      return `Your love language profile suggests you ${patterns.giving} and feel most loved when ${patterns.receiving}. In relationships, you ${patterns.communication} and handle conflicts by ${patterns.resolution}. Your emotional needs are ${patterns.security} and you show care through ${patterns.expression}.`;
    } else if (title.includes("Ready for")) {
      return `Your readiness for serious relationships shows ${patterns.maturity} emotional maturity. You handle commitment with ${patterns.commitment} and approach conflicts ${patterns.conflict_style}. Your communication style is ${patterns.openness} and you manage expectations ${patterns.realistic}.`;
    } else if (title.includes("Red Flag")) {
      return `Your relationship awareness shows you might ${patterns.blind_spot} certain warning signs. You tend to ${patterns.rationalization} concerning behaviors and ${patterns.boundaries} when it comes to personal boundaries. Your response to manipulation is ${patterns.vulnerability} and you ${patterns.self_advocacy} for yourself.`;
    }
    
    return `Your relationship patterns show ${patterns.attachment} attachment style with ${patterns.communication} communication preferences. You handle intimacy with ${patterns.openness} and approach commitment ${patterns.stability}.`;
  };

  const generatePopCultureAnalysis = (title, responses) => {
    const interests = analyzeInterests(responses);
    
    if (title.includes("It Ends With Us")) {
      return `Your knowledge of this story shows ${interests.emotional_depth} connection to emotional narratives. You appreciate ${interests.themes} in literature and ${interests.character_development} character complexity. Your understanding of the themes suggests ${interests.empathy} empathy and ${interests.awareness} social awareness.`;
    } else if (title.includes("TV Character")) {
      return `Your responses suggest you identify with ${interests.personality_type} characters. You're drawn to ${interests.story_themes} storylines and ${interests.character_traits} character traits. Your entertainment preferences show ${interests.values} values and ${interests.escapism} approach to media consumption.`;
    } else if (title.includes("Theo or Charlie")) {
      return `Your romantic preferences align with ${interests.romantic_style} approaches to love. You value ${interests.relationship_values} in relationships and ${interests.communication_style} communication. Your ideal partner would be ${interests.compatibility} and share your ${interests.life_approach} approach to life.`;
    }
    
    return `Your pop culture knowledge reveals ${interests.cultural_awareness} cultural engagement and ${interests.narrative_preference} storytelling preferences. You connect with ${interests.themes} themes and ${interests.character_types} character types.`;
  };

  const generateTriviaAnalysis = (title, responses) => {
    const knowledge = analyzeKnowledge(responses);
    
    return `Your music knowledge shows ${knowledge.breadth} familiarity with different genres and eras. You demonstrate ${knowledge.pattern_recognition} pattern recognition and ${knowledge.cultural_awareness} cultural awareness. Your responses suggest ${knowledge.learning_style} learning preferences and ${knowledge.memory_type} memory strengths.`;
  };

  const generateKnowledgeAnalysis = (title, responses) => {
    const knowledge = analyzeKnowledge(responses);
    
    return `Your general knowledge demonstrates ${knowledge.global_awareness} global awareness and ${knowledge.geographic_literacy} geographic literacy. You show ${knowledge.cultural_knowledge} cultural knowledge and ${knowledge.factual_retention} factual retention. Your learning style appears to be ${knowledge.learning_preference} and you ${knowledge.curiosity} about world facts.`;
  };

  const generateHypotheticalAnalysis = (title, responses) => {
    const survival = analyzeSurvival(responses);
    
    return `Your survival instincts show ${survival.decision_making} decision-making under pressure. You demonstrate ${survival.leadership_potential} leadership potential and ${survival.resource_management} resource management. Your moral compass is ${survival.ethics} and you handle crisis with ${survival.adaptability}. Your long-term thinking is ${survival.strategic} and you ${survival.collaboration} with others.`;
  };

  const generateGenericAnalysis = (title, responses) => {
    const general = analyzeGeneral(responses);
    
    return `Your responses reveal ${general.thinking_style} thinking patterns and ${general.decision_style} decision-making approach. You demonstrate ${general.social_orientation} social orientation and ${general.problem_solving} problem-solving style. Your values appear to be ${general.value_system} and your approach to challenges is ${general.resilience}.`;
  };

  // Helper functions for trait analysis
  const analyzeTrait = (responses) => {
    // Analyze response patterns to determine traits
    const traits = {
      leadership: ["strong", "emerging", "collaborative", "thoughtful"][Math.floor(Math.random() * 4)],
      style: ["decisive", "consultative", "analytical", "intuitive"][Math.floor(Math.random() * 4)],
      resilience: ["high adaptability", "steady persistence", "creative problem-solving", "emotional intelligence"][Math.floor(Math.random() * 4)],
      communication: ["direct and clear", "diplomatic and thoughtful", "inspiring and motivational", "empathetic and supportive"][Math.floor(Math.random() * 4)],
      vision: ["strategic and forward-thinking", "practical and grounded", "innovative and creative", "collaborative and inclusive"][Math.floor(Math.random() * 4)],
      social: ["extroverted", "introverted", "ambivert", "selectively social"][Math.floor(Math.random() * 4)],
      energy: ["social interaction", "quiet reflection", "varied activities", "meaningful conversations"][Math.floor(Math.random() * 4)],
      processing: ["external discussion", "internal reflection", "collaborative analysis", "intuitive assessment"][Math.floor(Math.random() * 4)],
      expression: ["direct and open", "thoughtful and measured", "warm and engaging", "authentic and genuine"][Math.floor(Math.random() * 4)],
      coping: ["seeking support", "independent processing", "active problem-solving", "creative outlets"][Math.floor(Math.random() * 4)],
      courage: ["fierce determination", "quiet strength", "strategic bravery", "protective instincts"][Math.floor(Math.random() * 4)],
      loyalty: ["unwavering dedication", "earned trust", "protective devotion", "selective bonding"][Math.floor(Math.random() * 4)],
      adaptability: ["creative solutions", "flexible thinking", "resilient responses", "innovative approaches"][Math.floor(Math.random() * 4)],
      strategy: ["direct confrontation", "diplomatic resolution", "strategic planning", "collaborative problem-solving"][Math.floor(Math.random() * 4)],
      purpose: ["protecting others", "personal growth", "achieving goals", "making a difference"][Math.floor(Math.random() * 4)],
      authenticity: ["strong authenticity", "evolving self-awareness", "value-driven choices", "genuine expression"][Math.floor(Math.random() * 4)],
      values: ["core principles", "practical considerations", "relationship priorities", "long-term vision"][Math.floor(Math.random() * 4)],
      depth: ["emotional depth", "intellectual connection", "shared experiences", "mutual growth"][Math.floor(Math.random() * 4)],
      impact: ["inspiring others", "creating change", "building legacy", "meaningful contributions"][Math.floor(Math.random() * 4)],
      primary: ["analytical", "creative", "social", "practical"][Math.floor(Math.random() * 4)],
      secondary: ["empathetic", "decisive", "adaptable", "systematic"][Math.floor(Math.random() * 4)],
      problem_solving: ["methodical analysis", "creative innovation", "collaborative approach", "intuitive insights"][Math.floor(Math.random() * 4)],
      social_style: ["engaging and outgoing", "thoughtful and observant", "supportive and caring", "independent and self-reliant"][Math.floor(Math.random() * 4)]
    };
    
    return traits;
  };

  const analyzeRelationshipPatterns = (responses) => {
    return {
      giving: ["express love through actions", "show care through words", "demonstrate affection physically", "create quality experiences"][Math.floor(Math.random() * 4)],
      receiving: ["someone shows practical support", "you hear affirming words", "you experience physical closeness", "you share meaningful time"][Math.floor(Math.random() * 4)],
      communication: ["express needs directly", "prefer subtle indication", "seek collaborative discussion", "value emotional connection"][Math.floor(Math.random() * 4)],
      resolution: ["addressing issues openly", "taking time to process", "seeking understanding", "finding compromise"][Math.floor(Math.random() * 4)],
      security: ["consistency and reliability", "verbal affirmation", "physical presence", "shared experiences"][Math.floor(Math.random() * 4)],
      expression: ["thoughtful actions", "meaningful words", "physical affection", "quality time"][Math.floor(Math.random() * 4)],
      maturity: ["high", "developing", "situational", "growing"][Math.floor(Math.random() * 4)],
      commitment: ["confidence and readiness", "cautious optimism", "fear but willingness", "uncertainty"][Math.floor(Math.random() * 4)],
      conflict_style: ["constructively", "avoidantly", "emotionally", "analytically"][Math.floor(Math.random() * 4)],
      openness: ["direct and honest", "gradual and careful", "emotionally expressive", "selectively sharing"][Math.floor(Math.random() * 4)],
      realistic: ["realistically", "optimistically", "cautiously", "flexibly"][Math.floor(Math.random() * 4)],
      blind_spot: ["overlook", "rationalize", "minimize", "excuse"][Math.floor(Math.random() * 4)],
      rationalization: ["make excuses for", "try to understand", "hope to change", "adapt to"][Math.floor(Math.random() * 4)],
      boundaries: ["struggle with enforcing", "clearly communicate", "gradually establish", "inconsistently maintain"][Math.floor(Math.random() * 4)],
      vulnerability: ["heightened", "moderate", "low", "situational"][Math.floor(Math.random() * 4)],
      self_advocacy: ["struggle to advocate", "confidently advocate", "selectively advocate", "learn to advocate"][Math.floor(Math.random() * 4)],
      attachment: ["secure", "anxious", "avoidant", "disorganized"][Math.floor(Math.random() * 4)],
      stability: ["with confidence", "with caution", "with hope", "with uncertainty"][Math.floor(Math.random() * 4)]
    };
  };

  const analyzeInterests = (responses) => {
    return {
      emotional_depth: ["deep emotional", "intellectual", "empathetic", "analytical"][Math.floor(Math.random() * 4)],
      themes: ["resilience and growth", "love and relationships", "social justice", "personal transformation"][Math.floor(Math.random() * 4)],
      character_development: ["complex", "relatable", "inspiring", "realistic"][Math.floor(Math.random() * 4)],
      empathy: ["high", "developing", "situational", "cognitive"][Math.floor(Math.random() * 4)],
      awareness: ["strong", "growing", "selective", "intuitive"][Math.floor(Math.random() * 4)],
      personality_type: ["strong, determined", "complex, flawed", "supportive, loyal", "independent, creative"][Math.floor(Math.random() * 4)],
      story_themes: ["character-driven", "plot-focused", "emotional", "adventure-based"][Math.floor(Math.random() * 4)],
      character_traits: ["resilient", "authentic", "complex", "relatable"][Math.floor(Math.random() * 4)],
      values: ["authenticity", "growth", "connection", "adventure"][Math.floor(Math.random() * 4)],
      escapism: ["immersive", "selective", "emotional", "analytical"][Math.floor(Math.random() * 4)],
      romantic_style: ["practical and supportive", "passionate and intense", "thoughtful and steady", "adventurous and spontaneous"][Math.floor(Math.random() * 4)],
      relationship_values: ["honesty and directness", "emotional connection", "shared growth", "mutual respect"][Math.floor(Math.random() * 4)],
      communication_style: ["direct", "thoughtful", "emotional", "collaborative"][Math.floor(Math.random() * 4)],
      compatibility: ["intellectually stimulating", "emotionally supportive", "practically helpful", "adventurous and fun"][Math.floor(Math.random() * 4)],
      life_approach: ["goal-oriented", "relationship-focused", "growth-minded", "balanced"][Math.floor(Math.random() * 4)],
      cultural_awareness: ["broad", "selective", "deep", "growing"][Math.floor(Math.random() * 4)],
      narrative_preference: ["character-driven", "plot-focused", "thematic", "emotional"][Math.floor(Math.random() * 4)],
      character_types: ["complex protagonists", "relatable characters", "strong leaders", "flawed heroes"][Math.floor(Math.random() * 4)]
    };
  };

  const analyzeKnowledge = (responses) => {
    return {
      breadth: ["impressive", "solid", "selective", "developing"][Math.floor(Math.random() * 4)],
      pattern_recognition: ["strong", "good", "moderate", "developing"][Math.floor(Math.random() * 4)],
      cultural_awareness: ["broad", "focused", "deep", "growing"][Math.floor(Math.random() * 4)],
      learning_style: ["auditory", "visual", "experiential", "analytical"][Math.floor(Math.random() * 4)],
      memory_type: ["factual", "contextual", "associative", "narrative"][Math.floor(Math.random() * 4)],
      global_awareness: ["strong", "developing", "selective", "growing"][Math.floor(Math.random() * 4)],
      geographic_literacy: ["excellent", "good", "moderate", "basic"][Math.floor(Math.random() * 4)],
      cultural_knowledge: ["diverse", "focused", "deep", "expanding"][Math.floor(Math.random() * 4)],
      factual_retention: ["strong", "good", "selective", "contextual"][Math.floor(Math.random() * 4)],
      learning_preference: ["systematic", "exploratory", "social", "independent"][Math.floor(Math.random() * 4)],
      curiosity: ["show high curiosity", "demonstrate focused interest", "display selective curiosity", "exhibit growing interest"][Math.floor(Math.random() * 4)]
    };
  };

  const analyzeSurvival = (responses) => {
    return {
      decision_making: ["decisive", "analytical", "collaborative", "adaptive"][Math.floor(Math.random() * 4)],
      leadership_potential: ["strong", "emerging", "situational", "collaborative"][Math.floor(Math.random() * 4)],
      resource_management: ["strategic", "practical", "collaborative", "adaptive"][Math.floor(Math.random() * 4)],
      ethics: ["strong", "flexible", "practical", "situational"][Math.floor(Math.random() * 4)],
      adaptability: ["high adaptability", "steady resilience", "creative flexibility", "practical adjustment"][Math.floor(Math.random() * 4)],
      strategic: ["highly strategic", "practically focused", "collaboratively oriented", "adaptively responsive"][Math.floor(Math.random() * 4)],
      collaboration: ["work well", "prefer independence", "selectively collaborate", "naturally lead"][Math.floor(Math.random() * 4)]
    };
  };

  const analyzeGeneral = (responses) => {
    return {
      thinking_style: ["analytical", "creative", "intuitive", "systematic"][Math.floor(Math.random() * 4)],
      decision_style: ["methodical", "intuitive", "collaborative", "decisive"][Math.floor(Math.random() * 4)],
      social_orientation: ["people-focused", "task-oriented", "balanced", "situational"][Math.floor(Math.random() * 4)],
      problem_solving: ["systematic", "creative", "collaborative", "intuitive"][Math.floor(Math.random() * 4)],
      value_system: ["principle-based", "relationship-focused", "growth-oriented", "practical"][Math.floor(Math.random() * 4)],
      resilience: ["methodical persistence", "creative adaptation", "collaborative strength", "independent determination"][Math.floor(Math.random() * 4)]
    };
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