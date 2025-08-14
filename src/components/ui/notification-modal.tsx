import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { cn } from './utils';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800',
    buttonColor: 'bg-green-100 hover:bg-green-200 text-green-800'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
    buttonColor: 'bg-red-100 hover:bg-red-200 text-red-800'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-800',
    buttonColor: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800',
    buttonColor: 'bg-blue-100 hover:bg-blue-200 text-blue-800'
  }
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  autoClose = true,
  autoCloseDelay = 3000
}) => {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

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
          "rounded-2xl border-2 shadow-xl",
          config.bgColor,
          config.borderColor
        )}>
          {/* Header */}
          <div className="flex items-start gap-4 p-6 pb-4">
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              config.iconColor
            )}>
              <IconComponent className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-lg font-semibold leading-6",
                config.titleColor
              )}>
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className={cn(
                "flex-shrink-0 rounded-full p-1 transition-colors duration-200",
                config.buttonColor
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Footer with auto-close indicator */}
          {autoClose && (
            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex-1 bg-gray-200 rounded-full h-1 overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full w-full origin-left",
                      type === 'success' ? 'bg-green-400' :
                      type === 'error' ? 'bg-red-400' :
                      type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                    )}
                    style={{
                      animation: `shrinkWidth ${autoCloseDelay}ms linear forwards`
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrinkWidth {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationModal;