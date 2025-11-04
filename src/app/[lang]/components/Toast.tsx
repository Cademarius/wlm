"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    color: "#10B981",
    bgGradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/50",
  },
  error: {
    icon: XCircle,
    color: "#EF4444",
    bgGradient: "from-red-500/20 to-rose-500/20",
    borderColor: "border-red-500/50",
  },
  warning: {
    icon: AlertCircle,
    color: "#F59E0B",
    bgGradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/50",
  },
  info: {
    icon: AlertCircle,
    color: "#3B82F6",
    bgGradient: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/50",
  },
};

export default function Toast({
  message,
  type = "info",
  isVisible,
  onClose,
  duration = 4000,
}: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-[9999] max-w-md"
        >
          <div
            className={`bg-gradient-to-r ${config.bgGradient} backdrop-blur-lg border ${config.borderColor} rounded-2xl shadow-2xl p-4 flex items-start gap-3`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <Icon size={24} color={config.color} />
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-relaxed">
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors duration-200 mt-0.5"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          {duration > 0 && (
            <motion.div
              className="h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full mt-1"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
