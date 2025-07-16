import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = forwardRef(({ 
  className, 
  value = 0, 
  max = 100, 
  ...props 
}, ref) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      ref={ref}
      className={cn(
        "w-full bg-surface rounded-full h-2 overflow-hidden border border-white/10",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-primary to-secondary"
      />
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;