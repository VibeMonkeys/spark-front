import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { api } from '../shared/api/base';

interface HelpPageProps {
  onBack: () => void;
  onShowNotification: (type: 'success' | 'error', title: string, message: string) => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQ[] = [
  {
    id: '1',
    question: 'SPARK는 어떤 앱인가요?',
    answer: 'SPARK는 일상에 작은 변화와 도전을 제공하는 랜덤 미션 앱입니다. 매일 새로운 미션을 통해 더 활발하고 흥미진진한 삶을 경험할 수 있습니다.',
    category: '기본정보'
  },
  {
    id: '2',
    question: '미션은 어떻게 받을 수 있나요?',
    answer: '홈 화면의 "오늘의 미션" 섹션에서 다양한 미션을 확인하고 시작할 수 있습니다. 미션을 선택하면 상세 정보를 보고 시작할지 결정할 수 있습니다.',
    category: '미션'
  },
  {
    id: '3',
    question: '미션 완료는 어떻게 인증하나요?',
    answer: '미션 탭에서 진행 중인 미션을 선택하고 "인증하기" 버튼을 누르세요. 사진 업로드나 텍스트 입력을 통해 미션 완료를 인증할 수 있습니다.',
    category: '미션'
  },
  {
    id: '4',
    question: '포인트는 어떻게 사용하나요?',
    answer: '미션 완료로 획득한 포인트는 리워드 탭에서 다양한 상품이나 혜택으로 교환할 수 있습니다. 카페 쿠폰, 영화 티켓, 온라인 상품권 등이 준비되어 있습니다.',
    category: '포인트/리워드'
  },
  {
    id: '5',
    question: '연속 수행일(스트릭)은 무엇인가요?',
    answer: '연속 수행일은 매일 미션을 완료한 연속 일수입니다. 더 높은 스트릭을 유지할수록 특별한 보너스 포인트와 업적을 획득할 수 있습니다.',
    category: '포인트/리워드'
  },
  {
    id: '6',
    question: '레벨은 어떻게 올리나요?',
    answer: '미션을 완료하여 포인트를 획득하면 자동으로 레벨이 올라갑니다. 레벨이 높아질수록 더 많은 기능과 특별한 미션에 접근할 수 있습니다.',
    category: '레벨/성장'
  },
  {
    id: '7',
    question: '프로필 정보는 어떻게 수정하나요?',
    answer: '프로필 탭에서 설정(톱니바퀴) 버튼을 누르고 "프로필 편집"을 선택하면 이름, 한줄소개, 프로필 이미지를 변경할 수 있습니다.',
    category: '계정관리'
  },
  {
    id: '8',
    question: '비밀번호를 변경하려면 어떻게 해야 하나요?',
    answer: '프로필 탭 → 설정 → "비밀번호 변경"을 선택하여 현재 비밀번호를 입력하고 새 비밀번호로 변경할 수 있습니다.',
    category: '계정관리'
  },
  {
    id: '9',
    question: '미션을 중도에 포기할 수 있나요?',
    answer: '시작한 미션은 24시간 내에 완료해야 합니다. 중도 포기는 불가능하지만, 시간이 지나면 자동으로 실패 처리되고 새로운 미션을 받을 수 있습니다.',
    category: '미션'
  },
  {
    id: '10',
    question: '하루에 몇 개의 미션을 할 수 있나요?',
    answer: '현재는 하루에 하나의 미션만 진행할 수 있습니다. 미션을 완료하거나 실패한 후 다음 미션을 시작할 수 있습니다.',
    category: '미션'
  }
];

export function HelpPage({ onBack, onShowNotification }: HelpPageProps) {
  const { user } = useAuth();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: user?.email || ''
  });

  const categories = [...new Set(faqData.map(faq => faq.category))];

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const submitContactMutation = useMutation({
    mutationFn: async (data: typeof contactForm) => {
      const response = await api.post('/api/inquiries', {
        userId: user?.id,
        subject: data.subject,
        message: data.message,
        email: data.email
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error?.message || '문의 전송에 실패했습니다');
      }
    },
    onSuccess: () => {
      onShowNotification('success', '문의 전송 완료', '문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');
      setContactForm({ subject: '', message: '', email: user?.email || '' });
      setShowContactForm(false);
    },
    onError: (error: Error) => {
      onShowNotification('error', '문의 전송 실패', error.message);
    }
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      onShowNotification('warning', '입력 확인', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    submitContactMutation.mutate(contactForm);
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
              도움말
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {!showContactForm ? (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <Button
                onClick={() => setShowContactForm(true)}
                className="h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <MessageSquare className="size-4 mr-2" />
                문의하기
              </Button>
            </div>

            {/* FAQ by Category */}
            {categories.map((category) => (
              <Card key={category} className="border-0 bg-white/60 backdrop-blur-sm mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="size-5 text-blue-500" />
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {faqData
                    .filter(faq => faq.category === category)
                    .map((faq) => (
                      <div key={faq.id} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className="font-medium text-sm">{faq.question}</span>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="size-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="size-4 text-gray-500" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="p-3 pt-0 text-sm text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}

            {/* Additional Help */}
            <Card className="border-0 bg-blue-50/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">추가 도움이 필요하신가요?</h4>
                <p className="text-xs text-blue-800 mb-3">
                  위 FAQ에서 답을 찾지 못하셨다면 언제든지 문의해주세요. 
                  빠른 시일 내에 친절하게 답변드리겠습니다.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowContactForm(true)}
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <MessageSquare className="size-3 mr-2" />
                  지금 문의하기
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Contact Form */
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-5" />
                문의하기
              </CardTitle>
              <CardDescription>
                궁금한 점이나 문제가 있으시면 언제든지 문의해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="답변 받을 이메일"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">제목</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="문의 제목을 입력하세요"
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="message">내용</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="문의 내용을 자세히 작성해주세요"
                    required
                    rows={6}
                    maxLength={1000}
                    className="resize-none"
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {contactForm.message.length}/1000
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitContactMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {submitContactMutation.isPending ? (
                      '전송 중...'
                    ) : (
                      <>
                        <Send className="size-4 mr-2" />
                        전송하기
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}