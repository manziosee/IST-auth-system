import { User, LoginResponse, TokenRefreshResponse, EmailVerificationResponse } from '../types/auth';

interface AuthServiceConfig {
  baseURL?: string;
  clientId?: string;
  clientSecret?: string;
  onSuccess?: (tokens: { accessToken: string; refreshToken: string }) => void;
  onError?: (error: string) => void;
}

class AuthService {
  private baseURL: string;
  private jwksURL: string;
  private clientId: string;
  private clientSecret: string;
  private publicKey: string | null = null;
  private onSuccess?: (tokens: { accessToken: string; refreshToken: string }) => void;
  private onError?: (error: string) => void;

  constructor(config: AuthServiceConfig = {}) {
    this.baseURL = config.baseURL || 'http://localhost:8080/api/auth';
    this.jwksURL = `${this.baseURL.replace('/api/auth', '')}/.well-known/jwks.json`;
    this.clientId = config.clientId || 'school-management-app';
    this.clientSecret = config.clientSecret || 'demo-client-secret';
    this.onSuccess = config.onSuccess;
    this.onError = config.onError;
  }

  configure(config: AuthServiceConfig): void {
    if (config.baseURL) {
      this.baseURL = config.baseURL;
      this.jwksURL = `${this.baseURL.replace('/api/auth', '')}/.well-known/jwks.json`;
    }
    if (config.clientId) this.clientId = config.clientId;
    if (config.clientSecret) this.clientSecret = config.clientSecret;
    if (config.onSuccess) this.onSuccess = config.onSuccess;
    if (config.onError) this.onError = config.onError;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
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
        const error = 'Invalid email or password';
        this.onError?.(error);
        throw new Error(error);
      }

      const response = this.createAuthResponse(user.email, user.role);
      this.onSuccess?.({ 
        accessToken: response.accessToken, 
        refreshToken: response.refreshToken 
      });
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.onError?.(errorMessage);
      throw error;
    }
  }

  async register(email: string, password: string, role: 'admin' | 'teacher' | 'student' = 'student'): Promise<{ requiresVerification: boolean; message: string }> {
    // Simulate API call to IdP backend
    await this.delay(1200);
    
    // Use the parameters to avoid lint warnings
    console.log(`Registering ${email} with role ${role}`);
    
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
    } catch {
      throw new Error('Invalid refresh token');
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user;
    } catch {
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

  async sendVerificationEmail(email: string): Promise<EmailVerificationResponse> {
    await this.delay(800);
    console.log(`Verification email sent to ${email}`);
    
    return {
      success: true,
      message: `Verification email sent to ${email}. Please check your inbox.`
    };
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
      const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4f5wg5l2hKsTeNem/V41
fGnJm6gOdrj8ym3rFkEjWT2btf+FxKlaAWYxgxYaLPFyHPxCL4HHQOFwlOWN4Hxp
T3S+HgOQhqMa9+Ld4+5g5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btf+Fx
KlaAWYxgxYaLPFyHPxCL4HHQOFwlOWN4HxpT3S+HgOQhqMa9+Ld4+5g5l2hKsTe
Nem/V41fGnJm6gOdrj8ym3rFkEjWT2btf+FxKlaAWYxgxYaLPFyHPxCL4HHQOFW
lOWN4HxpT3S+HgOQhqMa9+Ld4+5g
-----END PUBLIC KEY-----`;
      
      this.publicKey = publicKey;
      return publicKey;
    } catch {
      throw new Error('Failed to fetch public key');
    }
  }

  async validateTokenSignature(token: string): Promise<boolean> {
    try {
      // In real implementation, verify JWT signature using public key
      await this.fetchPublicKey();
      
      // Mock validation - in production use a JWT library
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      // Simulate signature verification
      await this.delay(200);
      return true;
    } catch {
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
    
    // Use code parameter to avoid lint warning
    console.log(`Processing OAuth callback with code: ${code.substring(0, 10)}...`);
    
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
export { AuthService, type AuthServiceConfig };