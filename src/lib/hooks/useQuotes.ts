import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/schema';
import type { Quote, QuoteStatus } from '@/types';
import { calculateVAT } from '@/lib/utils/formatters';

export function useQuotes() {
  const quotes = useLiveQuery(() => db.quotes.toArray());
  return { quotes: quotes ?? [], isLoading: quotes === undefined };
}

export function useQuotesByStatus(status?: QuoteStatus) {
  const quotes = useLiveQuery(() => {
    const query = status
      ? db.quotes.where('status').equals(status)
      : db.quotes.toCollection();
    return query.toArray();
  });

  return { quotes: quotes ?? [], isLoading: quotes === undefined };
}

export function useQuotesByClient(clientId: string) {
  const quotes = useLiveQuery(() => db.quotes.where('clientId').equals(clientId).toArray());
  return { quotes: quotes ?? [], isLoading: quotes === undefined };
}

export function useQuoteById(id: string) {
  const quote = useLiveQuery(() => db.quotes.get(id));
  return { quote: quote ?? null, isLoading: quote === undefined };
}

export function useCreateQuote() {
  return async (quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt' | 'subtotal' | 'vatTotal' | 'total'>) => {
    const items = quote.items || [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items: _, ...quoteData } = quote;

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const vatTotal = items.reduce((sum, item) => sum + calculateVAT(item.quantity * item.unitPrice, item.vatRate), 0);
    const total = subtotal + vatTotal;

    const quoteNumber = await generateQuoteNumber();

    const newQuote: Quote = {
      ...quoteData,
      items,
      id: crypto.randomUUID(),
      quoteNumber,
      subtotal,
      vatTotal,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.quotes.add(newQuote);
    await addActivity('quote', 'created', newQuote.id, quoteNumber);
    return newQuote;
  };
}

export function useUpdateQuote() {
  return async (id: string, updates: Partial<Omit<Quote, 'quoteNumber'>>) => {
    const quote = await db.quotes.get(id);

    if (quote && updates.items) {
      const subtotal = updates.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const vatTotal = updates.items.reduce((sum, item) => sum + calculateVAT(item.quantity * item.unitPrice, item.vatRate), 0);
      const total = subtotal + vatTotal;

      await db.quotes.update(id, {
        ...updates,
        subtotal,
        vatTotal,
        total,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await db.quotes.update(id, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  };
}

export function useUpdateQuoteStatus() {
  return async (id: string, status: QuoteStatus) => {
    await db.quotes.update(id, {
      status,
      updatedAt: new Date().toISOString(),
    });
  };
}

export function useDeleteQuote() {
  return async (id: string) => {
    const quote = await db.quotes.get(id);
    if (quote) {
      await db.quotes.delete(id);
      await addActivity('quote', 'deleted', id, quote.quoteNumber);
    }
  };
}

async function generateQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `KS/${year}/`;

  const existingQuotes = await db.quotes
    .filter((quote) => quote.quoteNumber.startsWith(prefix))
    .toArray();

  const maxNumber = existingQuotes.reduce((max, quote) => {
    const num = parseInt(quote.quoteNumber.split('/')[2] || '0');
    return num > max ? num : max;
  }, 0);

  const nextNumber = (maxNumber + 1).toString().padStart(4, '0');
  return `${prefix}${nextNumber}`;
}

async function addActivity(type: 'quote', action: 'created' | 'updated' | 'deleted', itemId: string, itemName: string) {
  await db.activities.add({
    id: crypto.randomUUID(),
    type,
    action,
    itemId,
    itemName,
    timestamp: new Date().toISOString(),
  });
}
