import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CommentCard from "@/components/molecules/CommentCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { commentService } from "@/services/api/commentService";

const CommentSection = ({ quizId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [quizId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentService.getByQuizId(quizId);
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const comment = await commentService.create({
        quizId,
        text: newComment,
        userId: "user-1" // Mock user ID
      });
      setComments([comment, ...comments]);
      setNewComment("");
      toast.success("Comment posted successfully!");
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (commentId) => {
    try {
      await commentService.upvote(commentId);
      setComments(comments.map(comment => 
        comment.Id === commentId 
          ? { ...comment, upvotes: comment.upvotes + 1 }
          : comment
      ));
    } catch (err) {
      toast.error("Failed to upvote comment");
    }
  };

  const handleRetry = () => {
    loadComments();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this quiz..."
          className="w-full p-4 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          rows="3"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <Empty
          title="No comments yet"
          description="Be the first to share your thoughts about this quiz!"
          icon="MessageCircle"
        />
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CommentCard
                comment={comment}
                onUpvote={handleUpvote}
                onReply={() => {}}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;