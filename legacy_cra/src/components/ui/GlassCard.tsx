import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'hover' | 'glow' | 'interactive';
  glowColor?: 'indigo' | 'emerald' | 'cyan' | 'pink';
  className?: string;
  onClick?: () => void;
}

const glowStyles = {
  indigo: 'shadow-[0_0_20px_rgba(99,102,241,0.3),0_0_60px_rgba(99,102,241,0.1)]',
  emerald: 'shadow-[0_0_20px_rgba(16,185,129,0.3),0_0_60px_rgba(16,185,129,0.1)]',
  cyan: 'shadow-[0_0_20px_rgba(34,211,238,0.3),0_0_60px_rgba(34,211,238,0.1)]',
  pink: 'shadow-[0_0_20px_rgba(236,72,153,0.3),0_0_60px_rgba(236,72,153,0.1)]',
};

export function GlassCard({
  children,
  variant = 'default',
  glowColor = 'indigo',
  className = '',
  onClick,
  ...props
}: GlassCardProps) {
  const baseStyles = `
    relative overflow-hidden
    bg-white/[0.03] backdrop-blur-3xl
    border border-white/10
    rounded-3xl
  `;

  const variants = {
    default: '',
    hover: 'transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20',
    glow: glowStyles[glowColor],
    interactive: `
      cursor-pointer transition-all duration-300
      hover:bg-white/[0.06] hover:border-white/20 hover:scale-[1.02]
      active:scale-[0.98]
    `,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0.2 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Glass Card Header
export function GlassCardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-white/10 ${className}`}>
      {children}
    </div>
  );
}

// Glass Card Content
export function GlassCardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// Glass Card Footer
export function GlassCardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-t border-white/10 ${className}`}>
      {children}
    </div>
  );
}