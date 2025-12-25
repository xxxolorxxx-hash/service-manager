import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/schema';
import type { Order, OrderStatus, ChecklistItem } from '@/types';

export function useOrders() {
  const orders = useLiveQuery(() => db.orders.toArray());
  return { orders: orders ?? [], isLoading: orders === undefined };
}

export function useOrdersByStatus(status?: OrderStatus) {
  const orders = useLiveQuery(() => {
    const query = status
      ? db.orders.where('status').equals(status)
      : db.orders.toCollection();
    return query.toArray();
  });

  return { orders: orders ?? [], isLoading: orders === undefined };
}

export function useOrdersByClient(clientId: string) {
  const orders = useLiveQuery(() => db.orders.where('clientId').equals(clientId).toArray());
  return { orders: orders ?? [], isLoading: orders === undefined };
}

export function useActiveOrders() {
  const orders = useLiveQuery(() =>
    db.orders.where('status').anyOf(['nowe', 'w trakcie', 'oczekujące']).toArray()
  );
  return { orders: orders ?? [], isLoading: orders === undefined };
}

export function useOrderById(id: string) {
  const order = useLiveQuery(() => db.orders.get(id));
  return { order: order ?? null, isLoading: order === undefined };
}

export function useCreateOrder() {
  return async (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const orderNumber = await generateOrderNumber();
    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.orders.add(newOrder);
    await addActivity('order', 'created', newOrder.id, newOrder.title);
    return newOrder;
  };
}

export function useUpdateOrder() {
  return async (id: string, updates: Partial<Order>) => {
    await db.orders.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };
}

export function useUpdateOrderTasks() {
  return async (id: string, tasks: ChecklistItem[]) => {
    await db.orders.update(id, {
      tasks,
      updatedAt: new Date().toISOString(),
    });
  };
}

export function useUpdateOrderStatus() {
  return async (id: string, status: OrderStatus) => {
    await db.orders.update(id, {
      status,
      updatedAt: new Date().toISOString(),
    });
  };
}

export function useDeleteOrder() {
  return async (id: string) => {
    const order = await db.orders.get(id);
    if (order) {
      await db.orders.delete(id);
      await addActivity('order', 'deleted', id, order.title);
    }
  };
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `ZL/${year}/`;

  const existingOrders = await db.orders
    .filter((order) => order.orderNumber.startsWith(prefix))
    .toArray();

  const maxNumber = existingOrders.reduce((max, order) => {
    const num = parseInt(order.orderNumber.split('/')[2] || '0');
    return num > max ? num : max;
  }, 0);

  const nextNumber = (maxNumber + 1).toString().padStart(4, '0');
  return `${prefix}${nextNumber}`;
}

async function addActivity(type: 'order', action: 'created' | 'updated' | 'deleted', itemId: string, itemName: string) {
  await db.activities.add({
    id: crypto.randomUUID(),
    type,
    action,
    itemId,
    itemName,
    timestamp: new Date().toISOString(),
  });
}
