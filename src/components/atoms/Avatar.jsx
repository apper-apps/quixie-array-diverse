import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ 
  className, 
  src, 
  alt, 
  size = "default", 
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-8 h-8",
    default: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white font-medium">
          {alt?.[0]?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;