import type { MaterialCost, LaborCost, OtherCost } from '@/types';

export function calculateTotalMaterials(materials: MaterialCost[]): number {
  return materials.reduce((sum, item) => sum + item.total, 0);
}

export function calculateTotalLabor(labor: LaborCost[]): number {
  return labor.reduce((sum, item) => sum + item.total, 0);
}

export function calculateTotalOther(other: OtherCost[]): number {
  return other.reduce((sum, item) => sum + item.cost, 0);
}

export function calculateProfit(revenue: number, costs: number): number {
  return revenue - costs;
}

export function calculateMargin(revenue: number, profit: number): number {
  if (revenue === 0) return 0;
  return (profit / revenue) * 100;
}

export function calculateMarkup(costs: number, profit: number): number {
  if (costs === 0) return 0;
  return (profit / costs) * 100;
}
