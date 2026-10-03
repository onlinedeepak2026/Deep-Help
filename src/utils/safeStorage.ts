/**
 * Deep Help Safe Storage Utility
 * Crash-proof wrapper around localStorage with fallback memory cache,
 * corrupt JSON recovery, quota-exceeded protection, and incognito mode support.
 */

class SafeStorage {
  private memoryCache: Map<string, string> = new Map();
  private isStorageAvailable: boolean = true;
  private isIncognitoStudyMode: boolean = false;

  constructor() {
    this.testAvailability();
    this.isIncognitoStudyMode = this.getItem('deephelp_incognito_mode') === 'true';
  }

  private testAvailability() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        this.isStorageAvailable = false;
        return;
      }
      const testKey = '__deephelp_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      this.isStorageAvailable = true;
    } catch {
      this.isStorageAvailable = false;
    }
  }

  public setIncognitoMode(enabled: boolean) {
    this.isIncognitoStudyMode = enabled;
    try {
      if (this.isStorageAvailable) {
        window.localStorage.setItem('deephelp_incognito_mode', enabled ? 'true' : 'false');
      }
    } catch {
      // ignore
    }
  }

  public isIncognito(): boolean {
    return this.isIncognitoStudyMode;
  }

  public getItem(key: string): string | null {
    try {
      if (this.isStorageAvailable && !this.isIncognitoStudyMode) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
      return this.memoryCache.get(key) || null;
    } catch (e) {
      console.warn(`[SafeStorage] Failed to read key "${key}":`, e);
      return this.memoryCache.get(key) || null;
    }
  }

  public getJSON<T>(key: string, fallback: T): T {
    const raw = this.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[SafeStorage] Corrupted JSON detected for key "${key}", using fallback:`, e);
      return fallback;
    }
  }

  public setItem(key: string, value: string): boolean {
    // If in incognito study mode and it's historical data, keep only in memory
    if (this.isIncognitoStudyMode && (key.includes('saved') || key.includes('history'))) {
      this.memoryCache.set(key, value);
      return true;
    }

    try {
      if (this.isStorageAvailable) {
        window.localStorage.setItem(key, value);
      }
      this.memoryCache.set(key, value);
      return true;
    } catch (e: any) {
      console.warn(`[SafeStorage] Storage quota or write failure on "${key}":`, e);
      // Fallback to memory cache
      this.memoryCache.set(key, value);
      return false;
    }
  }

  public setJSON<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      return this.setItem(key, serialized);
    } catch (e) {
      console.error(`[SafeStorage] Failed to serialize JSON for key "${key}":`, e);
      return false;
    }
  }

  public removeItem(key: string): void {
    try {
      if (this.isStorageAvailable) {
        window.localStorage.removeItem(key);
      }
      this.memoryCache.delete(key);
    } catch (e) {
      console.warn(`[SafeStorage] Failed to remove key "${key}":`, e);
      this.memoryCache.delete(key);
    }
  }

  public getUsageEstimate(): { usedKb: number; itemsCount: number } {
    let totalLength = 0;
    let count = 0;
    try {
      if (this.isStorageAvailable && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith('deephelp_')) {
            const v = window.localStorage.getItem(k) || '';
            totalLength += k.length + v.length;
            count++;
          }
        }
      }
    } catch {
      // ignore
    }
    return {
      usedKb: Math.round((totalLength * 2) / 1024 * 10) / 10, // UTF-16 approximation
      itemsCount: count,
    };
  }

  public clearAllAppData(): void {
    try {
      if (this.isStorageAvailable && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith('deephelp_')) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      }
      this.memoryCache.clear();
    } catch (e) {
      console.error('Failed to clear app data:', e);
    }
  }
}

export const safeStorage = new SafeStorage();
