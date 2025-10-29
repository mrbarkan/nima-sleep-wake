/**
 * LocalStorage service - centralized storage operations
 * Provides type-safe localStorage access with error handling
 */

import { STORAGE_KEYS } from "@/config/constants";

class StorageService {
  /**
   * Get item from localStorage with type safety
   */
  getItem<T = string>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage with automatic stringification
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Get or create user identifier
   */
  getUserIdentifier(): string {
    let identifier = this.getItem<string>(STORAGE_KEYS.USER_IDENTIFIER);
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.setItem(STORAGE_KEYS.USER_IDENTIFIER, identifier);
    }
    return identifier;
  }
}

export const storageService = new StorageService();
