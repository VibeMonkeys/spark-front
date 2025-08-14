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
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800',
    buttonColor: 'bg-green-600 hover:bg-green-700'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
    buttonColor: 'bg-red-600 hover:bg-red-700'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-800',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800',
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-sm mx-auto transform transition-all duration-300 ease-out",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4"
      )}>
        <div className={cn(
          "rounded-2xl border-2 shadow-xl bg-white",
          config.bgColor,
          config.borderColor
        )}>
          {/* Header */}
          <div className="flex items-start gap-3 p-4 pb-3">
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
              config.bgColor
            )}>
              <IconComponent className={cn("w-5 h-5", config.iconColor)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-lg font-bold leading-6 mb-1",
                config.titleColor
              )}>
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-4 pt-2">
            {showCancel && (
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
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
                "flex-1 text-white font-semibold",
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