# Offline-First Implementation Guide

This document provides detailed technical information about the offline-first implementation in the Geoelectrica application.

## Core Components

### 1. Storage Layer

#### Base Interfaces

```typescript
// lib/storage/IStorage.ts
export interface IStorage<T> {
  save(item: T): Promise<void>;
  load(): Promise<T>;
  delete(id: string): Promise<void>;
  getAll(): Promise<T[]>;
}

// lib/storage/ISyncableStorage.ts
export interface ISyncableStorage<T> extends IStorage<T> {
  sync(): Promise<void>;
  getPendingChanges(): Promise<T[]>;
  markAsSynced(item: T): Promise<void>;
  getLastSyncTimestamp(): Promise<Date | null>;
}
```

#### Storage Implementations

1. **IndexedDBStorage**
   - Primary local storage implementation
   - Handles large datasets efficiently
   - Supports complex queries
   - Persists data even when browser is closed

2. **RemoteStorage**
   - Server-side storage implementation
   - Handles API communication
   - Manages authentication and authorization

3. **LocalStorage**
   - Fallback storage implementation
   - Used for small datasets
   - Limited by storage capacity

### 2. Service Worker

```typescript
// lib/service-worker.ts
const CACHE_NAME = 'geoelectrica-v1';
const OFFLINE_URL = '/offline.html';

// Installation
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/',
        '/index.html',
        // Add other static assets
      ]);
    })
  );
});

// Fetch handling
self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      const fetchRequest = event.request.clone();
      return fetch(fetchRequest)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
  );
});

// Background sync
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-estudios') {
    event.waitUntil(syncEstudios());
  }
});
```

### 3. Sync Manager

```typescript
// lib/sync/SyncManager.ts
export class SyncManager {
  private static instance: SyncManager;
  private syncInProgress = false;
  private syncQueue: Map<string, ISyncableStorage<any>> = new Map();

  private constructor() {
    this.setupConnectivityListener();
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  private setupConnectivityListener() {
    window.addEventListener('online', () => this.syncAll());
    window.addEventListener('offline', () => this.handleOffline());
  }

  registerStorage<T>(key: string, storage: ISyncableStorage<T>) {
    this.syncQueue.set(key, storage);
  }

  private async syncAll() {
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      for (const [key, storage] of this.syncQueue) {
        await this.syncStorage(storage);
      }
    } finally {
      this.syncInProgress = false;
    }
  }
}
```

## Implementation Steps

### 1. Setup Service Worker

1. Create `service-worker.ts` in the root directory
2. Register the service worker in your main application:

```typescript
// lib/index.ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}
```

### 2. Implement Storage Layer

1. Create storage interfaces
2. Implement IndexedDB storage:

```typescript
// lib/storage/IndexedDBStorage.ts
export class IndexedDBStorage<T> implements ISyncableStorage<T> {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'geoelectricaDB';
  private readonly storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }
}
```

### 3. Update Models

1. Create base model:

```typescript
// lib/BaseModel.ts
export abstract class BaseModel<T> {
  constructor(protected storage: ISyncableStorage<T>) {
    SyncManager.getInstance().registerStorage(this.constructor.name, storage);
  }

  async save(): Promise<void> {
    await this.storage.save(this as unknown as T);
    
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-estudios');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }
}
```

2. Update existing models to extend BaseModel:

```typescript
// lib/Estudio/Estudio.ts
export class Estudio extends BaseModel<Estudio> {
  constructor() {
    const storage = StorageFactory.createStorage<Estudio>('local', {
      storeName: 'estudios'
    });
    super(storage);
  }
}
```

### 4. Add Manifest

Create `manifest.json` in the public directory:

```json
{
  "name": "Geoelectrica",
  "short_name": "Geoelectrica",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Testing Offline Functionality

1. Open Chrome DevTools
2. Go to Network tab
3. Check "Offline" checkbox
4. Test the application's offline capabilities
5. Uncheck "Offline" to test sync functionality

## Common Issues and Solutions

1. **Service Worker Not Registering**
   - Ensure HTTPS is enabled (except for localhost)
   - Check browser console for errors
   - Verify service worker file is in the correct location

2. **Sync Not Working**
   - Check network connectivity
   - Verify background sync is enabled in browser
   - Check browser console for sync errors

3. **Data Not Persisting**
   - Verify IndexedDB is available
   - Check storage permissions
   - Monitor storage usage

## Browser Support

- Chrome: Full support
- Firefox: Full support
- Safari: Limited support (no background sync)
- Edge: Full support

## Security Considerations

1. Always use HTTPS in production
2. Implement proper authentication
3. Validate data before syncing
4. Handle sensitive data appropriately
5. Implement proper error handling

## Performance Optimization

1. Implement proper caching strategies
2. Use batch operations for multiple items
3. Implement proper indexing
4. Monitor storage usage
5. Implement cleanup strategies

## Maintenance

1. Regular testing of offline functionality
2. Monitoring of sync status
3. Regular updates of cached assets
4. Database version management
5. Error logging and monitoring 