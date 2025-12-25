import { useState, useEffect } from 'react';
import { useUpdateClient } from '@/lib/hooks/useClients';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/lib/hooks/useToast';
import { Client } from '@/types';

interface EditClientDialogProps {
  client: Client;
  onClose: () => void;
}

export default function EditClientDialog({ client, onClose }: EditClientDialogProps) {
  const updateClient = useUpdateClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    nip: '',
    notes: '',
  });

  useEffect(() => {
    setFormData({
      name: client.name,
      company: client.company || '',
      email: client.email || '',
      phone: client.phone,
      address: client.address || '',
      nip: client.nip || '',
      notes: client.notes || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast({
        title: 'Błąd',
        description: 'Imię i telefon są wymagane',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateClient(client.id, formData);
      toast({
        title: 'Sukces',
        description: 'Klient został zaktualizowany',
        variant: 'success',
      });
      onClose();
    } catch {
      toast({
        title: 'Błąd',
        description: 'Wystąpił błąd podczas aktualizacji klienta',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Edytuj klienta</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Imię i nazwisko *</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Firma</label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Telefon *</label>
          <Input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Adres</label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">NIP</label>
          <Input
            value={formData.nip}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
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
