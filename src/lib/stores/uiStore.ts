import { create } from 'zustand';

interface UIState {
  currentPage: 'dashboard' | 'clients' | 'orders' | 'quotes' | 'reports' | 'settings';
  setCurrentPage: (page: 'dashboard' | 'clients' | 'orders' | 'quotes' | 'reports' | 'settings') => void;

  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  selectedQuoteId: string | null;
  setSelectedQuoteId: (id: string | null) => void;

  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  orderFilter: string;
  setOrderFilter: (filter: string) => void;

  quoteFilter: string;
  setQuoteFilter: (filter: string) => void;

  clientSearchQuery: string;
  setClientSearchQuery: (query: string) => void;

  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  toastQueue: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),

  selectedOrderId: null,
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),

  selectedQuoteId: null,
  setSelectedQuoteId: (id) => set({ selectedQuoteId: id }),

  selectedClientId: null,
  setSelectedClientId: (id) => set({ selectedClientId: id }),

  orderFilter: '',
  setOrderFilter: (filter) => set({ orderFilter: filter }),

  quoteFilter: '',
  setQuoteFilter: (filter) => set({ quoteFilter: filter }),

  clientSearchQuery: '',
  setClientSearchQuery: (query) => set({ clientSearchQuery: query }),

  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  toastQueue: [],
  showToast: (message, type = 'info') =>
    set((state) => ({
      toastQueue: [...state.toastQueue, { id: crypto.randomUUID(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toastQueue: state.toastQueue.filter((toast) => toast.id !== id),
    })),
}));
