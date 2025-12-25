import { MaterialForm } from './MaterialForm';
import { useUpdateMaterialCost } from '@/lib/hooks/useFinance';
import { useToast } from '@/lib/hooks/useToast';
import { MaterialCost } from '@/types';

interface EditMaterialDialogProps {
  material: MaterialCost;
  onClose: () => void;
}

export function EditMaterialDialog({ material, onClose }: EditMaterialDialogProps) {
  const updateMaterial = useUpdateMaterialCost();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await updateMaterial(material.id, data);
      toast({
        title: 'Sukces',
        description: 'Materiał został zaktualizowany',
        variant: 'success',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować materiału',
        variant: 'destructive',
      });
    }
  };

  return (
    <MaterialForm
      title="Edytuj materiał"
      initialData={material}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
