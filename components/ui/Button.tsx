import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-[#C6A84B] text-[#0E1117] hover:bg-[#B89A3F] active:bg-[#A88C3A] focus-visible:ring-[#C6A84B] border border-transparent",
    secondary: "bg-white text-[#1A1714] border border-[#E2DDD4] hover:bg-[#F8F6F1] active:bg-[#F0EDE6] focus-visible:ring-[#C6A84B]",
    ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80 border border-transparent",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
