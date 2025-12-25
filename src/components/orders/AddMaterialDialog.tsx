import { MaterialForm } from './MaterialForm';
import { useAddMaterialCost } from '@/lib/hooks/useFinance';
import { useToast } from '@/lib/hooks/useToast';

interface AddMaterialDialogProps {
  orderId: string;
  onClose: () => void;
}

export function AddMaterialDialog({ orderId, onClose }: AddMaterialDialogProps) {
  const addMaterial = useAddMaterialCost();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await addMaterial({
        ...data,
        orderId,
      });
      toast({
        title: 'Sukces',
        description: 'Materiał został dodany',
        variant: 'success',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się dodać materiału',
        variant: 'destructive',
      });
    }
  };

  return (
    <MaterialForm
      title="Dodaj materiał"
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
