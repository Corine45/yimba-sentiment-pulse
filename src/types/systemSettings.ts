
export interface SystemSettings {
  surveillance: {
    frequency: number;
    maxConcurrentJobs: number;
    retryAttempts: number;
    timeout: number;
  };
  storage: {
    retentionPeriod: number;
    autoArchive: boolean;
    compressionEnabled: boolean;
    maxStorageSize: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    webhookEnabled: boolean;
    digestFrequency: string;
  };
  performance: {
    enableCaching: boolean;
    cacheExpiry: number;
    enableCompression: boolean;
    maxMemoryUsage: number;
  };
}

export interface SystemStats {
  uptime: string;
  lastRestart: string;
  version: string;
  database: {
    size: string;
    records: string;
    lastBackup: string;
  };
  performance: {
    avgResponseTime: string;
    memoryUsage: string;
    diskUsage: string;
  };
}

export const defaultSettings: SystemSettings = {
  surveillance: {
    frequency: 15,
    maxConcurrentJobs: 5,
    retryAttempts: 3,
    timeout: 30
  },
  storage: {
    retentionPeriod: 12,
    autoArchive: true,
    compressionEnabled: true,
    maxStorageSize: 50
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    webhookEnabled: true,
    digestFrequency: "daily"
  },
  performance: {
    enableCaching: true,
    cacheExpiry: 60,
    enableCompression: true,
    maxMemoryUsage: 80
  }
};
