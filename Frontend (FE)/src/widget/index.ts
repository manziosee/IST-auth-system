/**
 * IST Authentication Widget - S3 Deployable Version
 * Developer: Manzi Niyongira Osee
 * Year: 2025
 * 
 * Lightweight authentication widget for easy integration into existing applications
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthWidget } from '../components/auth/AuthWidget';
import { AuthProvider } from '../contexts/AuthContext';
import '../index.css';

interface ISTAuthConfig {
  containerId: string;
  apiUrl: string;
  clientId: string;
  onSuccess?: (tokens: { accessToken: string; refreshToken: string }) => void;
  onError?: (error: string) => void;
  theme?: 'light' | 'dark';
  redirectUri?: string;
}

class ISTAuthWidget {
  private config: ISTAuthConfig;
  private container: HTMLElement | null = null;
  private root: ReturnType<typeof createRoot> | null = null;

  constructor(config: ISTAuthConfig) {
    this.config = config;
    this.validateConfig();
  }

  private validateConfig(): void {
    // Sanitize inputs to prevent injection
    if (!this.config.containerId || typeof this.config.containerId !== 'string') {
      throw new Error('Valid container ID is required');
    }
    if (!this.config.apiUrl || typeof this.config.apiUrl !== 'string') {
      throw new Error('Valid API URL is required');
    }
    if (!this.config.clientId || typeof this.config.clientId !== 'string') {
      throw new Error('Valid client ID is required');
    }
    
    // Sanitize container ID to prevent XSS
    this.config.containerId = this.config.containerId.replace(/[^a-zA-Z0-9_-]/g, '');
  }

  public init(): void {
    this.container = document.getElementById(this.config.containerId);
    if (!this.container) {
      throw new Error(`Container with ID '${this.config.containerId}' not found`);
    }

    // Apply theme class
    if (this.config.theme) {
      this.container.classList.add(`ist-auth-theme-${this.config.theme}`);
    }

    this.render();
  }

  private render(): void {
    if (!this.container) return;

    const WidgetComponent = React.createElement(
      AuthProvider,
      {
        apiUrl: this.config.apiUrl,
        clientId: this.config.clientId,
        onSuccess: this.config.onSuccess,
        onError: this.config.onError,
        children: React.createElement(AuthWidget, {
          embedded: true,
          redirectUri: this.config.redirectUri
        })
      }
    );

    this.root = createRoot(this.container);
    this.root.render(WidgetComponent);
  }

  public destroy(): void {
    try {
      if (this.root) {
        this.root.unmount();
        this.root = null;
      }
    } catch (error) {
      console.warn('Failed to unmount widget:', error);
    } finally {
      // Always cleanup theme classes even if unmount fails
      if (this.container && this.config.theme) {
        this.container.classList.remove(`ist-auth-theme-${this.config.theme}`);
      }
    }
  }
}

// Global API
declare global {
  interface Window {
    ISTAuth: {
      init: (config: ISTAuthConfig) => ISTAuthWidget;
      Widget: typeof ISTAuthWidget;
    };
  }
}

// Export for UMD build
const ISTAuth = {
  init: (config: ISTAuthConfig) => {
    const widget = new ISTAuthWidget(config);
    widget.init();
    return widget;
  },
  Widget: ISTAuthWidget
};

// Make available globally
if (typeof window !== 'undefined') {
  window.ISTAuth = ISTAuth;
}

export default ISTAuth;
export { ISTAuthWidget, type ISTAuthConfig };
