import Dexie from 'dexie';
import type { Client, Order, Quote, AppSettings, Activity } from '@/types';

export class ServiceDatabase extends Dexie {
  clients!: Dexie.Table<Client>;
  orders!: Dexie.Table<Order>;
  quotes!: Dexie.Table<Quote>;
  settings!: Dexie.Table<AppSettings>;
  activities!: Dexie.Table<Activity>;

  constructor() {
    super('ServiceAppDB');

    this.version(1).stores({
      clients: 'id, name, phone, email, company, createdAt',
      orders: 'id, orderNumber, clientId, status, startDate, createdAt',
      quotes: 'id, quoteNumber, clientId, orderId, status, createdAt',
      settings: 'key',
      activities: 'id, type, action, timestamp',
    });
  }
}

export const db = new ServiceDatabase();

export async function initializeDatabase() {
  await db.open();

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
      },
    ] as any);
  }

  return db;
}

export async function resetDatabase() {
  await db.delete();
  await initializeDatabase();
}
