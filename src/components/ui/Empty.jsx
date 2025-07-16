import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet", 
  icon = "Inbox",
  actionLabel,
  actionPath,
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary" />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-gray-300 mb-2">
        {title}
      </h3>
      <p className="text-gray-400 mb-8 max-w-md">{description}</p>
      
      {(actionLabel && (actionPath || onAction)) && (
        <div>
          {actionPath ? (
            <Link to={actionPath}>
              <Button variant="primary" className="flex items-center gap-2">
                <ApperIcon name="Plus" size={16} />
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={onAction}
              variant="primary" 
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={16} />
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Empty;