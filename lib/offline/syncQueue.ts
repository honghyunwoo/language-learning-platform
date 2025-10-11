/**
 * Offline Sync Queue - 오프라인 동기화 시스템
 * 영어의 정석 - 오프라인 작업을 큐에 저장하고 온라인 시 자동 동기화
 */

'use client';

import { useEffect, useState } from 'react';

// ===== 동기화 작업 타입 =====
export type SyncOperationType = 'create' | 'update' | 'delete';
export type SyncResourceType = 'progress' | 'journal' | 'achievement' | 'profile' | 'community';

export interface SyncQueueItem {
  id: string;
  type: SyncOperationType;
  resource: SyncResourceType;
  data: unknown;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  error?: string;
}

// ===== 동기화 큐 관리자 =====
class OfflineSyncQueue {
  private queue: SyncQueueItem[] = [];
  private readonly STORAGE_KEY = 'offline_sync_queue';
  private readonly MAX_RETRIES = 3;
  private isSyncing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadQueue();
    }
  }

  // ===== 큐 로드 (localStorage) =====
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      this.queue = [];
    }
  }

  // ===== 큐 저장 (localStorage) =====
  private saveQueue(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  // ===== 작업 추가 =====
  add(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'maxRetries'>): string {
    const queueItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: this.MAX_RETRIES,
    };

    this.queue.push(queueItem);
    this.saveQueue();

    console.log(`✅ Added to sync queue: ${queueItem.resource} (${queueItem.type})`);
    return queueItem.id;
  }

  // ===== 작업 제거 =====
  remove(id: string): void {
    this.queue = this.queue.filter((item) => item.id !== id);
    this.saveQueue();
  }

  // ===== 큐 조회 =====
  getQueue(): SyncQueueItem[] {
    return [...this.queue];
  }

  // ===== 큐 크기 =====
  size(): number {
    return this.queue.length;
  }

  // ===== 큐 비우기 =====
  clear(): void {
    this.queue = [];
    this.saveQueue();
  }

  // ===== 동기화 실행 =====
  async sync(
    executor: (item: SyncQueueItem) => Promise<void>
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    if (this.isSyncing) {
      console.warn('Sync already in progress');
      return { success: 0, failed: 0, errors: [] };
    }

    if (this.queue.length === 0) {
      console.log('No items to sync');
      return { success: 0, failed: 0, errors: [] };
    }

    this.isSyncing = true;
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    console.log(`🔄 Starting sync: ${this.queue.length} items`);

    for (const item of [...this.queue]) {
      try {
        await executor(item);
        this.remove(item.id);
        successCount++;
        console.log(`✅ Synced: ${item.resource} (${item.type})`);
      } catch (error) {
        item.retryCount++;
        item.error = error instanceof Error ? error.message : 'Unknown error';

        if (item.retryCount >= item.maxRetries) {
          // 최대 재시도 초과 - 큐에서 제거
          this.remove(item.id);
          failedCount++;
          errors.push(`${item.resource} (${item.type}): ${item.error}`);
          console.error(`❌ Failed after ${item.maxRetries} retries:`, item.error);
        } else {
          // 재시도 가능 - 큐에 유지
          this.saveQueue();
          console.warn(`⚠️ Retry ${item.retryCount}/${item.maxRetries}:`, item.error);
        }
      }
    }

    this.isSyncing = false;
    console.log(`🎉 Sync complete: ${successCount} success, ${failedCount} failed`);

    return { success: successCount, failed: failedCount, errors };
  }

  // ===== 동기화 상태 확인 =====
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  // ===== 특정 리소스 타입의 대기 중인 작업 조회 =====
  getPendingByResource(resource: SyncResourceType): SyncQueueItem[] {
    return this.queue.filter((item) => item.resource === resource);
  }

  // ===== 특정 작업 타입의 대기 중인 작업 조회 =====
  getPendingByType(type: SyncOperationType): SyncQueueItem[] {
    return this.queue.filter((item) => item.type === type);
  }
}

// ===== 싱글톤 인스턴스 =====
let queueInstance: OfflineSyncQueue | null = null;

export function getSyncQueue(): OfflineSyncQueue {
  if (!queueInstance) {
    queueInstance = new OfflineSyncQueue();
  }
  return queueInstance;
}

// ===== React Hook =====
export function useSyncQueue() {
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const syncQueue = getSyncQueue();
    setQueue(syncQueue.getQueue());

    // 온라인/오프라인 이벤트 리스너
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🟢 Back online - triggering sync');
      // 자동 동기화는 별도로 트리거해야 함
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('🔴 Gone offline - operations will be queued');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 주기적으로 큐 상태 업데이트
    const interval = setInterval(() => {
      setQueue(syncQueue.getQueue());
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return {
    queue,
    isOnline,
    queueSize: queue.length,
    add: (item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'maxRetries'>) =>
      getSyncQueue().add(item),
    sync: (executor: (item: SyncQueueItem) => Promise<void>) => getSyncQueue().sync(executor),
    clear: () => getSyncQueue().clear(),
  };
}

// ===== Firestore 동기화 실행자 예제 =====
export async function createFirestoreSyncExecutor(
  updateFn: (resource: string, type: SyncOperationType, data: unknown) => Promise<void>
) {
  return async (item: SyncQueueItem): Promise<void> => {
    await updateFn(item.resource, item.type, item.data);
  };
}

// ===== 오프라인 작업 래퍼 =====
export async function executeOfflineCapable<T>(
  fn: () => Promise<T>,
  queueItem: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'maxRetries'>
): Promise<T> {
  try {
    // 온라인이면 즉시 실행
    if (navigator.onLine) {
      return await fn();
    }

    // 오프라인이면 큐에 추가
    getSyncQueue().add(queueItem);
    throw new Error('Offline: Operation queued for sync');
  } catch (error) {
    // 네트워크 에러면 큐에 추가
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      getSyncQueue().add(queueItem);
      throw new Error('Network error: Operation queued for sync');
    }
    throw error;
  }
}

// ===== 동기화 통계 =====
export interface SyncStats {
  totalQueued: number;
  byResource: Record<SyncResourceType, number>;
  byType: Record<SyncOperationType, number>;
  oldestItem?: Date;
  newestItem?: Date;
}

export function getSyncStats(): SyncStats {
  const queue = getSyncQueue().getQueue();

  const stats: SyncStats = {
    totalQueued: queue.length,
    byResource: {
      progress: 0,
      journal: 0,
      achievement: 0,
      profile: 0,
      community: 0,
    },
    byType: {
      create: 0,
      update: 0,
      delete: 0,
    },
  };

  queue.forEach((item) => {
    stats.byResource[item.resource]++;
    stats.byType[item.type]++;
  });

  if (queue.length > 0) {
    const timestamps = queue.map((item) => item.timestamp);
    stats.oldestItem = new Date(Math.min(...timestamps));
    stats.newestItem = new Date(Math.max(...timestamps));
  }

  return stats;
}
