import { LaborForm, type LaborFormData } from './LaborForm';
import { useUpdateLaborCost } from '@/lib/hooks/useFinance';
import { useToast } from '@/lib/hooks/useToast';
import { LaborCost } from '@/types';

interface EditLaborDialogProps {
    labor: LaborCost;
    onClose: () => void;
}

export function EditLaborDialog({ labor, onClose }: EditLaborDialogProps) {
    const updateLabor = useUpdateLaborCost();
    const { toast } = useToast();

    const handleSubmit = async (data: LaborFormData & { total: number }) => {
        try {
            await updateLabor(labor.id, data);
            toast({
                title: 'Sukces',
                description: 'Koszt robocizny został zaktualizowany',
                variant: 'success',
            });
            onClose();
        } catch {
            toast({
                title: 'Błąd',
                description: 'Nie udało się zaktualizować kosztu robocizny',
                variant: 'destructive',
            });
        }
    };

    return (
        <LaborForm
            title="Edytuj robociznę"
            initialData={labor}
            onSubmit={handleSubmit}
            onClose={onClose}
        />
    );
}
