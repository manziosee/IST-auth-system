import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { AuthService } from '../services/authService';
import { User, AuthState } from '../types/auth';

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: 'admin' | 'teacher' | 'student') => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: { accessToken: string; refreshToken: string } }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'REFRESH_TOKEN':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: React.ReactNode;
  apiUrl?: string;
  clientId?: string;
  onSuccess?: (tokens: { accessToken: string; refreshToken: string }) => void;
  onError?: (error: string) => void;
}

export function AuthProvider({ 
  children, 
  apiUrl, 
  clientId, 
  onSuccess, 
  onError 
}: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Create a configured auth service instance
  const authService = useMemo(() => {
    return new AuthService({
      baseURL: apiUrl,
      clientId,
      onSuccess,
      onError
    });
  }, [apiUrl, clientId, onSuccess, onError]);

  useEffect(() => {
    const initializeAuth = async () => {
      const tokens = authService.getStoredTokens();
      if (tokens.accessToken && tokens.refreshToken) {
        try {
          const isValid = await authService.verifyToken(tokens.accessToken);
          if (isValid) {
            const user = authService.decodeToken(tokens.accessToken);
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
              },
            });
          } else {
            // Try to refresh token inline to avoid dependency issues
            try {
              const response = await authService.refreshToken(tokens.refreshToken);
              dispatch({
                type: 'REFRESH_TOKEN',
                payload: {
                  accessToken: response.accessToken,
                  refreshToken: response.refreshToken,
                },
              });
              authService.storeTokens(response.accessToken, response.refreshToken);
            } catch {
              authService.clearTokens();
              dispatch({ type: 'LOGOUT' });
            }
          }
        } catch {
          authService.clearTokens();
        }
      }
    };

    initializeAuth();
  }, [authService]);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(email, password);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response,
      });
      authService.storeTokens(response.accessToken, response.refreshToken);
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  const register = async (email: string, password: string, role: 'admin' | 'teacher' | 'student' = 'student') => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.register(email, password, role);
      // Register returns a different type - just show success message
      dispatch({ type: 'LOGIN_FAILURE', payload: response.message });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  const logout = () => {
    authService.clearTokens();
    dispatch({ type: 'LOGOUT' });
  };

  const refreshToken = async () => {
    try {
      const currentRefreshToken = authService.getStoredTokens().refreshToken;
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(currentRefreshToken);
      dispatch({
        type: 'REFRESH_TOKEN',
        payload: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
      });
      authService.storeTokens(response.accessToken, response.refreshToken);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}