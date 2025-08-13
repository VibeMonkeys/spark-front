import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, Camera, Image, Star, MapPin, Clock, Send } from "lucide-react";

interface MissionVerificationProps {
  onBack: () => void;
  onSubmit: () => void;
}

const missionData = {
  title: "가보지 않은 길로 퇴근하기",
  category: "모험적",
  points: 20,
  categoryColor: "bg-orange-500"
};

export function MissionVerification({ onBack, onSubmit }: MissionVerificationProps) {
  const [story, setStory] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImageUpload = () => {
    // 실제 구현에서는 파일 업로드 로직이 들어갈 것
    const dummyImages = [
      "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzZWFyY2h8MXx8eW91bmclMjBwZW9wbGUlMjBhZHZlbnR1cmUlMjBkYWlseSUyMG1pc3Npb258ZW58MXx8fHwxNzU1MDg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1549185545-f5b8a1fc481a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRhaWx5JTIwYWN0aXZpdHl8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ];
    setSelectedImages(dummyImages.slice(0, 2));
  };

  const handleSubmit = () => {
    if (story.trim() || selectedImages.length > 0) {
      onSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">미션 인증</h1>
            <p className="text-xs text-muted-foreground">경험을 공유해주세요</p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Mission Summary */}
        <div className="py-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${missionData.categoryColor} text-white border-0 text-xs`}>
                      {missionData.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">완료!</span>
                  </div>
                  <h3 className="font-semibold text-sm">{missionData.title}</h3>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600">
                    <Star className="size-4 fill-current" />
                    <span className="font-semibold">+{missionData.points}P</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photo Upload Section */}
        <section className="mb-6">
          <h3 className="font-semibold mb-3">사진 업로드 (선택)</h3>
          
          {selectedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={image}
                    alt={`업로드된 사진 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 size-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setSelectedImages(images => images.filter((_, i) => i !== index))}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleImageUpload}
              className="h-20 flex-col gap-2 bg-white/60 backdrop-blur-sm border-dashed"
            >
              <Camera className="size-5" />
              <span className="text-sm">카메라</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleImageUpload}
              className="h-20 flex-col gap-2 bg-white/60 backdrop-blur-sm border-dashed"
            >
              <Image className="size-5" />
              <span className="text-sm">갤러리</span>
            </Button>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-6">
          <h3 className="font-semibold mb-3">경험 스토리</h3>
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <Textarea
                placeholder="어떤 경험을 하셨나요? 새롭게 발견한 것이나 느낀 점을 자유롭게 적어주세요! (50-500자)"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="min-h-[120px] resize-none border-0 bg-transparent focus:ring-0 focus:border-0 p-0 placeholder:text-muted-foreground/60"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">
                  {story.length}/500자
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {isPublic ? "공개" : "비공개"}
                  </span>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                    className="scale-75"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Auto Tags */}
        <section className="mb-6">
          <h3 className="font-semibold mb-3">자동 태그</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <MapPin className="size-3 mr-1" />
              강남구
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Clock className="size-3 mr-1" />
              저녁시간
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              #새로운길
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              #모험
            </Badge>
          </div>
        </section>

        {/* Submit Button */}
        <div className="sticky bottom-20 pb-4">
          <Button
            onClick={handleSubmit}
            disabled={!story.trim() && selectedImages.length === 0}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 disabled:opacity-50"
            size="lg"
          >
            <Send className="size-4 mr-2" />
            미션 완료하기
          </Button>
        </div>
      </div>
    </div>
  );
}