import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary hover:to-purple-600 glow",
    secondary: "bg-surface text-white border border-white/10 hover:border-white/20 glass",
    success: "bg-gradient-to-r from-success to-emerald-600 text-white hover:from-success hover:to-emerald-700 glow-green",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-error hover:to-red-700",
    ghost: "bg-transparent text-white/80 hover:text-white hover:bg-white/10",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;