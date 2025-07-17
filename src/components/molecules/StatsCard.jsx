import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const StatsCard = ({ title, value, subtitle, icon, trend, className }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={className}
    >
      <Card className="text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-full">
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        </div>
<h3 className="text-2xl font-bold gradient-text mb-1">{value}</h3>
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        
        {subtitle && (
          <p className="text-xs text-gray-700">{subtitle}</p>
        )}
        {trend && (
          <div className={cn(
            "flex items-center justify-center gap-1 mt-2 text-xs",
            trend.type === "up" ? "text-success" : "text-error"
          )}>
            <ApperIcon 
              name={trend.type === "up" ? "TrendingUp" : "TrendingDown"} 
              size={12} 
            />
            <span>{trend.value}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default StatsCard;