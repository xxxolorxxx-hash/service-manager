import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OtherCostForm } from '../OtherCostForm';
import { Dialog } from '@/components/ui/dialog';

describe('OtherCostForm', () => {
    it('should validate required fields', async () => {
        const handleSubmit = vi.fn();
        render(
            <Dialog open={true}>
                <OtherCostForm title="Test" onSubmit={handleSubmit} onClose={() => { }} />
            </Dialog>
        );

        fireEvent.click(screen.getByText('Zapisz'));

        expect(await screen.findByText('Opis jest wymagany')).toBeInTheDocument();
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should call onSubmit with data', async () => {
        const handleSubmit = vi.fn();
        render(
            <Dialog open={true}>
                <OtherCostForm title="Test" onSubmit={handleSubmit} onClose={() => { }} />
            </Dialog>
        );

        fireEvent.change(screen.getByLabelText(/Opis kosztu/i), { target: { value: 'Transport' } });
        fireEvent.change(screen.getByLabelText(/Kwota/i), { target: { value: '250' } });

        fireEvent.click(screen.getByText('Zapisz'));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
                description: 'Transport',
                cost: 250
            }));
        });
    });
});
