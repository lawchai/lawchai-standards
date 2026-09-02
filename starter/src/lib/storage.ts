export interface StorageEnvelope<T> {
  version: number;
  data: T;
  updatedAt: string;
}

export interface StorageOptions<T> {
  key: string;
  version: number;
  defaultValue: T;
  migrate?: (oldData: unknown, oldVersion: number) => T;
}

export class LocalStorageManager<T> {
  private key: string;
  private version: number;
  private defaultValue: T;
  private migrate?: (oldData: unknown, oldVersion: number) => T;

  constructor(options: StorageOptions<T>) {
    this.key = options.key;
    this.version = options.version;
    this.defaultValue = options.defaultValue;
    this.migrate = options.migrate;
  }

  public load(): T {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) {
        return this.defaultValue;
      }
      const parsed: StorageEnvelope<T> = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null || typeof parsed.version !== 'number') {
        return this.defaultValue;
      }
      if (parsed.version === this.version) {
        return parsed.data;
      }
      if (parsed.version < this.version && this.migrate) {
        const migrated = this.migrate(parsed.data, parsed.version);
        this.save(migrated);
        return migrated;
      }
      return this.defaultValue;
    } catch {
      return this.defaultValue;
    }
  }

  public save(data: T): boolean {
    try {
      const envelope: StorageEnvelope<T> = {
        version: this.version,
        data,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(this.key, JSON.stringify(envelope));
      return true;
    } catch {
      return false;
    }
  }

  public reset(): boolean {
    try {
      localStorage.removeItem(this.key);
      return true;
    } catch {
      return false;
    }
  }

  public exportJSON(): string {
    const data = this.load();
    return JSON.stringify({
      version: this.version,
      key: this.key,
      exportedAt: new Date().toISOString(),
      data,
    }, null, 2);
  }

  public importJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object' || !('data' in parsed)) {
        return false;
      }
      return this.save(parsed.data as T);
    } catch {
      return false;
    }
  }
}
