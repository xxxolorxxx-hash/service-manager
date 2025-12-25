import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAddMaterialCost, useMaterialsByOrder, useDeleteMaterialCost, useAddLaborCost, useLaborByOrder } from '../useFinance';
import { resetDatabase } from '@/lib/db/schema';

describe('useFinance Hooks', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should add and retrieve material costs', async () => {
    // Setup: create order
    const orderId = 'ord-1';

    const { result: addMaterial } = renderHook(() => useAddMaterialCost());
    const { result: getMaterials } = renderHook(() => useMaterialsByOrder(orderId));

    const material = {
      orderId,
      name: 'Paint',
      quantity: 2,
      unit: 'liters',
      unitPrice: 50,
      vatRate: 23,
      total: 123
    };

    await act(async () => {
      await addMaterial.current(material);
    });

    // Wait for live query to update
    await waitFor(() => {
      expect(getMaterials.current.materials).toHaveLength(1);
    });

    expect(getMaterials.current.materials[0]).toMatchObject(material);
  });

  it('should delete material cost', async () => {
    const orderId = 'ord-1';
    const { result: addMaterial } = renderHook(() => useAddMaterialCost());
    const { result: deleteMaterial } = renderHook(() => useDeleteMaterialCost());
    const { result: getMaterials } = renderHook(() => useMaterialsByOrder(orderId));

    const material = {
      orderId,
      name: 'Paint',
      quantity: 2,
      unit: 'liters',
      unitPrice: 50,
      vatRate: 23,
      total: 123
    };

    let id = '';
    await act(async () => {
      id = await addMaterial.current(material);
    });

    await waitFor(() => {
      expect(getMaterials.current.materials).toHaveLength(1);
    });

    await act(async () => {
      await deleteMaterial.current(id);
    });

    await waitFor(() => {
      expect(getMaterials.current.materials).toHaveLength(0);
    });
  });

  it('should add and retrieve labor costs', async () => {
    const orderId = 'ord-1';
    const { result: addLabor } = renderHook(() => useAddLaborCost());
    const { result: getLabor } = renderHook(() => useLaborByOrder(orderId));

    const labor = {
      orderId,
      description: 'Painting',
      hours: 5,
      ratePerHour: 100,
      total: 500
    };

    await act(async () => {
      await addLabor.current(labor);
    });

    await waitFor(() => {
      expect(getLabor.current.labor).toHaveLength(1);
    });

    expect(getLabor.current.labor[0]).toMatchObject(labor);
  });
});
