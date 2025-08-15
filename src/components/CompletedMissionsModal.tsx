import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { missionApi } from '../shared/api';
import { useAuth } from '../contexts/AuthContext';

interface CompletedMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompletedMissionsModal({ isOpen, onClose }: CompletedMissionsModalProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const { data: completedMissionsData, isLoading } = useQuery({
    queryKey: ['missions-completed-all', user?.id, currentPage],
    queryFn: () => missionApi.getCompletedMissions(user!.id, currentPage, pageSize),
    enabled: !!user?.id && isOpen,
  });

  const missions = completedMissionsData?.items || [];
  const pageInfo = completedMissionsData?.page_info;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    if (pageInfo?.has_next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">완료한 미션</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          ) : missions.length > 0 ? (
            <div className="space-y-3">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <ImageWithFallback
                    src={mission.image_url || "https://images.unsplash.com/photo-1584515501397-335d595b2a17?w=400"}
                    alt={mission.title}
                    className="size-12 rounded-lg object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate mb-1">
                      {mission.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        {mission.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Star className="size-3 fill-current" />
                        <span className="text-xs font-medium">+{mission.reward_points}P</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {mission.completed_at ? 
                        new Date(mission.completed_at).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric'
                        }) : '완료됨'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">완료한 미션이 없습니다.</p>
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        {pageInfo && pageInfo.total_pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500">
              {currentPage + 1} / {pageInfo.total_pages} 페이지
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={!pageInfo.has_previous}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!pageInfo.has_next}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}