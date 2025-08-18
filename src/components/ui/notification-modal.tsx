import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle, Trophy, Sparkles, Zap, Target } from 'lucide-react';
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
    icon: Trophy,
    bgGradient: 'bg-gradient-to-br from-purple-400 via-blue-500 to-pink-500',
    cardBg: 'bg-white/98',
    iconBg: 'bg-gradient-to-br from-purple-600 to-blue-600',
    iconColor: 'text-white',
    titleColor: 'text-gray-800',
    progressColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
    particles: true
  },
  error: {
    icon: XCircle,
    bgGradient: 'bg-gradient-to-br from-red-400 via-pink-500 to-red-600',
    cardBg: 'bg-white/95',
    iconBg: 'bg-gradient-to-br from-red-400 to-pink-500',
    iconColor: 'text-white',
    titleColor: 'text-gray-800',
    progressColor: 'bg-gradient-to-r from-red-400 to-pink-500',
    particles: false
  },
  warning: {
    icon: AlertTriangle,
    bgGradient: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
    cardBg: 'bg-white/95',
    iconBg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    iconColor: 'text-white',
    titleColor: 'text-gray-800',
    progressColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    particles: false
  },
  info: {
    icon: Info,
    bgGradient: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600',
    cardBg: 'bg-white/95',
    iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    iconColor: 'text-white',
    titleColor: 'text-gray-800',
    progressColor: 'bg-gradient-to-r from-blue-400 to-cyan-500',
    particles: false
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
  // type 유효성 검사 및 기본값 설정
  const validType = type && typeConfig[type] ? type : 'info';
  const config = typeConfig[validType];
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Animated Background */}
      <div 
        className={cn(
          "absolute inset-0 backdrop-blur-md transition-all duration-500",
          config.bgGradient,
          "opacity-90"
        )}
        onClick={onClose}
      />
      
      {/* Enhanced Floating Particles for Success */}
      {config.particles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            >
              {i % 3 === 0 ? (
                <Zap 
                  className="w-3 h-3 text-yellow-300/60" 
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(255,255,0,0.4))'
                  }}
                />
              ) : i % 3 === 1 ? (
                <Trophy 
                  className="w-3 h-3 text-purple-300/50" 
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(147,51,234,0.4))'
                  }}
                />
              ) : (
                <Sparkles 
                  className="w-4 h-4 text-white/50" 
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-sm mx-auto transform transition-all duration-500 ease-out",
        "animate-in fade-in-0 zoom-in-90 slide-in-from-top-8",
        "hover:scale-105"
      )}>
        <div className={cn(
          "rounded-3xl shadow-2xl border-0 overflow-hidden backdrop-blur-xl",
          config.cardBg,
          "ring-1 ring-white/20"
        )}>
          {/* Animated Header */}
          <div className="relative p-8 pb-6">
            {/* Background Glow Effect */}
            <div className={cn(
              "absolute top-0 left-0 right-0 h-32 opacity-10",
              config.bgGradient
            )} />
            
            <div className="relative flex items-start gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className={cn(
                  "w-18 h-18 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white",
                  config.iconBg,
                  "animate-bounce"
                )}>
                  <IconComponent className={cn("w-10 h-10", config.iconColor)} />
                </div>
                
                {/* Enhanced Glow Rings */}
                <div className={cn(
                  "absolute inset-0 w-18 h-18 rounded-3xl opacity-40 animate-ping",
                  config.iconBg
                )} />
                <div className={cn(
                  "absolute -inset-1 w-20 h-20 rounded-3xl opacity-20 animate-ping",
                  config.iconBg
                )} style={{animationDelay: '0.5s'}} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "text-xl font-bold leading-7 mb-3",
                  config.titleColor
                )}>
                  {title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white/80 hover:bg-white transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          {autoClose && (
            <div className="px-8 pb-8">
              <div className="relative">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>자동으로 닫힙니다</span>
                  <span>{Math.ceil(autoCloseDelay / 1000)}초</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full w-full origin-left shadow-sm",
                      config.progressColor
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotificationModal;