export type OrderStatus = 'nowe' | 'w trakcie' | 'ukończone' | 'anulowane' | 'oczekujące';

export type QuoteStatus = 'projekt' | 'wyslane' | 'zaakceptowane' | 'odrzucone';

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone: string;
  address?: string;
  nip?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  title: string;
  description: string;
  status: OrderStatus;
  value?: number;
  startDate: string;
  endDate?: string;
  address?: string;
  notes?: string;
  tasks?: ChecklistItem[];
  images?: {
    before: string[];
    after: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface MaterialCost {
  id: string;
  orderId: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
  total: number;
  createdAt: string;
}

export interface LaborCost {
  id: string;
  orderId: string;
  description: string;
  hours: number;
  ratePerHour: number;
  total: number;
  createdAt: string;
}

export interface OtherCost {
  id: string;
  orderId: string;
  description: string;
  cost: number;
  createdAt: string;
}


export interface QuoteItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  orderId?: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  vatTotal: number;
  total: number;
  validUntil?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyNip?: string;
  companyPhone?: string;
  companyEmail?: string;
  defaultVatRate: number;
  quoteValidDays: number;
  currency: string;
  dateFormat: string;
}

export interface Activity {
  id: string;
  type: 'order' | 'quote' | 'client';
  action: 'created' | 'updated' | 'deleted';
  itemId: string;
  itemName: string;
  timestamp: string;
}
