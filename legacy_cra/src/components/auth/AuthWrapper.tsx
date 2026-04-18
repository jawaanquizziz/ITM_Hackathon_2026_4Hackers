import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthWrapper = ({ children, fallback }: AuthWrapperProps) => {
  const { isInitialized, isLoading, user } = useAuthStore();

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return fallback || null;
  }

  return <>{children}</>;
};

export const AuthGate = ({ children, onUnauthenticated }: {
  children: React.ReactNode;
  onUnauthenticated: () => void;
}) => {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    onUnauthenticated();
    return null;
  }

  return <>{children}</>;
};