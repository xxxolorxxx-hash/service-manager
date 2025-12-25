import { OtherCostForm, type OtherCostFormData } from './OtherCostForm';
import { useAddOtherCost } from '@/lib/hooks/useFinance';
import { useToast } from '@/lib/hooks/useToast';

interface AddOtherCostDialogProps {
    orderId: string;
    onClose: () => void;
}

export function AddOtherCostDialog({ orderId, onClose }: AddOtherCostDialogProps) {
    const addOtherCost = useAddOtherCost();
    const { toast } = useToast();

    const handleSubmit = async (data: OtherCostFormData) => {
        try {
            await addOtherCost({
                ...data,
                orderId,
            });
            toast({
                title: 'Sukces',
                description: 'Koszt został dodany',
                variant: 'success',
            });
            onClose();
        } catch {
            toast({
                title: 'Błąd',
                description: 'Nie udało się dodać kosztu',
                variant: 'destructive',
            });
        }
    };

    return (
        <OtherCostForm
            title="Dodaj inny koszt"
            onSubmit={handleSubmit}
            onClose={onClose}
        />
    );
}
