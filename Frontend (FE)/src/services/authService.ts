import { User, LoginResponse, TokenRefreshResponse, EmailVerificationResponse } from '../types/auth';

class AuthService {
  private readonly baseURL = 'http://localhost:8080/api/auth'; // IdP backend URL
  private readonly jwksURL = 'http://localhost:8080/.well-known/jwks.json';
  private readonly clientId = 'school-management-app';
  private readonly clientSecret = 'demo-client-secret';
  private publicKey: string | null = null;

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

  async register(email: string, password: string, role: 'admin' | 'teacher' | 'student' = 'student'): Promise<{ requiresVerification: boolean; message: string }> {
    // Simulate API call to IdP backend
    await this.delay(1200);
    
    if (email.includes('existing')) {
      throw new Error('Email already exists');
    }

    // In real implementation, this would create user and send verification email
    return {
      requiresVerification: true,
      message: 'Registration successful. Please check your email for verification.'
    };
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

  async sendVerificationEmail(email: string): Promise<void> {
    await this.delay(800);
    console.log(`Verification email sent to ${email}`);
  }

  async verifyEmail(email: string, code: string): Promise<LoginResponse> {
    await this.delay(1000);
    
    if (code !== '123456') {
      throw new Error('Invalid verification code');
    }

    // Create user account after successful verification
    const role = email.includes('admin') ? 'admin' as const : 
                 email.includes('teacher') ? 'teacher' as const : 'student' as const;
    
    return this.createAuthResponse(email, role);
  }

  async fetchPublicKey(): Promise<string> {
    if (this.publicKey) {
      return this.publicKey;
    }

    try {
      // In real implementation, fetch from JWKS endpoint
      await this.delay(500);
      
      // Mock public key for demo
      this.publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4f5wg5l2hKsTeNem/V41
fGnJm6gOdrj8ym3rFkEjWT2btf+FxKlaAWYxgxYaLPFyHPxCL4HHQOFwlOWN4Hxp
T3S+HgOQhqMa9+Ld4+5g5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btf+Fx
KlaAWYxgxYaLPFyHPxCL4HHQOFwlOWN4HxpT3S+HgOQhqMa9+Ld4+5g5l2hKsTe
Nem/V41fGnJm6gOdrj8ym3rFkEjWT2btf+FxKlaAWYxgxYaLPFyHPxCL4HHQOFW
lOWN4HxpT3S+HgOQhqMa9+Ld4+5g
-----END PUBLIC KEY-----`;
      
      return this.publicKey;
    } catch (error) {
      throw new Error('Failed to fetch public key');
    }
  }

  async validateTokenSignature(token: string): Promise<boolean> {
    try {
      // In real implementation, verify JWT signature using public key
      const publicKey = await this.fetchPublicKey();
      
      // Mock validation - in production use a JWT library
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      // Simulate signature verification
      await this.delay(200);
      return true;
    } catch (error) {
      return false;
    }
  }

  async initiateOAuthLogin(provider: 'linkedin' | 'google' | 'github'): Promise<string> {
    const state = Math.random().toString(36).substring(2, 15);
    const redirectUri = `${window.location.origin}/auth/callback/${provider}`;
    
    localStorage.setItem('oauth_state', state);
    
    // Return OAuth URL that would redirect to IdP
    return `${this.baseURL}/oauth2/authorization/${provider}?client_id=${this.clientId}&redirect_uri=${redirectUri}&state=${state}`;
  }

  async handleOAuthCallback(provider: string, code: string, state: string): Promise<LoginResponse> {
    const storedState = localStorage.getItem('oauth_state');
    
    if (state !== storedState) {
      throw new Error('Invalid OAuth state');
    }

    localStorage.removeItem('oauth_state');

    // Simulate OAuth token exchange
    await this.delay(1500);
    
    // Mock user data from OAuth provider
    const email = `user@${provider}.com`;
    const role = 'student' as const;
    
    return this.createAuthResponse(email, role);
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