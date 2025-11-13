import { Injectable } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  
  private config: ApiConfig = {
    baseUrl: 'http://localhost:8081/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  getConfig(): ApiConfig {
    return { ...this.config };
  }

  setConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  setBaseUrl(baseUrl: string): void {
    this.config.baseUrl = baseUrl;
  }

  buildUrl(endpoint: string): string {
    const baseUrl = this.config.baseUrl.endsWith('/') 
      ? this.config.baseUrl.slice(0, -1) 
      : this.config.baseUrl;
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    return baseUrl + path;
  }
}
