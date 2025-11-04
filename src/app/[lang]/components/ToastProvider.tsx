"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, type, message, duration };
    
    setToasts((prev) => [...prev, toast]);

    // Vibration légère pour feedback haptique
    if (navigator.vibrate) {
      navigator.vibrate(type === 'error' ? [10, 30, 10] : 10);
    }

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, duration?: number) => {
    showToast('success', message, duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast('error', message, duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast('info', message, duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast('warning', message, duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const { id, type, message } = toast;

  const styles = {
    success: {
      bg: 'bg-green-500/10 border-green-500/50',
      text: 'text-green-400',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/50',
      text: 'text-red-400',
      icon: XCircle,
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/50',
      text: 'text-blue-400',
      icon: Info,
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/50',
      text: 'text-yellow-400',
      icon: AlertTriangle,
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.text} border backdrop-blur-lg rounded-xl p-4 shadow-lg animate-[slideInFromRight_0.3s_ease-out] flex items-start gap-3`}
      role="alert"
    >
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium text-white">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-white/60 hover:text-white transition-colors cursor-pointer active:scale-90 touch-manipulation p-1"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ToastProvider;
