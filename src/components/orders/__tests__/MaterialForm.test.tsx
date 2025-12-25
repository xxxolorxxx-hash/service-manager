import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MaterialForm } from '../MaterialForm';
import { Dialog } from '@/components/ui/dialog';

describe('MaterialForm', () => {
  it('should validate required fields', async () => {
    const handleSubmit = vi.fn();
    render(
      <Dialog open={true}>
        <MaterialForm title="Test" onSubmit={handleSubmit} onClose={() => {}} />
      </Dialog>
    );
    
    fireEvent.click(screen.getByText('Zapisz'));
    
    expect(await screen.findByText('Nazwa jest wymagana')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with calculated total', async () => {
    const handleSubmit = vi.fn();
    render(
      <Dialog open={true}>
        <MaterialForm title="Test" onSubmit={handleSubmit} onClose={() => {}} />
      </Dialog>
    );
    
    fireEvent.change(screen.getByLabelText(/Nazwa materiału/i), { target: { value: 'Cement' } });
    fireEvent.change(screen.getByLabelText(/Ilość/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Cena jedn. netto/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/Stawka VAT/i), { target: { value: '23' } });
    
    fireEvent.click(screen.getByText('Zapisz'));
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Cement',
        quantity: 2,
        unitPrice: 50,
        vatRate: 23,
        total: 123
      }));
    });
  });
});
