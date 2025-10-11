type StoreData = Record<string, any>;

export class GlobalStore {
  private static instance: GlobalStore;
  private data: StoreData = {};
  private persistEnabled: boolean;

  private constructor(persist = false) {
    this.persistEnabled = persist;
    if (persist) {
      this.data = this.loadFromLocalStorage();
    }
  }

  /** Get the singleton instance */
  public static getInstance(persist = false): GlobalStore {
    if (!GlobalStore.instance) {
      GlobalStore.instance = new GlobalStore(persist);
    } else if (persist && !GlobalStore.instance.persistEnabled) {
      // If persistence was disabled initially, you can enable it later
      GlobalStore.instance.enablePersistence();
    }
    return GlobalStore.instance;
  }

  /** Enable persistence (lazy activation) */
  public enablePersistence(): void {
    if (!this.persistEnabled) {
      this.persistEnabled = true;
      this.saveToLocalStorage();
    }
  }

  /** Disable persistence (does not delete existing localStorage data) */
  public disablePersistence(): void {
    this.persistEnabled = false;
  }

  /** Set a value (optionally persist just this key) */
  public set<T = any>(key: string, value: T, persistOverride?: boolean): void {
    this.data[key] = value;
    if (persistOverride ?? this.persistEnabled) {
      this.saveToLocalStorage();
    }
  }

  /** Get a value */
  public get<T = any>(key: string): T | undefined {
    return this.data[key];
  }

  /** Remove a key (optionally persist) */
  public remove(key: string, persistOverride?: boolean): void {
    delete this.data[key];
    if (persistOverride ?? this.persistEnabled) {
      this.saveToLocalStorage();
    }
  }

  /** Clear all keys (optionally persist) */
  public clear(persistOverride?: boolean): void {
    this.data = {};
    if (persistOverride ?? this.persistEnabled) {
      this.saveToLocalStorage();
    }
  }

  // ---- Private Helpers ----

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('GlobalStore', JSON.stringify(this.data));
    } catch (err) {
      console.warn('Failed to save GlobalStore to localStorage:', err);
    }
  }

  private loadFromLocalStorage(): StoreData {
    try {
      const stored = localStorage.getItem('GlobalStore');
      return stored ? JSON.parse(stored) : {};
    } catch (err) {
      console.warn('Failed to load GlobalStore from localStorage:', err);
      return {};
    }
  }
}
