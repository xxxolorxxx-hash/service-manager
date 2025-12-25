import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MaterialList } from '../MaterialList';
import type { MaterialCost } from '@/types';

describe('MaterialList', () => {
  const mockMaterials: MaterialCost[] = [
    {
      id: '1',
      orderId: 'ord-1',
      name: 'Cement',
      quantity: 5,
      unit: 'szt.',
      unitPrice: 20,
      vatRate: 23,
      total: 123,
      createdAt: new Date().toISOString()
    }
  ];

  it('should render empty state', () => {
    render(<MaterialList materials={[]} onDelete={() => {}} onEdit={() => {}} />);
    expect(screen.getByText(/Brak dodanych materiałów/i)).toBeInTheDocument();
  });

  it('should render list of materials', () => {
    render(<MaterialList materials={mockMaterials} onDelete={() => {}} onEdit={() => {}} />);
    expect(screen.getByText('Cement')).toBeInTheDocument();
    expect(screen.getByText(/5\s+szt\./i)).toBeInTheDocument();
  });
});
