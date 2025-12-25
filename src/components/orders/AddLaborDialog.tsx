import { LaborForm, type LaborFormData } from './LaborForm';
import { useAddLaborCost } from '@/lib/hooks/useFinance';
import { useToast } from '@/lib/hooks/useToast';

interface AddLaborDialogProps {
    orderId: string;
    onClose: () => void;
}

export function AddLaborDialog({ orderId, onClose }: AddLaborDialogProps) {
    const addLabor = useAddLaborCost();
    const { toast } = useToast();

    const handleSubmit = async (data: LaborFormData & { total: number }) => {
        try {
            await addLabor({
                ...data,
                orderId,
            });
            toast({
                title: 'Sukces',
                description: 'Koszt robocizny został dodany',
                variant: 'success',
            });
            onClose();
        } catch {
            toast({
                title: 'Błąd',
                description: 'Nie udało się dodać kosztu robocizny',
                variant: 'destructive',
            });
        }
    };

    return (
        <LaborForm
            title="Dodaj robociznę"
            onSubmit={handleSubmit}
            onClose={onClose}
        />
    );
}
