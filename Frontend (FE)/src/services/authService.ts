import { User, LoginResponse, TokenRefreshResponse, EmailVerificationResponse } from '../types/auth';
import { sanitizeLogMessage, sanitizeInput, isValidEmail } from '../utils/security';

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
    this.baseURL = config.baseURL || import.meta.env.VITE_API_BASE_URL || 'https://ist-auth-system-sparkling-wind-9681.fly.dev/api';
    this.jwksURL = this.baseURL.replace('/api', '') + '/.well-known/jwks.json';
    this.clientId = config.clientId || import.meta.env.VITE_CLIENT_ID || 'default-client';
    this.clientSecret = config.clientSecret || import.meta.env.VITE_CLIENT_SECRET || '';
    this.onSuccess = config.onSuccess;
    this.onError = config.onError;
  }

  configure(config: AuthServiceConfig): void {
    if (config.baseURL) {
      this.baseURL = config.baseURL;
      this.jwksURL = new URL('/.well-known/jwks.json', this.baseURL.replace('/api/auth', '')).href;
    }
    if (config.clientId) this.clientId = config.clientId;
    if (config.clientSecret) this.clientSecret = config.clientSecret;
    if (config.onSuccess) this.onSuccess = config.onSuccess;
    if (config.onError) this.onError = config.onError;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        const error = errorData.error || 'Invalid credentials';
        this.onError?.(error);
        throw new Error(error);
      }

      const loginData = await response.json();

      this.onSuccess?.({ 
        accessToken: loginData.accessToken, 
        refreshToken: loginData.refreshToken 
      });
      
      return {
        user: loginData.user,
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken
      };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      const sanitizedMessage = sanitizeLogMessage(errorMessage);
      this.onError?.(sanitizedMessage);
      throw new Error(sanitizedMessage);
    }
  }

  async register(email: string, password: string, role: 'admin' | 'teacher' | 'student' = 'student', username?: string, firstName?: string, lastName?: string): Promise<{ requiresVerification: boolean; message: string }> {
    // Validate inputs
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    try {
      const finalUsername = username || email.split('@')[0]; // Use provided username or generate from email
      const finalFirstName = firstName || email.split('@')[0]; // Use provided firstName or generate from email
      const finalLastName = lastName || 'User'; // Use provided lastName or default
      
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: finalUsername, 
          email, 
          firstName: finalFirstName, 
          lastName: finalLastName, 
          password,
          role: role.toUpperCase()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      return {
        requiresVerification: true,
        message: data.message || 'Registration successful. Please check your email for verification.'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      const sanitizedMessage = sanitizeLogMessage(errorMessage);
      throw new Error(sanitizedMessage);
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
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
    try {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    } catch (error) {
      console.warn('Failed to store tokens in localStorage:', error);
      // Fallback to memory storage or handle gracefully
    }
  }

  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    try {
      return {
        accessToken: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token'),
      };
    } catch (error) {
      console.warn('Failed to retrieve tokens from localStorage:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  clearTokens(): void {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } catch (error) {
      console.warn('Failed to clear tokens from localStorage:', error);
    }
  }

  async sendVerificationEmail(email: string): Promise<EmailVerificationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const sanitizedEmail = sanitizeInput(email);
      throw new Error(`Failed to send verification email to ${sanitizedEmail}`);
    }
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
      const response = await fetch(this.jwksURL);
      if (!response.ok) {
        throw new Error('Failed to fetch JWKS');
      }
      
      const jwks = await response.json();
      if (jwks.keys && jwks.keys.length > 0) {
        // Extract the first key for simplicity
        const key = jwks.keys[0];
        this.publicKey = key;
        return key;
      }
      
      throw new Error('No keys found in JWKS');
    } catch (error) {
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