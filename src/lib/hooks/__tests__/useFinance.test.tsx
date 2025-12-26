import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useAddMaterialCost,
  useMaterialsByOrder,
  useDeleteMaterialCost,
  useUpdateMaterialCost,
  useAddLaborCost,
  useLaborByOrder,
  useDeleteLaborCost,
  useUpdateLaborCost,
  useAddOtherCost,
  useOtherCostsByOrder,
  useUpdateOtherCost,
  useDeleteOtherCost
} from '../useFinance';
import { resetDatabase } from '@/lib/db/schema';

describe('useFinance Hooks', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe('Materials', () => {
    it('should add and retrieve material costs', async () => {
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

      await waitFor(() => {
        expect(getMaterials.current.materials).toHaveLength(1);
      });

      expect(getMaterials.current.materials[0]).toMatchObject(material);
    });

    it('should update material cost', async () => {
      const orderId = 'ord-1';
      const { result: addMaterial } = renderHook(() => useAddMaterialCost());
      const { result: updateMaterial } = renderHook(() => useUpdateMaterialCost());
      const { result: getMaterials } = renderHook(() => useMaterialsByOrder(orderId));

      let id = '';
      await act(async () => {
        id = await addMaterial.current({
          orderId,
          name: 'Old Name',
          quantity: 1,
          unit: 'pc',
          unitPrice: 10,
          vatRate: 23,
          total: 12.3
        });
      });

      await act(async () => {
        await updateMaterial.current(id, { name: 'New Name' });
      });

      await waitFor(() => {
        expect(getMaterials.current.materials[0].name).toBe('New Name');
      });
    });

    it('should delete material cost', async () => {
      const orderId = 'ord-1';
      const { result: addMaterial } = renderHook(() => useAddMaterialCost());
      const { result: deleteMaterial } = renderHook(() => useDeleteMaterialCost());
      const { result: getMaterials } = renderHook(() => useMaterialsByOrder(orderId));

      let id = '';
      await act(async () => {
        id = await addMaterial.current({
          orderId,
          name: 'Paint',
          total: 123,
          quantity: 1,
          unit: 'l',
          unitPrice: 100,
          vatRate: 23
        });
      });

      await act(async () => {
        await deleteMaterial.current(id);
      });

      await waitFor(() => {
        expect(getMaterials.current.materials).toHaveLength(0);
      });
    });
  });

  describe('Labor', () => {
    it('should add, update and delete labor costs', async () => {
      const orderId = 'ord-1';
      const { result: addLabor } = renderHook(() => useAddLaborCost());
      const { result: updateLabor } = renderHook(() => useUpdateLaborCost());
      const { result: deleteLabor } = renderHook(() => useDeleteLaborCost());
      const { result: getLabor } = renderHook(() => useLaborByOrder(orderId));

      let id = '';
      // Add
      await act(async () => {
        id = await addLabor.current({
          orderId,
          description: 'Painting',
          hours: 5,
          ratePerHour: 100,
          total: 500
        });
      });

      await waitFor(() => {
        expect(getLabor.current.labor).toHaveLength(1);
      });

      // Update
      await act(async () => {
        await updateLabor.current(id, { description: 'Updated Painting', hours: 6, total: 600 });
      });

      await waitFor(() => {
        expect(getLabor.current.labor[0].description).toBe('Updated Painting');
        expect(getLabor.current.labor[0].hours).toBe(6);
      });

      // Delete
      await act(async () => {
        await deleteLabor.current(id);
      });

      await waitFor(() => {
        expect(getLabor.current.labor).toHaveLength(0);
      });
    });
  });

  describe('Other Costs', () => {
    it('should add, update and delete other costs', async () => {
      const orderId = 'ord-1';
      const { result: addOther } = renderHook(() => useAddOtherCost());
      const { result: updateOther } = renderHook(() => useUpdateOtherCost());
      const { result: deleteOther } = renderHook(() => useDeleteOtherCost());
      const { result: getOther } = renderHook(() => useOtherCostsByOrder(orderId));

      let id = '';
      // Add
      await act(async () => {
        id = await addOther.current({
          orderId,
          description: 'Transport',
          cost: 100
        });
      });

      await waitFor(() => {
        expect(getOther.current.otherCosts).toHaveLength(1);
      });

      // Update
      await act(async () => {
        await updateOther.current(id, { description: 'Updated Transport', cost: 150 });
      });

      await waitFor(() => {
        expect(getOther.current.otherCosts[0].description).toBe('Updated Transport');
        expect(getOther.current.otherCosts[0].cost).toBe(150);
      });

      // Delete
      await act(async () => {
        await deleteOther.current(id);
      });

      await waitFor(() => {
        expect(getOther.current.otherCosts).toHaveLength(0);
      });
    });
  });
});
