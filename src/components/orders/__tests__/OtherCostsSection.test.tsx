import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OtherCostsSection } from '../OtherCostsSection';
import * as useFinance from '@/lib/hooks/useFinance';

// Mock the hooks
vi.mock('@/lib/hooks/useFinance', () => ({
    useOtherCostsByOrder: vi.fn(),
    useDeleteOtherCost: vi.fn(),
    useAddOtherCost: vi.fn(() => vi.fn()),
    useUpdateOtherCost: vi.fn(() => vi.fn())
}));

// Mock the toast hook
vi.mock('@/lib/hooks/useToast', () => ({
    useToast: () => ({ toast: vi.fn() })
}));

describe('OtherCostsSection', () => {
    const orderId = 'ord-1';
    const mockOtherCosts = [
        { id: 'o1', description: 'Transport', cost: 100, orderId }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useFinance.useOtherCostsByOrder as any).mockReturnValue({
            otherCosts: mockOtherCosts,
            isLoading: false
        });
    });

    it('renders other costs entries and total', () => {
        render(<OtherCostsSection orderId={orderId} />);

        expect(screen.getByText(/Inne koszty/i)).toBeInTheDocument();
        expect(screen.getByText(/Transport/i)).toBeInTheDocument();
        expect(screen.getByText(/100,00/)).toBeInTheDocument();
    });

    it('opens add dialog on button click', () => {
        render(<OtherCostsSection orderId={orderId} />);

        fireEvent.click(screen.getByText(/Dodaj koszt/i));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Dodaj inny koszt/i)).toBeInTheDocument();
    });

    it('opens edit dialog on edit button click', () => {
        render(<OtherCostsSection orderId={orderId} />);

        const editButton = screen.getByLabelText('Edytuj');
        fireEvent.click(editButton);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Edytuj inny koszt/i)).toBeInTheDocument();
    });

    it('handles delete with confirmation', async () => {
        const deleteMock = vi.fn().mockResolvedValue(true);
        (useFinance.useDeleteOtherCost as any).mockReturnValue(deleteMock);

        const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

        render(<OtherCostsSection orderId={orderId} />);

        const deleteButton = screen.getByLabelText('Usuń');
        fireEvent.click(deleteButton);

        expect(confirmSpy).toHaveBeenCalled();
        expect(deleteMock).toHaveBeenCalledWith('o1');

        confirmSpy.mockRestore();
    });
});
