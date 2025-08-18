import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-100',
    titleColor: 'text-gray-900',
    buttonColor: 'bg-green-600 hover:bg-green-700'
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-100',
    titleColor: 'text-gray-900',
    buttonColor: 'bg-red-600 hover:bg-red-700'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-100',
    titleColor: 'text-gray-900',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
    titleColor: 'text-gray-900',
    buttonColor: 'bg-blue-600 hover:bg-blue-700'
  }
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  showCancel = true
}) => {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-sm mx-auto transform transition-all duration-300 ease-out",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-6"
      )}>
        <div className="rounded-2xl shadow-2xl bg-white border-0 overflow-hidden">
          {/* Header */}
          <div className="p-5 pb-3">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                config.iconBg
              )}>
                <IconComponent className={cn("w-5 h-5", config.iconColor)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "text-lg font-bold leading-6 mb-2",
                  config.titleColor
                )}>
                  {title}
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                  {typeof message === 'string' ? (
                    <p>{message}</p>
                  ) : (
                    message
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 p-5 pt-2 bg-gray-50/30">
            {showCancel && (
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 font-medium border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              >
                {cancelText}
              </Button>
            )}
            <Button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className={cn(
                "flex-1 h-10 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200",
                config.buttonColor
              )}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;