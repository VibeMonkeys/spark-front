import axios from 'axios';

// 환경변수에서 API URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8099/api/v1';

console.log('🌐 [API] Base URL:', API_BASE_URL);
console.log('🔧 [API] Environment:', import.meta.env.MODE);

// API 기본 설정
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // TODO: 인증 토큰이 있다면 헤더에 추가
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // 백엔드의 ApiResponse 구조를 그대로 반환 (homeApi에서 .data 접근)
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      // 서버에서 응답이 온 경우
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 요청이 갔지만 응답이 없는 경우
      console.error('Network Error:', error.request);
      return Promise.reject({ message: '네트워크 오류가 발생했습니다.' });
    } else {
      // 요청을 설정하는 중 오류가 발생한 경우
      console.error('Error:', error.message);
      return Promise.reject({ message: '요청 처리 중 오류가 발생했습니다.' });
    }
  }
);