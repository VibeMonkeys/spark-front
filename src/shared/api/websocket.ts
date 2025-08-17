// WebSocket 클라이언트 구현
interface WebSocketNotification {
  id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  actionUrl?: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

interface WebSocketMessage {
  type: 'notification' | 'pong';
  data?: WebSocketNotification;
}

type NotificationHandler = (notification: WebSocketNotification) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private notificationHandlers: NotificationHandler[] = [];
  private isConnecting = false;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
        resolve();
        return;
      }

      if (!this.token) {
        reject(new Error('No authentication token found'));
        return;
      }

      this.isConnecting = true;
      const wsUrl = `${this.getWebSocketUrl()}/ws/notifications?token=${this.token}`;
      
      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          
          // 자동 재연결 (일반적인 종료가 아닌 경우)
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Normal closure');
      this.ws = null;
    }
  }

  onNotification(handler: NotificationHandler): () => void {
    this.notificationHandlers.push(handler);
    
    // 구독 해제 함수 반환
    return () => {
      const index = this.notificationHandlers.indexOf(handler);
      if (index > -1) {
        this.notificationHandlers.splice(index, 1);
      }
    };
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  updateToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    
    // 토큰이 업데이트되면 재연결
    if (this.isConnected()) {
      this.disconnect();
      this.connect().catch(console.error);
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'notification':
        if (message.data) {
          this.notificationHandlers.forEach(handler => {
            try {
              handler(message.data!);
            } catch (error) {
              console.error('Notification handler error:', error);
            }
          });
        }
        break;
      case 'pong':
        // 하트비트 응답 처리
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private heartbeatInterval: number | null = null;

  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.isConnected()) {
        this.ws!.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30초마다 ping
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // 개발 환경
    if (window.location.hostname === 'localhost') {
      return `${protocol}//localhost:8099`;
    }
    
    // 프로덕션 환경 - 백엔드 서버 URL로 변경 필요
    return `${protocol}//spark-back.railway.app`;
  }
}

// 싱글톤 인스턴스
export const webSocketClient = new WebSocketClient();

// 타입 내보내기
export type { WebSocketNotification, NotificationHandler };