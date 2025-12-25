import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LaborForm } from '../LaborForm';
import { Dialog } from '@/components/ui/dialog';

describe('LaborForm', () => {
    it('should validate required fields', async () => {
        const handleSubmit = vi.fn();
        render(
            <Dialog open={true}>
                <LaborForm title="Test" onSubmit={handleSubmit} onClose={() => { }} />
            </Dialog>
        );

        // Clear default values for testing validation if needed, 
        // but here we just submit and check for description which is empty by default
        fireEvent.click(screen.getByText('Zapisz'));

        expect(await screen.findByText('Opis jest wymagany')).toBeInTheDocument();
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should call onSubmit with calculated total', async () => {
        const handleSubmit = vi.fn();
        render(
            <Dialog open={true}>
                <LaborForm title="Test" onSubmit={handleSubmit} onClose={() => { }} />
            </Dialog>
        );

        fireEvent.change(screen.getByLabelText(/Opis prac/i), { target: { value: 'Malowanie' } });
        fireEvent.change(screen.getByLabelText(/Liczba godzin/i), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText(/Stawka za h/i), { target: { value: '100' } });

        fireEvent.click(screen.getByText('Zapisz'));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
                description: 'Malowanie',
                hours: 10,
                ratePerHour: 100,
                total: 1000
            }));
        });
    });
});
