import { useState, useEffect } from 'react';
import { useUpdateQuote } from '@/lib/hooks/useQuotes';
import { useUpdateQuoteStatus } from '@/lib/hooks/useQuotes';
import { useClients } from '@/lib/hooks/useClients';
import { useOrders } from '@/lib/hooks/useOrders';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/lib/hooks/useToast';
import { Quote, QuoteItem, QuoteStatus } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface EditQuoteDialogProps {
  quote: Quote;
  onClose: () => void;
}

export default function EditQuoteDialog({ quote, onClose }: EditQuoteDialogProps) {
  const updateQuote = useUpdateQuote();
  const updateQuoteStatus = useUpdateQuoteStatus();
  const { clients } = useClients();
  const { orders } = useOrders();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientId: '',
    orderId: '',
    status: 'projekt' as QuoteStatus,
    validUntil: '',
    notes: '',
  });
  const [items, setItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    setFormData({
      clientId: quote.clientId,
      orderId: quote.orderId || '',
      status: quote.status,
      validUntil: quote.validUntil ? quote.validUntil.split('T')[0] : '',
      notes: quote.notes || '',
    });
    setItems(quote.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote]);

  const addItem = () => {
    const newItem: QuoteItem = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      quantity: 1,
      unit: 'szt',
      unitPrice: 0,
      vatRate: 23,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<QuoteItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.total = updated.quantity * updated.unitPrice * (1 + updated.vatRate / 100);
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId || items.length === 0 || items.some(item => !item.name)) {
      toast({
        title: 'Błąd',
        description: 'Klient i co najmniej jedna pozycja są wymagane',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateQuote(quote.id, {
        ...formData,
        items,
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined,
      });
      toast({
        title: 'Sukces',
        description: 'Kosztorys został zaktualizowany',
        variant: 'success',
      });
      onClose();
    } catch {
      toast({
        title: 'Błąd',
        description: 'Wystąpił błąd podczas aktualizacji kosztorysu',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (status: QuoteStatus) => {
    try {
      await updateQuoteStatus(quote.id, status);
      toast({
        title: 'Sukces',
        description: 'Status został zaktualizowany',
        variant: 'success',
      });
      onClose();
    } catch {
      toast({
        title: 'Błąd',
        description: 'Wystąpił błąd podczas aktualizacji statusu',
        variant: 'destructive',
      });
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const vatTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.vatRate / 100), 0);
  const total = subtotal + vatTotal;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Edytuj kosztorys</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Klient *</label>
          <select
            required
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Wybierz klienta</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.company && `(${client.company})`}
              </option>
            ))}
          </select>
        </div>

        {formData.clientId && (
          <div>
            <label className="text-sm font-medium">Zlecenie (opcjonalne)</label>
            <select
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Brak zlecenia</option>
              {orders.filter(o => o.clientId === formData.clientId).map((order) => (
                <option key={order.id} value={order.id}>
                  {order.orderNumber} - {order.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => {
                const newStatus = e.target.value as QuoteStatus;
                setFormData({ ...formData, status: newStatus });
                handleStatusChange(newStatus);
              }}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="projekt">Projekt</option>
              <option value="wyslane">Wysłane</option>
              <option value="zaakceptowane">Zaakceptowane</option>
              <option value="odrzucone">Odrzucone</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Waźny do</label>
            <Input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Pozycje</label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" />
              Dodaj pozycję
            </Button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Brak pozycji. Dodaj co najmniej jedną.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    value={item.description || ''}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  />

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Ilość</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Jednostka</label>
                      <select
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="szt">szt</option>
                        <option value="m">m</option>
                        <option value="m²">m²</option>
                        <option value="m³">m³</option>
                        <option value="kg">kg</option>
                        <option value="godz">godz</option>
                        <option value="kpl">kpl</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Cena jedn.</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">VAT %</label>
                      <select
                        value={item.vatRate}
                        onChange={(e) => updateItem(item.id, { vatRate: parseFloat(e.target.value) })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="0">0%</option>
                        <option value="8">8%</option>
                        <option value="23">23%</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-right text-sm font-medium">
                    Suma: {(item.quantity * item.unitPrice * (1 + item.vatRate / 100)).toFixed(2)} PLN
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
            <div className="flex justify-between text-sm">
              <span>Netto:</span>
              <span>{subtotal.toFixed(2)} PLN</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT:</span>
              <span>{vatTotal.toFixed(2)} PLN</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Brutto:</span>
              <span className="text-primary">{total.toFixed(2)} PLN</span>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Notatki</label>
          <Input
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Anuluj
        </Button>
        <Button type="submit">Zapisz zmiany</Button>
      </div>
    </form>
  );
}
