import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const CommentCard = ({ comment, onUpvote, onReply, className }) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted);
    onUpvote(comment.Id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-surface/50 rounded-lg p-4 border border-white/5", className)}
    >
      <div className="flex items-start gap-3">
        <Avatar size="sm" alt={comment.user?.username} />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white">{comment.user?.username}</span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-gray-300 mb-3">{comment.text}</p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              className={cn(
                "flex items-center gap-1 text-sm",
                isUpvoted ? "text-primary" : "text-gray-400"
              )}
            >
              <ApperIcon name="ChevronUp" size={16} />
              <span>{comment.upvotes + (isUpvoted ? 1 : 0)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-sm text-gray-400"
            >
              <ApperIcon name="MessageCircle" size={16} />
              <span>Reply</span>
            </Button>
          </div>
          
          {showReply && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 pl-4 border-l border-white/10"
            >
              <p className="text-sm text-gray-400 mb-2">Reply to {comment.user?.username}</p>
              <textarea
                className="w-full p-2 bg-background border border-white/10 rounded text-sm text-white placeholder-gray-400 focus:border-primary focus:outline-none resize-none"
                placeholder="Write your reply..."
                rows="2"
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="primary">Post Reply</Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setShowReply(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommentCard;