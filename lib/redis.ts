import { Redis } from '@upstash/redis';

// Create Redis client or fallback to local storage
let redis: any;

if (process.env.redis_KV_REST_API_URL && process.env.redis_KV_REST_API_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.redis_KV_REST_API_URL,
      token: process.env.redis_KV_REST_API_TOKEN,
    });
    console.log('Connected to Redis');
  } catch (error) {
    console.log('Redis connection failed, using local storage:', error);
    redis = createLocalStorage();
  }
} else {
  console.log('No Redis credentials found, using local storage');
  redis = createLocalStorage();
}

function createLocalStorage() {
  // In-memory storage for server-side fallback
  const memoryStore = new Map<string, any>();
  
  return {
    async get(key: string) {
      return memoryStore.get(key) || null;
    },
    async set(key: string, value: any) {
      memoryStore.set(key, value);
      return 'OK';
    },
    async del(key: string) {
      memoryStore.delete(key);
      return 1;
    },
    async keys(pattern: string) {
      const allKeys = Array.from(memoryStore.keys());
      if (pattern === '*') return allKeys;
      return allKeys.filter((key: any) => typeof key === 'string' && key.includes(pattern.replace('*', '')));
    },
    async lrange(key: string, start: number, end: number) {
      const value = memoryStore.get(key);
      if (!Array.isArray(value)) return [];
      return value.slice(start, end === -1 ? undefined : end + 1);
    },
    async rpush(key: string, ...values: any[]) {
      const existing = memoryStore.get(key) || [];
      const newArray = [...existing, ...values];
      memoryStore.set(key, newArray);
      return newArray.length;
    },
    async hset(key: string, fieldOrObj: string | Record<string, any>, value?: any): Promise<number> {
      const hashKey = `hash:${key}`;
      let hashData = memoryStore.get(hashKey) || {};
      
      if (typeof fieldOrObj === 'string' && value !== undefined) {
        hashData[fieldOrObj] = value;
      } else if (typeof fieldOrObj === 'object') {
        hashData = { ...hashData, ...fieldOrObj };
      }
      
      memoryStore.set(hashKey, hashData);
      return Object.keys(hashData).length;
    },
    async hget<T = any>(key: string, field: string): Promise<T | null> {
      const hashKey = `hash:${key}`;
      const hashData = memoryStore.get(hashKey) || {};
      return hashData[field] || null;
    },
    async hdel(key: string, field: string): Promise<number> {
      const hashKey = `hash:${key}`;
      const hashData = memoryStore.get(hashKey) || {};
      if (field in hashData) {
        delete hashData[field];
        memoryStore.set(hashKey, hashData);
        return 1;
      }
      return 0;
    }
  };
}

export { redis as kv };
