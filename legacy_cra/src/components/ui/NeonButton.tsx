import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: 'indigo' | 'emerald' | 'cyan' | 'pink' | 'amber';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const colors = {
  indigo: {
    bg: 'bg-indigo-500',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(99,102,241,0.3)]',
    hover: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.6),0_0_60px_rgba(99,102,241,0.4)]',
  },
  emerald: {
    bg: 'bg-emerald-500',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5),0_0_40px_rgba(16,185,129,0.3)]',
    hover: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.6),0_0_60px_rgba(16,185,129,0.4)]',
  },
  cyan: {
    bg: 'bg-cyan-500',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.5),0_0_40px_rgba(34,211,238,0.3)]',
    hover: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.6),0_0_60px_rgba(34,211,238,0.4)]',
  },
  pink: {
    bg: 'bg-pink-500',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.5),0_0_40px_rgba(236,72,153,0.3)]',
    hover: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.6),0_0_60px_rgba(236,72,153,0.4)]',
  },
  amber: {
    bg: 'bg-amber-500',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5),0_0_40px_rgba(245,158,11,0.3)]',
    hover: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.6),0_0_60px_rgba(245,158,11,0.4)]',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

export function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  glowColor = 'indigo',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: NeonButtonProps) {
  const baseStyles = `
    relative inline-flex items-center justify-center
    font-semibold rounded-2xl
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      ${colors[glowColor].bg}
      text-white
      ${colors[glowColor].glow}
      ${colors[glowColor].hover}
      hover:scale-105
      active:scale-95
    `,
    secondary: `
      bg-white/5
      text-white
      border border-white/10
      hover:bg-white/10 hover:border-white/20
      active:scale-95
    `,
    ghost: `
      bg-transparent
      text-white/70
      hover:text-white hover:bg-white/5
      active:scale-95
    `,
    danger: `
      bg-red-500
      text-white
      shadow-[0_0_20px_rgba(239,68,68,0.5)]
      hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]
      hover:scale-105
      active:scale-95
    `,
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.div
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}

// Icon Button variant
export function NeonIconButton({
  children,
  variant = 'primary',
  size = 'md',
  glowColor = 'indigo',
  className = '',
  ...props
}: Omit<NeonButtonProps, 'leftIcon' | 'rightIcon' | 'fullWidth'>) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <NeonButton
      variant={variant}
      size={size}
      glowColor={glowColor}
      className={`${sizeMap[size]} !p-0 !gap-0 rounded-xl ${className}`}
      {...props}
    >
      {children}
    </NeonButton>
  );
}