import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Info, Smartphone, Shield, Users, Heart, ExternalLink, FileText, ChevronRight } from 'lucide-react';

interface AppInfoPageProps {
  onBack: () => void;
}

export function AppInfoPage({ onBack }: AppInfoPageProps) {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleShowTerms = () => {
    setShowTerms(true);
  };

  const handleShowPrivacy = () => {
    setShowPrivacy(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              앱 정보
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {/* App Overview */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 size-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <CardTitle className="text-2xl">SPARK</CardTitle>
            <CardDescription>더 나은 일상을 위한 미션 앱</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-gray-600 leading-relaxed">
              매일 새로운 도전과 경험을 통해 
              더 활발하고 의미있는 삶을 만들어보세요.
            </p>
          </CardContent>
        </Card>

        {/* Version Info */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="size-5 text-blue-500" />
              버전 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">앱 버전</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">빌드 번호</span>
              <span className="text-sm font-medium">202508160001</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">최종 업데이트</span>
              <span className="text-sm font-medium">2025년 8월 16일</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">플랫폼</span>
              <span className="text-sm font-medium">React Web App</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">지원 OS</span>
              <span className="text-sm font-medium">iOS, Android, Web</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">최소 요구사항</span>
              <span className="text-sm font-medium">모던 브라우저</span>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="size-5 text-green-500" />
              주요 기능
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="size-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">랜덤 미션 시스템</h4>
                  <p className="text-xs text-gray-500">다양한 카테고리의 흥미진진한 미션</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="size-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-600">2</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">포인트 & 리워드</h4>
                  <p className="text-xs text-gray-500">미션 완료로 포인트 획득 및 상품 교환</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="size-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">성장 시스템</h4>
                  <p className="text-xs text-gray-500">레벨업, 업적, 연속 수행일 관리</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="size-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-orange-600">4</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">개인화 설정</h4>
                  <p className="text-xs text-gray-500">프로필 관리 및 맞춤 설정</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="size-5 text-purple-500" />
              개발팀 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">개발회사</span>
              <span className="text-sm font-medium">Monkeys Studio</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">팀장</span>
              <span className="text-sm font-medium">지나니</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">개발 시작일</span>
              <span className="text-sm font-medium">2025년 8월</span>
            </div>
          </CardContent>
        </Card>

        {/* Legal Links */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="size-5 text-gray-500" />
              약관 및 정책
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={handleShowTerms}
            >
              <span className="text-sm">이용약관</span>
              <ChevronRight className="size-4" />
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={handleShowPrivacy}
            >
              <span className="text-sm">개인정보처리방침</span>
              <ChevronRight className="size-4" />
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3"
              onClick={() => handleOpenLink('#')}
            >
              <span className="text-sm">오픈소스 라이선스</span>
              <ExternalLink className="size-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="border-0 bg-gradient-to-r from-pink-50 to-purple-50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Heart className="size-6 text-red-500 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-800 mb-1">
              Made with ❤️ by Monkeys Studio
            </h4>
            <p className="text-xs text-gray-600">
              더 나은 일상을 위한 작은 변화를 응원합니다
            </p>
          </CardContent>
        </Card>

        {/* Copyright */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            © 2025 Monkeys Studio. All rights reserved.
          </p>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">SPARK 이용약관</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowTerms(false)}>
                ✕
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">제1조 (목적)</h4>
                <p className="text-gray-600 leading-relaxed">
                  본 약관은 Monkeys Studio(이하 "회사")가 제공하는 SPARK 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">제2조 (정의)</h4>
                <p className="text-gray-600 leading-relaxed">
                  1. "서비스"란 회사가 제공하는 일상 미션 플랫폼 및 이와 관련된 제반 서비스를 의미합니다.<br/>
                  2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.<br/>
                  3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">제3조 (서비스의 제공)</h4>
                <p className="text-gray-600 leading-relaxed">
                  1. 회사는 다음과 같은 서비스를 제공합니다:<br/>
                  - 일상 미션 생성 및 관리<br/>
                  - 포인트 및 리워드 시스템<br/>
                  - 사용자 성장 및 레벨 시스템<br/>
                  - 커뮤니티 기능<br/>
                  2. 회사는 서비스의 품질 향상을 위해 지속적으로 서비스를 개선하고 업데이트할 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">제4조 (회원가입)</h4>
                <p className="text-gray-600 leading-relaxed">
                  1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.<br/>
                  2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">제5조 (개인정보 보호)</h4>
                <p className="text-gray-600 leading-relaxed">
                  회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">제6조 (서비스 이용시간)</h4>
                <p className="text-gray-600 leading-relaxed">
                  서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 운영을 원칙으로 합니다. 단, 회사는 시스템 정기점검, 증설 및 교체를 위해 당해 서비스를 일정 범위로 분할하여 각각 별도로 운영할 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">제7조 (면책조항)</h4>
                <p className="text-gray-600 leading-relaxed">
                  1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.<br/>
                  2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
                </p>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-500">
                  시행일자: 2025년 8월 16일<br/>
                  Monkeys Studio
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">개인정보처리방침</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPrivacy(false)}>
                ✕
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">1. 개인정보 수집 및 이용목적</h4>
                <p className="text-gray-600 leading-relaxed">
                  회사는 다음의 목적을 위하여 개인정보를 처리합니다:<br/>
                  - 회원가입 의사의 확인, 회원제 서비스 제공<br/>
                  - 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산<br/>
                  - 고객 문의사항 응답, 불만처리 등 민원처리<br/>
                  - 서비스 개선, 신규 서비스 개발을 위한 통계분석
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. 수집하는 개인정보 항목</h4>
                <p className="text-gray-600 leading-relaxed">
                  회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다:<br/>
                  - 필수항목: 이메일, 이름, 비밀번호<br/>
                  - 선택항목: 프로필 이미지, 한줄소개<br/>
                  - 서비스 이용 과정에서 수집되는 정보: 접속 IP 정보, 쿠키, 서비스 이용 기록, 접속 로그
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. 개인정보 보유 및 이용기간</h4>
                <p className="text-gray-600 leading-relaxed">
                  회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:<br/>
                  - 회원탈퇴 후: 개인정보 즉시 파기<br/>
                  - 관련 법령에 의한 보존: 관련 법령에서 정한 기간
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. 개인정보 제3자 제공</h4>
                <p className="text-gray-600 leading-relaxed">
                  회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:<br/>
                  - 이용자들이 사전에 동의한 경우<br/>
                  - 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">5. 개인정보 처리 위탁</h4>
                <p className="text-gray-600 leading-relaxed">
                  회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:<br/>
                  - 클라우드 서비스 제공업체를 통한 데이터 저장 및 관리<br/>
                  - 이메일 발송 서비스
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">6. 이용자의 권리</h4>
                <p className="text-gray-600 leading-relaxed">
                  이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다. 개인정보 조회, 수정을 위해서는 개인정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">7. 개인정보보호책임자</h4>
                <p className="text-gray-600 leading-relaxed">
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다:<br/>
                  - 개인정보보호책임자: 지나니<br/>
                  - 연락처: support@spark-app.com
                </p>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-500">
                  시행일자: 2025년 8월 16일<br/>
                  Monkeys Studio
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}