import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowTextProps {
  children: ReactNode;
  variant?: 'gradient' | 'glow' | 'shimmer' | 'pulse';
  color?: 'indigo' | 'emerald' | 'cyan' | 'pink' | 'amber' | 'multi';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';
}

const colorStyles = {
  indigo: {
    gradient: 'from-indigo-400 via-indigo-500 to-purple-500',
    glow: 'text-indigo-400',
    shadow: '0 0 20px rgba(99,102,241,0.5), 0 0 40px rgba(99,102,241,0.3)',
  },
  emerald: {
    gradient: 'from-emerald-400 via-emerald-500 to-teal-500',
    glow: 'text-emerald-400',
    shadow: '0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.3)',
  },
  cyan: {
    gradient: 'from-cyan-400 via-cyan-500 to-blue-500',
    glow: 'text-cyan-400',
    shadow: '0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.3)',
  },
  pink: {
    gradient: 'from-pink-400 via-pink-500 to-rose-500',
    glow: 'text-pink-400',
    shadow: '0 0 20px rgba(236,72,153,0.5), 0 0 40px rgba(236,72,153,0.3)',
  },
  amber: {
    gradient: 'from-amber-400 via-amber-500 to-orange-500',
    glow: 'text-amber-400',
    shadow: '0 0 20px rgba(245,158,11,0.5), 0 0 40px rgba(245,158,11,0.3)',
  },
  multi: {
    gradient: 'from-indigo-400 via-purple-500 to-pink-500',
    glow: 'text-white',
    shadow: '0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(236,72,153,0.3)',
  },
};

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
};

const weights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const shimmerVariants: Variants = {
  initial: { backgroundPosition: '200% center' },
  animate: {
    backgroundPosition: '-200% center',
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

const pulseVariants: Variants = {
  initial: { opacity: 0.7 },
  animate: {
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export function GlowText({
  children,
  variant = 'gradient',
  color = 'indigo',
  size = 'md',
  weight = 'semibold',
  className = '',
  as: Component = 'span',
}: GlowTextProps) {
  const styles = colorStyles[color];

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return `bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent`;
      case 'glow':
        return `${styles.glow}`;
      case 'shimmer':
        return `bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent bg-[length:200%_100%]`;
      case 'pulse':
        return styles.glow;
      default:
        return '';
    }
  };

  const baseStyles = `
    ${sizes[size]}
    ${weights[weight]}
    ${getVariantStyles()}
    ${className}
  `;

  if (variant === 'glow') {
    return (
      <Component className={baseStyles} style={{ textShadow: styles.shadow }}>
        {children}
      </Component>
    );
  }

  if (variant === 'shimmer') {
    return (
      <motion.span
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className={baseStyles}
      >
        {children}
      </motion.span>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.span
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className={baseStyles}
        style={{ textShadow: styles.shadow }}
      >
        {children}
      </motion.span>
    );
  }

  return <Component className={baseStyles}>{children}</Component>;
}

// Animated Counter
export function AnimatedNumber({
  value,
  duration = 1,
  prefix = '',
  suffix = '',
  ...props
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
} & Omit<GlowTextProps, 'children'>) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      <GlowText {...props}>
        {prefix}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
        >
          {value.toLocaleString()}
        </motion.span>
        {suffix}
      </GlowText>
    </motion.span>
  );
}