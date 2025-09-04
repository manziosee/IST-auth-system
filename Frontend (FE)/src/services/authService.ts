import { User, LoginResponse, TokenRefreshResponse } from '../types/auth';

class AuthService {
  private readonly baseURL = 'http://localhost:8080/api/auth'; // IdP backend URL
  private readonly clientId = 'school-management-app';
  private readonly clientSecret = 'demo-client-secret';

  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate API call to IdP backend
    await this.delay(1000);
    
    // Demo users for testing
    const demoUsers = [
      { email: 'admin@school.edu', password: 'admin123', role: 'admin' as const },
      { email: 'teacher@school.edu', password: 'teacher123', role: 'teacher' as const },
      { email: 'student@school.edu', password: 'student123', role: 'student' as const },
    ];

    const user = demoUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    return this.createAuthResponse(user.email, user.role);
  }

  async register(email: string, password: string, role: 'admin' | 'teacher' | 'student' = 'student'): Promise<LoginResponse> {
    // Simulate API call to IdP backend
    await this.delay(1200);
    
    if (email.includes('existing')) {
      throw new Error('Email already exists');
    }

    return this.createAuthResponse(email, role);
  }

  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    // Simulate API call to IdP backend
    await this.delay(500);
    
    try {
      const payload = this.decodeToken(refreshToken);
      const newTokens = this.generateTokens(payload);
      
      return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const payload = this.decodeToken(token);
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }

  decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user;
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('access_token'),
      refreshToken: localStorage.getItem('refresh_token'),
    };
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private createAuthResponse(email: string, role: 'admin' | 'teacher' | 'student'): LoginResponse {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
      firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      lastName: 'Demo',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    const tokens = this.generateTokens(user);

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const now = Date.now() / 1000;
    
    const accessPayload = {
      user,
      iat: now,
      exp: now + 15 * 60, // 15 minutes
      iss: 'ia-idp',
      aud: this.clientId,
    };

    const refreshPayload = {
      user: { id: user.id, email: user.email },
      iat: now,
      exp: now + 7 * 24 * 60 * 60, // 7 days
      iss: 'ia-idp',
      aud: this.clientId,
    };

    // In real implementation, these would be signed with private key
    const accessToken = `${btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${btoa(JSON.stringify(accessPayload))}.signature`;
    const refreshToken = `${btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${btoa(JSON.stringify(refreshPayload))}.signature`;

    return { accessToken, refreshToken };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const authService = new AuthService();