import { useState, useEffect } from 'react';
import { useUpdateOrder } from '@/lib/hooks/useOrders';
import { useUpdateOrderStatus } from '@/lib/hooks/useOrders';
import { useClients } from '@/lib/hooks/useClients';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/lib/hooks/useToast';
import { Order, OrderStatus } from '@/types';

interface EditOrderDialogProps {
  order: Order;
  onClose: () => void;
}

export default function EditOrderDialog({ order, onClose }: EditOrderDialogProps) {
  const updateOrder = useUpdateOrder();
  const updateOrderStatus = useUpdateOrderStatus();
  const { clients } = useClients();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    status: 'nowe' as OrderStatus,
    value: '',
    startDate: '',
    endDate: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    setFormData({
      clientId: order.clientId,
      title: order.title,
      description: order.description || '',
      status: order.status,
      value: order.value ? order.value.toString() : '',
      startDate: order.startDate.split('T')[0],
      endDate: order.endDate ? order.endDate.split('T')[0] : '',
      address: order.address || '',
      notes: order.notes || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.clientId || !formData.startDate) {
      toast({
        title: 'Błąd',
        description: 'Tytuł, klient i data rozpoczęcia są wymagane',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateOrder(order.id, {
        ...formData,
        value: formData.value ? parseFloat(formData.value) : undefined,
      });
      toast({
        title: 'Sukces',
        description: 'Zlecenie zostało zaktualizowane',
        variant: 'success',
      });
      onClose();
    } catch {
      toast({
        title: 'Błąd',
        description: 'Wystąpił błąd podczas aktualizacji zlecenia',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      await updateOrderStatus(order.id, status);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Edytuj zlecenie</DialogTitle>
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

        <div>
          <label className="text-sm font-medium">Tytuł zlecenia *</label>
          <Input
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Opis</label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            value={formData.status}
            onChange={(e) => {
              const newStatus = e.target.value as OrderStatus;
              setFormData({ ...formData, status: newStatus });
              handleStatusChange(newStatus);
            }}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="nowe">Nowe</option>
            <option value="w trakcie">W trakcie</option>
            <option value="ukończone">Ukończone</option>
            <option value="oczekujące">Oczekujące</option>
            <option value="anulowane">Anulowane</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Wartość (PLN)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Data rozpoczęcia *</label>
          <Input
            required
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Data zakończenia</label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Adres realizacji</label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

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
