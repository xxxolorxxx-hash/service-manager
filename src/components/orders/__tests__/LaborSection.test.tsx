import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LaborSection } from '../LaborSection';
import * as useFinance from '@/lib/hooks/useFinance';

// Mock the hooks
vi.mock('@/lib/hooks/useFinance', () => ({
    useLaborByOrder: vi.fn(),
    useDeleteLaborCost: vi.fn(),
    useAddLaborCost: vi.fn(() => vi.fn()),
    useUpdateLaborCost: vi.fn(() => vi.fn())
}));

// Mock the toast hook
vi.mock('@/lib/hooks/useToast', () => ({
    useToast: () => ({ toast: vi.fn() })
}));

describe('LaborSection', () => {
    const orderId = 'ord-1';
    const mockLabor = [
        { id: 'l1', description: 'Painting', hours: 5, ratePerHour: 100, total: 500, orderId }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useFinance.useLaborByOrder as any).mockReturnValue({
            labor: mockLabor,
            isLoading: false
        });
    });

    it('renders labor entries and total', () => {
        render(<LaborSection orderId={orderId} />);

        expect(screen.getByText(/Robocizna/i)).toBeInTheDocument();
        expect(screen.getByText(/Painting/i)).toBeInTheDocument();
        expect(screen.getByText(/500,00/)).toBeInTheDocument();
    });

    it('opens add dialog on button click', () => {
        render(<LaborSection orderId={orderId} />);

        fireEvent.click(screen.getByText(/Dodaj robociznę/i));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Dodaj koszt robocizny/i)).toBeInTheDocument();
    });

    it('opens edit dialog on edit button click', () => {
        render(<LaborSection orderId={orderId} />);

        const editButton = screen.getByLabelText('Edytuj');
        fireEvent.click(editButton);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Edytuj koszt robocizny/i)).toBeInTheDocument();
    });

    it('handles delete with confirmation', async () => {
        const deleteMock = vi.fn().mockResolvedValue(true);
        (useFinance.useDeleteLaborCost as any).mockReturnValue(deleteMock);

        const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

        render(<LaborSection orderId={orderId} />);

        const deleteButton = screen.getByLabelText('Usuń');
        fireEvent.click(deleteButton);

        expect(confirmSpy).toHaveBeenCalled();
        expect(deleteMock).toHaveBeenCalledWith('l1');

        confirmSpy.mockRestore();
    });

    it('does not delete when confirmation is cancelled', async () => {
        const deleteMock = vi.fn();
        (useFinance.useDeleteLaborCost as any).mockReturnValue(deleteMock);

        const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => false);

        render(<LaborSection orderId={orderId} />);

        const deleteButton = screen.getByLabelText('Usuń');
        fireEvent.click(deleteButton);

        expect(confirmSpy).toHaveBeenCalled();
        expect(deleteMock).not.toHaveBeenCalled();

        confirmSpy.mockRestore();
    });
});
