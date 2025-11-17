import React from "react";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  progress = 0, 
  className,
  size = "md",
  showPercentage = true,
  animated = true,
  variant = "primary"
}) => {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3", 
    lg: "h-4"
  };

  const variants = {
    primary: "from-primary to-accent",
    success: "from-success to-green-600",
    warning: "from-warning to-orange-600",
    error: "from-error to-red-600"
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("space-y-1", className)}>
      {showPercentage && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-800">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "progress-fill h-full rounded-full transition-all duration-300 ease-out",
            `bg-gradient-to-r ${variants[variant]}`,
            animated && clampedProgress > 0 && "animate-pulse"
          )}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && clampedProgress > 0 && clampedProgress < 100 && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;