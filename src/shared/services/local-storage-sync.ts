export class LocalStorageSync {
  private static storePrefix = 'redux-state-';

  static async putState<S>(key: string, data: Partial<S>): Promise<void> {
    const serialized = JSON.stringify(data);

    localStorage.setItem(`${LocalStorageSync.storePrefix}${key}`, serialized);
  }

  static async getStore<S>(): Promise<Partial<S>> {
    if (localStorage.length === 0) {
      return {};
    }

    const stored: Partial<S> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) as string;
      const isStateValue = key.startsWith(LocalStorageSync.storePrefix);

      if (isStateValue) {
        const stateKey = key.substring(LocalStorageSync.storePrefix.length) as keyof S;
        stored[stateKey] = JSON.parse(localStorage.getItem(key) as string);
      }
    }

    return stored;
  }
}
