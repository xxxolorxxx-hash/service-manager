import { useState } from 'react';
import { useCreateClient } from '@/lib/hooks/useClients';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/lib/hooks/useToast';

interface AddClientDialogProps {
  onClose: () => void;
}

export default function AddClientDialog({ onClose }: AddClientDialogProps) {
  const createClient = useCreateClient();
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
      await createClient(formData);
      toast({
        title: 'Sukces',
        description: 'Klient został dodany',
        variant: 'success',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Wystąpił błąd podczas dodawania klienta',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Nowy klient</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Imię i nazwisko *</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jan Kowalski"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Firma</label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Nazwa firmy"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Telefon *</label>
          <Input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+48 123 456 789"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jan@example.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Adres</label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Warszawa, ul. Długa 1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">NIP</label>
          <Input
            value={formData.nip}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
            placeholder="1234567890"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Notatki</label>
          <Input
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Dodatkowe informacje..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Anuluj
        </Button>
        <Button type="submit">Dodaj klienta</Button>
      </div>
    </form>
  );
}
