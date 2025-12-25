import { describe, it, expect } from 'vitest';
import { calculateTotalMaterials, calculateTotalLabor, calculateTotalOther, calculateProfit, calculateMargin, calculateMarkup } from '../finance';
import type { MaterialCost, LaborCost, OtherCost } from '@/types';

describe('Finance Utils', () => {
  it('should calculate total materials cost', () => {
    const materials = [
      { total: 100 },
      { total: 50.5 },
    ] as MaterialCost[];
    
    expect(calculateTotalMaterials(materials)).toBe(150.5);
  });

  it('should calculate total labor cost', () => {
    const labor = [
      { total: 200 },
      { total: 300 },
    ] as LaborCost[];
    
    expect(calculateTotalLabor(labor)).toBe(500);
  });

  it('should calculate total other cost', () => {
    const other = [
        { cost: 10 },
        { cost: 20 }
    ] as OtherCost[];

    expect(calculateTotalOther(other)).toBe(30);
  });

  it('should calculate profit', () => {
    expect(calculateProfit(1000, 800)).toBe(200);
  });

  it('should calculate margin', () => {
    // Margin = (Profit / Revenue) * 100
    // (200 / 1000) * 100 = 20%
    expect(calculateMargin(1000, 200)).toBe(20);
    expect(calculateMargin(0, 0)).toBe(0);
  });

  it('should calculate markup', () => {
    // Markup = (Profit / Cost) * 100
    // (200 / 800) * 100 = 25%
    expect(calculateMarkup(800, 200)).toBe(25);
    expect(calculateMarkup(0, 0)).toBe(0);
  });
});
