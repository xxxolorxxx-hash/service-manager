import { describe, it, expect, beforeEach } from 'vitest';
import { db, resetDatabase } from '../schema';

describe('Database Schema', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should have materials table', async () => {
    const material = {
      id: 'mat-1',
      orderId: 'ord-1',
      name: 'Cement',
      quantity: 5,
      unit: 'kg',
      unitPrice: 20,
      vatRate: 23,
      total: 123, // 100 + 23% VAT? Or just sum. Spec says "Obliczanie sumy kosztów". Usually stored total includes everything or we calculate it. Let's assume stored total for cache or calculate on fly. Spec: "Obliczanie sumy kosztów materiałowych".
      // Let's store what we agreed in types: id, orderId, name, quantity, unit, unitPrice, vatRate, total.
      createdAt: new Date().toISOString()
    };

    await db.materials.add(material);
    
    const stored = await db.materials.get('mat-1');
    expect(stored).toEqual(material);
  });

  it('should have labor table', async () => {
     const labor = {
      id: 'lab-1',
      orderId: 'ord-1',
      description: 'Malowanie',
      hours: 10,
      ratePerHour: 50,
      total: 500,
      createdAt: new Date().toISOString()
    };

    await db.labor.add(labor);
    
    const stored = await db.labor.get('lab-1');
    expect(stored).toEqual(labor);
  });

  it('should have otherCosts table', async () => {
    const cost = {
     id: 'oth-1',
     orderId: 'ord-1',
     description: 'Transport',
     cost: 150,
     createdAt: new Date().toISOString()
   };

   await db.otherCosts.add(cost);
   
   const stored = await db.otherCosts.get('oth-1');
   expect(stored).toEqual(cost);
 });
});
