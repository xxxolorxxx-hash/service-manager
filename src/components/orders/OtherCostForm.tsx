import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OtherCost } from '@/types';

const otherCostSchema = z.object({
    description: z.string().min(1, 'Opis jest wymagany'),
    cost: z.number().min(0.01, 'Kwota musi być większa od 0'),
});

export type OtherCostFormData = z.infer<typeof otherCostSchema>;

interface OtherCostFormProps {
    initialData?: OtherCost;
    onSubmit: (data: OtherCostFormData) => void;
    onClose: () => void;
    title: string;
}

export function OtherCostForm({ initialData, onSubmit, onClose, title }: OtherCostFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OtherCostFormData>({
        resolver: zodResolver(otherCostSchema),
        defaultValues: initialData || {
            description: '',
            cost: 0,
        },
    });

    const handleFormSubmit = (data: OtherCostFormData) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
                <div className="space-y-1">
                    <label htmlFor="description" className="text-sm font-medium">Opis kosztu *</label>
                    <Input
                        id="description"
                        {...register('description')}
                        placeholder="np. Transport, dojazd, wynajem sprzętu"
                        className={errors.description ? 'border-destructive' : ''}
                    />
                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="cost" className="text-sm font-medium">Kwota (netto) *</label>
                    <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        {...register('cost', { valueAsNumber: true })}
                        className={errors.cost ? 'border-destructive' : ''}
                    />
                    {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Anuluj
                </Button>
                <Button type="submit">Zapisz</Button>
            </div>
        </form>
    );
}
