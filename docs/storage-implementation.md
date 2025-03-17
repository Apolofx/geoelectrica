# Storage Implementation Guide

This document outlines the planned implementation for a polymorphic storage system that allows switching between localStorage and IndexedDB in the Geoelectrica application.

## Overview

The implementation provides a flexible storage solution that:
- Uses IndexedDB as the primary storage mechanism
- Falls back to localStorage when IndexedDB is unavailable
- Maintains backward compatibility with existing data
- Provides a consistent interface for different storage implementations

## Core Components

### 1. Storage Interface

```typescript
export interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

### 2. Storage Implementations

#### LocalStorage Adapter
```typescript
export class LocalStorageAdapter implements IStorage {
  constructor(private storage: Storage = window.localStorage) {}

  async getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.removeItem(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}
```

#### IndexedDB Implementation
```typescript
export class IndexedDBStorage implements IStorage {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'geoelectricaDB';
  private readonly STORE_NAME = 'keyValueStore';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };
    });
  }

  // Implementation of IStorage methods...
}
```

### 3. Storage Factory

```typescript
const createStorage = () => {
  // Try IndexedDB first
  if ('indexedDB' in window) {
    try {
      return new IndexedDBStorage();
    } catch (error) {
      console.warn('Failed to initialize IndexedDB, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  return new LocalStorageAdapter();
};
```

## Required Changes

### 1. Update HistorialDeEstudiosBrowserPersistance

The class needs to be modified to:
- Accept an IStorage implementation instead of WindowLocalStorage
- Handle async storage operations
- Add proper error handling
- Use a constant for the storage key

### 2. Update Store Initialization

The store needs to be updated to use the storage factory:
```typescript
const storage = createStorage();
const historialDeEstudios = new HistorialDeEstudiosBrowserPersistance(storage);
```

### 3. Update Tests

Tests need to be updated to:
- Use a mock storage implementation
- Handle async operations
- Test both storage implementations
- Test fallback behavior

## Benefits

1. **Improved Storage Capacity**: IndexedDB provides much larger storage limits compared to localStorage
2. **Better Performance**: IndexedDB is better suited for large datasets
3. **Flexibility**: Easy to add new storage implementations
4. **Type Safety**: Strong typing through the interface
5. **Reliability**: Automatic fallback if primary storage fails
6. **Testability**: Easy to mock and test

## Implementation Notes

1. **Migration**: Consider adding migration logic for existing localStorage data
2. **Error Handling**: Implement comprehensive error handling for storage operations
3. **Versioning**: Include version control for stored data structure
4. **Monitoring**: Add logging for storage operations and failures
5. **Testing**: Include integration tests for both storage implementations

## Future Considerations

1. **Remote Storage**: Possibility to add remote storage implementation
2. **Encryption**: Option to add encryption layer
3. **Compression**: Data compression for large datasets
4. **Sync**: Background sync capabilities
5. **Quota Management**: Storage quota monitoring and management

## Security Considerations

1. Always sanitize data before storage
2. Implement proper error handling
3. Consider encryption for sensitive data
4. Monitor storage usage
5. Handle storage quota exceeded scenarios

## Testing Guidelines

1. Test both storage implementations
2. Test fallback mechanism
3. Test error scenarios
4. Test data migration
5. Test concurrent operations
6. Test large datasets
7. Test storage quota limits 