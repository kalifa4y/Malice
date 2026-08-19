import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, glowColor, hoverEffect = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl",
          hoverEffect && "transition-all duration-500 hover:bg-black/60",
          className
        )}
        style={{
          boxShadow: glowColor ? `0 4px 30px ${glowColor}` : '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10 h-full w-full flex flex-col justify-between">
          {children}
        </div>
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
