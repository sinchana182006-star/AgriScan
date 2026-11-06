import { CropType, DiagnosisResult, FarmerNote, FarmerReminder, UserProfile } from '../types';

const DB_NAME = 'agriscan_offline_db';
const DB_VERSION = 1;

interface DBSchema {
  scans: DiagnosisResult;
  notes: FarmerNote;
  reminders: FarmerReminder;
  users: UserProfile;
  settings: { key: string; value: any };
}

class LocalDBService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private async openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('scans')) {
          const scanStore = db.createObjectStore('scans', { keyPath: 'id' });
          scanStore.createIndex('timestamp', 'timestamp', { unique: false });
          scanStore.createIndex('crop', 'cropVerification.selectedCrop', { unique: false });
        }

        if (!db.objectStoreNames.contains('notes')) {
          const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
          notesStore.createIndex('createdAt', 'createdAt', { unique: false });
          notesStore.createIndex('crop', 'crop', { unique: false });
        }

        if (!db.objectStoreNames.contains('reminders')) {
          const reminderStore = db.createObjectStore('reminders', { keyPath: 'id' });
          reminderStore.createIndex('dueDate', 'dueDate', { unique: false });
        }

        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // Helper for transactions
  private async getStore<T>(storeName: keyof DBSchema, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  // ==================== SCANS ====================
  async saveScan(scan: DiagnosisResult): Promise<void> {
    const store = await this.getStore('scans', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.put(scan);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllScans(): Promise<DiagnosisResult[]> {
    const store = await this.getStore('scans', 'readonly');
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const results = (req.result || []) as DiagnosisResult[];
        results.sort((a, b) => b.timestamp - a.timestamp);
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getScanById(id: string): Promise<DiagnosisResult | undefined> {
    const store = await this.getStore('scans', 'readonly');
    return new Promise((resolve, reject) => {
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteScan(id: string): Promise<void> {
    const store = await this.getStore('scans', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ==================== NOTES ====================
  async saveNote(note: FarmerNote): Promise<void> {
    const store = await this.getStore('notes', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.put(note);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllNotes(): Promise<FarmerNote[]> {
    const store = await this.getStore('notes', 'readonly');
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const results = (req.result || []) as FarmerNote[];
        results.sort((a, b) => b.createdAt - a.createdAt);
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async deleteNote(id: string): Promise<void> {
    const store = await this.getStore('notes', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ==================== REMINDERS ====================
  async saveReminder(reminder: FarmerReminder): Promise<void> {
    const store = await this.getStore('reminders', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.put(reminder);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllReminders(): Promise<FarmerReminder[]> {
    const store = await this.getStore('reminders', 'readonly');
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async toggleReminder(id: string): Promise<void> {
    const store = await this.getStore('reminders', 'readwrite');
    return new Promise((resolve, reject) => {
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const item = getReq.result as FarmerReminder;
        if (item) {
          item.completed = !item.completed;
          store.put(item);
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  async deleteReminder(id: string): Promise<void> {
    const store = await this.getStore('reminders', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ==================== AUTH & USERS ====================
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_agriscan_salt_offline_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async saveUser(user: UserProfile): Promise<void> {
    const store = await this.getStore('users', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.put(user);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getUserByEmail(email: string): Promise<UserProfile | undefined> {
    const store = await this.getStore('users', 'readonly');
    return new Promise((resolve, reject) => {
      const index = store.index('email');
      const req = index.get(email.toLowerCase().trim());
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // ==================== SETTINGS ====================
  async setSetting(key: string, value: any): Promise<void> {
    const store = await this.getStore('settings', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.put({ key, value });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getSetting(key: string): Promise<any> {
    const store = await this.getStore('settings', 'readonly');
    return new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result?.value);
      req.onerror = () => reject(req.error);
    });
  }
async printDatabaseToTerminal(): Promise<void> {
  const db = await this.openDB();
  const names = ['scans', 'notes', 'reminders', 'users', 'settings'];

  const data: Record<string, any[]> = {};

  for (const name of names) {
    data[name] = await new Promise((resolve, reject) => {
      const tx = db.transaction(name, 'readonly');
      const request = tx.objectStore(name).getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Never display password hashes
  data.users = data.users.map(({ passwordHash, ...user }) => user);

  const response = await fetch('http://localhost:4179/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error('Database transfer failed');

  console.log('AgriScan database sent to terminal!');
}
  // Seed default demonstration records if empty
  async seedInitialDemoData(): Promise<void> {
    const scans = await this.getAllScans();
    if (scans.length === 0) {
      // Seed default reminders
      const defaultReminders: FarmerReminder[] = [
        {
          id: 'rem-1',
          title: 'Morning scouting for downy mildew spores in Grapevine block 2',
          crop: 'grapes',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          type: 'inspection',
          completed: false,
          severity: 'urgent',
        },
        {
          id: 'rem-2',
          title: 'Apply organic copper hydroxide spray on tomato lower canopy',
          crop: 'tomato',
          dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          type: 'spray',
          completed: false,
          severity: 'normal',
        },
        {
          id: 'rem-3',
          title: 'Check yellow sticky traps for whitefly threshold in greenhouse',
          crop: 'tomato',
          dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
          type: 'inspection',
          completed: true,
          severity: 'normal',
        },
      ];

      for (const r of defaultReminders) {
        await this.saveReminder(r);
      }


      // Seed default notes
      const defaultNotes: FarmerNote[] = [
        {
          id: 'note-1',
          title: 'First Early Blight symptoms noticed after continuous heavy rainfall',
          crop: 'tomato',
          plotLocation: 'North Plot B, Bed 4',
          date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
          content: 'Pruned lowest 30cm of leaves on all 45 plants. Spread dry wheat straw mulch to reduce soil-splash inoculation.',
          createdAt: Date.now() - 86400000 * 2,
        },
        {
          id: 'note-2',
          title: 'Ladybug population established on Potato aphid colonies',
          crop: 'potato',
          plotLocation: 'East Ridge Block',
          date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
          content: 'Observed several ladybird larvae feeding actively. Withholding chemical insecticides to conserve natural biological control.',
          createdAt: Date.now() - 86400000 * 5,
        },
      ];

      for (const n of defaultNotes) {
        await this.saveNote(n);
      }
    }
  }
}

export const localDB = new LocalDBService();

if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      localDB.printDatabaseToTerminal().catch(console.error);
    }, 3000);
  }, { once: true });
}
