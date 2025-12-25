import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/schema';
import type { Client } from '@/types';

export function useClients() {
  const clients = useLiveQuery(() => db.clients.toArray());
  return { clients: clients ?? [], isLoading: clients === undefined };
}

export function useClientById(id: string) {
  const client = useLiveQuery(() => db.clients.get(id));
  return { client: client ?? null, isLoading: client === undefined };
}

export function useCreateClient() {
  return async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.clients.add(newClient);
    await db.activities.add({
      id: crypto.randomUUID(),
      type: 'client',
      action: 'created',
      itemId: newClient.id,
      itemName: newClient.name,
      timestamp: new Date().toISOString(),
    });
    return newClient;
  };
}

export function useUpdateClient() {
  return async (id: string, updates: Partial<Client>) => {
    await db.clients.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };
}

export function useDeleteClient() {
  return async (id: string) => {
    const client = await db.clients.get(id);
    if (client) {
      await db.clients.delete(id);
      await db.activities.add({
        id: crypto.randomUUID(),
        type: 'client',
        action: 'deleted',
        itemId: id,
        itemName: client.name,
        timestamp: new Date().toISOString(),
      });
    }
  };
}

export async function searchClients(query: string) {
  return await db.clients
    .filter((client) =>
      client.name.toLowerCase().includes(query.toLowerCase()) ||
      client.phone.includes(query) ||
      (client.email && client.email.toLowerCase().includes(query.toLowerCase()))
    )
    .toArray();
}
