import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinancialSummary } from '../FinancialSummary';

describe('FinancialSummary', () => {
    const mockData = {
        revenue: 1000,
        materials: [
            { id: 'm1', name: 'M1', quantity: 1, unit: 'pc', unitPrice: 100, vatRate: 0, total: 100, orderId: 'ord-1' }
        ],
        labor: [
            { id: 'l1', description: 'L1', hours: 2, ratePerHour: 50, total: 100, orderId: 'ord-1' }
        ],
        otherCosts: [
            { id: 'o1', description: 'O1', cost: 100, orderId: 'ord-1' }
        ]
    };

    it('renders all financial metrics correctly', () => {
        render(<FinancialSummary {...mockData as any} />);

        // Check revenue
        expect(screen.getByText(/Przychód/i)).toBeInTheDocument();
        expect(screen.getByText(/1\s?000,00/)).toBeInTheDocument();

        // Total costs: 100 + 100 + 100 = 300
        expect(screen.getByText(/Koszty całkowite/i)).toBeInTheDocument();
        expect(screen.getByText(/300,00/)).toBeInTheDocument();

        // Profit: 1000 - 300 = 700
        expect(screen.getByText(/Zysk operacyjny/i)).toBeInTheDocument();
        expect(screen.getByText(/700,00/)).toBeInTheDocument();

        // Margin: (700/1000)*100 = 70.0%
        expect(screen.getByText(/Marża brutto/i)).toBeInTheDocument();
        expect(screen.getByText(/70.0%/)).toBeInTheDocument();
    });

    it('shows correct colors for margin', () => {
        // High margin (>30%)
        const { rerender } = render(<FinancialSummary {...mockData as any} />);
        expect(screen.getByText(/70.0%/)).toHaveClass('text-green-500');

        // Medium margin (15-30%)
        rerender(<FinancialSummary
            revenue={1000}
            materials={[{ total: 750, orderId: 'ord-1', id: '1', name: 'M', quantity: 1, unit: 'pc', unitPrice: 750, vatRate: 0 } as any]}
            labor={[]}
            otherCosts={[]}
        />);
        // Profit 250, Margin 25%
        expect(screen.getByText(/25.0%/)).toHaveClass('text-yellow-500');

        // Low margin (<15%)
        rerender(<FinancialSummary
            revenue={1000}
            materials={[{ total: 900, orderId: 'ord-1', id: '1', name: 'M', quantity: 1, unit: 'pc', unitPrice: 900, vatRate: 0 } as any]}
            labor={[]}
            otherCosts={[]}
        />);
        // Profit 100, Margin 10%
        expect(screen.getByText(/10.0%/)).toHaveClass('text-red-500');
    });

    it('displays negative profit correctly', () => {
        render(<FinancialSummary
            revenue={500}
            materials={[{ total: 600, orderId: 'ord-1', id: '1', name: 'M', quantity: 1, unit: 'pc', unitPrice: 600, vatRate: 0 } as any]}
            labor={[]}
            otherCosts={[]}
        />);

        expect(screen.getByText(/-100,00/)).toHaveClass('text-red-400');
    });

    it('handles zero revenue and costs without crashing', () => {
        render(<FinancialSummary revenue={0} materials={[]} labor={[]} otherCosts={[]} />);

        const zeroAmounts = screen.getAllByText(/0,00/);
        expect(zeroAmounts.length).toBeGreaterThan(0);
        expect(screen.getByText(/0.0%/)).toBeInTheDocument();
    });
});
