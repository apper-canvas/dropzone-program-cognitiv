import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-primary/50",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-300",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-error/50"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm space-x-1.5",
    md: "px-4 py-2.5 text-sm space-x-2",
    lg: "px-6 py-3 text-base space-x-2.5",
    xl: "px-8 py-4 text-lg space-x-3"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled && "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
      ) : (
        icon && iconPosition === "left" && (
          <ApperIcon name={icon} className="w-4 h-4" />
        )
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="w-4 h-4" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;