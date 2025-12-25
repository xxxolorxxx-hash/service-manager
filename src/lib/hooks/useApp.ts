import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/schema';
import type { AppSettings } from '@/types';

export function useRecentActivities(limit = 10) {
  const activities = useLiveQuery(() =>
    db.activities.orderBy('timestamp').reverse().limit(limit).toArray()
  );
  return { activities: activities ?? [], isLoading: activities === undefined };
}

export function useSettings() {
  const settings = useLiveQuery(() => db.settings.get('app'));
  return { settings: settings ?? null, isLoading: settings === undefined };
}

export function useUpdateSettings() {
  return async (settings: Partial<AppSettings>) => {
    await db.settings.update('app', settings);
  };
}

export function useCreateDemoData() {
  return async () => {
    const clients = [
      {
        id: crypto.randomUUID(),
        name: 'Jan Kowalski',
        company: 'Firma Kowalski',
        email: 'jan@kowalski.pl',
        phone: '+48 123 456 789',
        address: 'Warszawa, ul. Długa 1',
        nip: '1234567890',
        notes: 'Regularny klient',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Anna Nowak',
        email: 'anna@nowak.pl',
        phone: '+48 987 654 321',
        address: 'Kraków, ul. Wesoła 15',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Piotr Wiśniewski',
        company: 'Remonty Wiśniewski',
        email: 'biuro@remonty.pl',
        phone: '+48 555 123 456',
        address: 'Wrocław, ul. Piękna 20',
        nip: '0987654321',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const orders = [
      {
        id: crypto.randomUUID(),
        orderNumber: 'ZL/2025/0001',
        clientId: clients[0].id,
        title: 'Remont łazienki',
        description: 'Wymiana glazury, instalacji hydraulicznej i oświetlenia',
        status: 'w trakcie' as const,
        value: 5000,
        startDate: new Date().toISOString(),
        address: 'Warszawa, ul. Długa 1',
        notes: 'Zakończenie planowane: 15.02.2025',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        orderNumber: 'ZL/2025/0002',
        clientId: clients[2].id,
        title: 'Instalacja HVAC',
        description: 'Kompleksowa instalacja ogrzewania i klimatyzacji',
        status: 'nowe' as const,
        value: 15000,
        startDate: new Date().toISOString(),
        address: 'Wrocław, ul. Piękna 20',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const quotes = [
      {
        id: crypto.randomUUID(),
        quoteNumber: 'KS/2025/0001',
        clientId: clients[0].id,
        orderId: orders[0].id,
        status: 'projekt' as const,
        items: [
          {
            id: crypto.randomUUID(),
            name: 'Glazura łazienkowa',
            quantity: 15,
            unit: 'm²',
            unitPrice: 150,
            vatRate: 23,
            total: 15 * 150 * 1.23,
          },
          {
            id: crypto.randomUUID(),
            name: 'Usługa układania',
            quantity: 15,
            unit: 'm²',
            unitPrice: 100,
            vatRate: 23,
            total: 15 * 100 * 1.23,
          },
          {
            id: crypto.randomUUID(),
            name: 'Instalacja hydrauliczna',
            quantity: 1,
            unit: 'szt',
            unitPrice: 1200,
            vatRate: 23,
            total: 1200 * 1.23,
          },
        ],
        subtotal: 15 * 150 + 15 * 100 + 1200,
        vatTotal: 15 * 150 * 0.23 + 15 * 100 * 0.23 + 1200 * 0.23,
        total: 15 * 150 * 1.23 + 15 * 100 * 1.23 + 1200 * 1.23,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Wycena ważna 30 dni',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await db.clients.bulkAdd(clients);
    await db.orders.bulkAdd(orders);
    await db.quotes.bulkAdd(quotes);

    await db.activities.bulkAdd([
      { id: crypto.randomUUID(), type: 'client' as const, action: 'created' as const, itemId: clients[0].id, itemName: clients[0].name, timestamp: new Date().toISOString() },
      { id: crypto.randomUUID(), type: 'order' as const, action: 'created' as const, itemId: orders[0].id, itemName: orders[0].title, timestamp: new Date().toISOString() },
      { id: crypto.randomUUID(), type: 'quote' as const, action: 'created' as const, itemId: quotes[0].id, itemName: quotes[0].quoteNumber, timestamp: new Date().toISOString() },
    ]);
  };
}

export function useExportData() {
  return async () => {
    const clients = await db.clients.toArray();
    const orders = await db.orders.toArray();
    const quotes = await db.quotes.toArray();
    const settings = await db.settings.toArray();

    const data = {
      exportDate: new Date().toISOString(),
      clients,
      orders,
      quotes,
      settings,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
}

export function useImportData() {
  return async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);

    if (data.clients) await db.clients.bulkAdd(data.clients);
    if (data.orders) await db.orders.bulkAdd(data.orders);
    if (data.quotes) await db.quotes.bulkAdd(data.quotes);
    if (data.settings) await db.settings.bulkPut(data.settings);
  };
}
