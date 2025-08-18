import axios from 'axios';

// 환경변수에서 API URL 가져오기 (개발환경에서는 프록시 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// AuthContext를 사용하기 위한 변수 (런타임에 설정됨)
let forceLogoutCallback: ((reason?: string) => void) | null = null;

// AuthContext의 forceLogout 함수를 등록하는 함수
export const setForceLogoutCallback = (callback: (reason?: string) => void) => {
  forceLogoutCallback = callback;
};


// API 기본 설정
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - JWT 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    // 인증 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 갱신 중인지 추적하는 변수
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

// 큐에 있는 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// 응답 인터셉터 - 토큰 만료 시 자동 갱신
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이라면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          
          // 토큰 갱신 요청 (새로운 axios 인스턴스로 프록시 사용)
          const refreshApi = axios.create({
            baseURL: '',
            timeout: 10000
          });
          const response = await refreshApi.post('/auth/refresh', {
            refreshToken: refreshToken
          });

          if (response.data.success) {
            const { token, refreshToken: newRefreshToken } = response.data.data;
            
            // 새로운 토큰들을 저장
            localStorage.setItem('auth_token', token);
            localStorage.setItem('refresh_token', newRefreshToken);
            
            
            // 대기 중인 요청들을 새 토큰으로 처리
            processQueue(null, token);
            
            // 원래 요청을 새 토큰으로 재시도
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          // 토큰 갱신 실패 시 강제 로그아웃 처리
          if (forceLogoutCallback) {
            forceLogoutCallback('토큰 갱신 실패');
          } else {
            // fallback: 직접 로컬 스토리지 정리
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('current_user');
            window.location.href = '/login';
          }
          
          processQueue(refreshError, null);
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // refresh token이 없으면 바로 강제 로그아웃 처리
        if (forceLogoutCallback) {
          forceLogoutCallback('리프레시 토큰 없음');
        } else {
          // fallback: 직접 로컬 스토리지 정리
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('current_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    // 기타 에러 처리
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ message: '네트워크 오류가 발생했습니다.' });
    } else {
      return Promise.reject({ message: '요청 처리 중 오류가 발생했습니다.' });
    }
  }
);