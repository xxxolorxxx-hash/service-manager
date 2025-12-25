import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/schema';
import type { MaterialCost, LaborCost, OtherCost } from '@/types';

// Materials
export function useMaterialsByOrder(orderId: string) {
  const materials = useLiveQuery(
    () => db.materials.where('orderId').equals(orderId).toArray(),
    [orderId]
  );
  return { materials: materials ?? [], isLoading: materials === undefined };
}

export function useAddMaterialCost() {
  return async (cost: Omit<MaterialCost, 'id' | 'createdAt'>) => {
    const newCost: MaterialCost = {
      ...cost,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.materials.add(newCost);
    return newCost.id;
  };
}

export function useUpdateMaterialCost() {
  return async (id: string, updates: Partial<MaterialCost>) => {
    await db.materials.update(id, updates);
  };
}

export function useDeleteMaterialCost() {
  return async (id: string) => {
    await db.materials.delete(id);
  };
}

// Labor
export function useLaborByOrder(orderId: string) {
  const labor = useLiveQuery(
    () => db.labor.where('orderId').equals(orderId).toArray(),
    [orderId]
  );
  return { labor: labor ?? [], isLoading: labor === undefined };
}

export function useAddLaborCost() {
  return async (cost: Omit<LaborCost, 'id' | 'createdAt'>) => {
    const newCost: LaborCost = {
      ...cost,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.labor.add(newCost);
    return newCost.id;
  };
}

export function useUpdateLaborCost() {
  return async (id: string, updates: Partial<LaborCost>) => {
    await db.labor.update(id, updates);
  };
}

export function useDeleteLaborCost() {
  return async (id: string) => {
    await db.labor.delete(id);
  };
}

// Other Costs
export function useOtherCostsByOrder(orderId: string) {
  const otherCosts = useLiveQuery(
    () => db.otherCosts.where('orderId').equals(orderId).toArray(),
    [orderId]
  );
  return { otherCosts: otherCosts ?? [], isLoading: otherCosts === undefined };
}

export function useAddOtherCost() {
  return async (cost: Omit<OtherCost, 'id' | 'createdAt'>) => {
    const newCost: OtherCost = {
      ...cost,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.otherCosts.add(newCost);
    return newCost.id;
  };
}

export function useUpdateOtherCost() {
  return async (id: string, updates: Partial<OtherCost>) => {
    await db.otherCosts.update(id, updates);
  };
}

export function useDeleteOtherCost() {
  return async (id: string) => {
    await db.otherCosts.delete(id);
  };
}
