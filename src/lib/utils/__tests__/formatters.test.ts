import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    formatDate,
    formatDateTime,
    formatCurrency,
    formatNumber,
    generateOrderNumber,
    generateQuoteNumber,
    calculateVAT,
    calculateGross,
    calculateNet,
    addDays,
    isToday,
    isThisWeek,
    isThisMonth
} from '../formatters';

describe('formatters', () => {
    describe('date formatting', () => {
        it('should format date correctly', () => {
            const date = new Date('2023-12-25');
            expect(formatDate(date)).toBe('25 gru 2023');
            expect(formatDate('2023-12-25')).toBe('25 gru 2023');
        });

        it('should format date time correctly', () => {
            const date = new Date('2023-12-25T15:30:00');
            expect(formatDateTime(date)).toBe('25 gru 2023 15:30');
            expect(formatDateTime('2023-12-25T15:30:00')).toBe('25 gru 2023 15:30');
        });
    });

    describe('currency and numbers', () => {
        it('should format currency in PLN', () => {
            const result = formatCurrency(100.50).replace(/\u00a0/g, ' ');
            // Sprawdzamy czy zawiera kwotę i walutę, ignorując specyficzny format odstępów
            expect(result).toMatch(/100,50/);
            expect(result).toMatch(/zł/);
        });

        it('should format numbers with polish locale', () => {
            const result = formatNumber(1234.56).replace(/\u00a0/g, ' ');
            // Akceptujemy zarówno wersję z separatorem jak i bez (zależne od środowiska)
            expect(result).toMatch(/1\s?234,56/);
        });
    });

    describe('generators', () => {
        it('should generate order number in correct format', () => {
            const orderNum = generateOrderNumber();
            expect(orderNum).toMatch(/^ZL\/\d{4}\/\d{4}$/);
        });

        it('should generate quote number in correct format', () => {
            const quoteNum = generateQuoteNumber();
            expect(quoteNum).toMatch(/^KS\/\d{4}\/\d{4}$/);
        });
    });

    describe('tax calculations', () => {
        it('should calculate VAT correctly', () => {
            expect(calculateVAT(100, 23)).toBe(23);
            expect(calculateVAT(100, 8)).toBe(8);
        });

        it('should calculate gross amount correctly', () => {
            expect(calculateGross(100, 23)).toBe(123);
        });

        it('should calculate net amount correctly', () => {
            expect(calculateNet(123, 23)).toBe(100);
        });
    });

    describe('date logic', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2023-12-25T12:00:00'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should add days correctly', () => {
            const start = new Date('2023-12-25');
            const result = addDays(start, 5);
            expect(result.getDate()).toBe(30);
        });

        it('should identify today', () => {
            expect(isToday(new Date())).toBe(true);
            expect(isToday('2023-12-25')).toBe(true);
            expect(isToday('2023-12-24')).toBe(false);
        });

        it('should identify this week', () => {
            expect(isThisWeek(new Date())).toBe(true);
            expect(isThisWeek('2023-12-20')).toBe(true);
            expect(isThisWeek(new Date('2023-12-10'))).toBe(false);
        });

        it('should identify this month', () => {
            expect(isThisMonth(new Date())).toBe(true);
            expect(isThisMonth('2023-12-01')).toBe(true);
            expect(isThisMonth(new Date('2023-11-30'))).toBe(false);
        });
    });
});
