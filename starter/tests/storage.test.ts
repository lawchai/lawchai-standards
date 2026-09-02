import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageManager } from '../src/lib/storage';

describe('LocalStorageManager', () => {
  const memoryStorage = new Map<string, string>();

  beforeEach(() => {
    memoryStorage.clear();
    global.localStorage = {
      getItem: (key: string) => memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string) => { memoryStorage.set(key, value); },
      removeItem: (key: string) => { memoryStorage.delete(key); },
      clear: () => memoryStorage.clear(),
      length: memoryStorage.size,
      key: (index: number) => Array.from(memoryStorage.keys())[index] ?? null,
    };
  });

  it('loads default value when uninitialized', () => {
    const manager = new LocalStorageManager({
      key: 'test_key',
      version: 1,
      defaultValue: { count: 0 },
    });

    expect(manager.load()).toEqual({ count: 0 });
  });

  it('saves and reloads state with envelope', () => {
    const manager = new LocalStorageManager({
      key: 'test_key',
      version: 1,
      defaultValue: { count: 0 },
    });

    expect(manager.save({ count: 42 })).toBe(true);
    expect(manager.load()).toEqual({ count: 42 });
  });

  it('exports and imports JSON safely', () => {
    const manager = new LocalStorageManager({
      key: 'test_key',
      version: 1,
      defaultValue: { count: 0 },
    });

    manager.save({ count: 100 });
    const json = manager.exportJSON();
    expect(json).toContain('"count": 100');

    manager.reset();
    expect(manager.load()).toEqual({ count: 0 });

    const imported = manager.importJSON(json);
    expect(imported).toBe(true);
    expect(manager.load()).toEqual({ count: 100 });
  });
});
