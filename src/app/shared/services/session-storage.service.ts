import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {
  getItem(key: string): string | null {
    return window.sessionStorage.getItem(key);
  }
  setItem(key: string, value: string): void {
    window.sessionStorage.setItem(key, value);
  }
  removeItem(key: string): void {
    window.sessionStorage.removeItem(key);
  }
}
