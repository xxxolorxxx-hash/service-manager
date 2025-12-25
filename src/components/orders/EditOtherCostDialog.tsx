import { OtherCostForm, type OtherCostFormData } from './OtherCostForm';
import { useUpdateOtherCost } from '@/lib/hooks/useFinance';
import { useToast } from '@/lib/hooks/useToast';
import { OtherCost } from '@/types';

interface EditOtherCostDialogProps {
    otherCost: OtherCost;
    onClose: () => void;
}

export function EditOtherCostDialog({ otherCost, onClose }: EditOtherCostDialogProps) {
    const updateOtherCost = useUpdateOtherCost();
    const { toast } = useToast();

    const handleSubmit = async (data: OtherCostFormData) => {
        try {
            await updateOtherCost(otherCost.id, data);
            toast({
                title: 'Sukces',
                description: 'Koszt został zaktualizowany',
                variant: 'success',
            });
            onClose();
        } catch {
            toast({
                title: 'Błąd',
                description: 'Nie udało się zaktualizować kosztu',
                variant: 'destructive',
            });
        }
    };

    return (
        <OtherCostForm
            title="Edytuj koszt"
            initialData={otherCost}
            onSubmit={handleSubmit}
            onClose={onClose}
        />
    );
}
