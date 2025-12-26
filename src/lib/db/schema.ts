import Dexie from 'dexie';
import type { Client, Order, Quote, AppSettings, Activity, MaterialCost, LaborCost, OtherCost } from '@/types';

export class ServiceDatabase extends Dexie {
  clients!: Dexie.Table<Client>;
  orders!: Dexie.Table<Order>;
  quotes!: Dexie.Table<Quote>;
  settings!: Dexie.Table<AppSettings>;
  activities!: Dexie.Table<Activity>;
  materials!: Dexie.Table<MaterialCost>;
  labor!: Dexie.Table<LaborCost>;
  otherCosts!: Dexie.Table<OtherCost>;

  constructor() {
    super('ServiceAppDB');

    this.version(1).stores({
      clients: 'id, name, phone, email, company, createdAt',
      orders: 'id, orderNumber, clientId, status, startDate, createdAt',
      quotes: 'id, quoteNumber, clientId, orderId, status, createdAt',
      settings: 'key',
      activities: 'id, type, action, timestamp',
    });

    this.version(2).stores({
      clients: 'id, name, phone, email, company, createdAt',
      orders: 'id, orderNumber, clientId, status, startDate, createdAt',
      quotes: 'id, quoteNumber, clientId, orderId, status, createdAt',
      settings: 'key',
      activities: 'id, type, action, timestamp',
      materials: 'id, orderId, createdAt',
      labor: 'id, orderId, createdAt',
      otherCosts: 'id, orderId, createdAt',
    });
  }
}

export const db = new ServiceDatabase();

export async function initializeDatabase() {
  try {
    await db.open();
  } catch (error: any) {
    // Handle schema upgrade errors by resetting the database in development
    if (error.name === 'UpgradeError' || error.name === 'SchemaError') {
      console.warn('Database schema mismatch, resetting database...', error);
      await db.delete();
      await db.open();
    } else {
      console.error('Failed to open database:', error);
      throw error;
    }
  }

  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.bulkAdd([
      {
        key: 'app',
        companyName: '',
        companyAddress: '',
        defaultVatRate: 23,
        quoteValidDays: 30,
        currency: 'PLN',
        dateFormat: 'DD MMM YYYY',
      } as unknown as AppSettings,
    ]);
  }

  return db;
}

export async function resetDatabase() {
  await db.delete();
  await initializeDatabase();
}
