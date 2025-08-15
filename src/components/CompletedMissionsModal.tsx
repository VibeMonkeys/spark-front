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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">완료한 미션</h2>
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
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : missions.length > 0 ? (
            <div className="space-y-4">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <ImageWithFallback
                    src={mission.image_url || "https://images.unsplash.com/photo-1584515501397-335d595b2a17?w=400"}
                    alt={mission.title}
                    className="size-16 rounded-xl object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {mission.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {mission.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {mission.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {mission.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-blue-600 mb-2">
                      <Star className="size-4 fill-current" />
                      <span className="text-sm font-medium">+{mission.reward_points}P</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {mission.completed_at ? 
                        new Date(mission.completed_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
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
            <div className="text-center py-12">
              <p className="text-gray-500">완료한 미션이 없습니다.</p>
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        {pageInfo && pageInfo.total_pages > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-600">
              {pageInfo.total_elements}개 미션 중 {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, pageInfo.total_elements)}개 표시
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={!pageInfo.has_previous}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium px-3">
                {currentPage + 1} / {pageInfo.total_pages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!pageInfo.has_next}
                className="h-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}