import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LaborCost } from '@/types';

const laborSchema = z.object({
    description: z.string().min(1, 'Opis jest wymagany'),
    hours: z.number().min(0.01, 'Ilość godzin musi być większa od 0'),
    ratePerHour: z.number().min(0, 'Stawka nie może być ujemna'),
});

export type LaborFormData = z.infer<typeof laborSchema>;

interface LaborFormProps {
    initialData?: LaborCost;
    onSubmit: (data: LaborFormData & { total: number }) => void;
    onClose: () => void;
    title: string;
}

export function LaborForm({ initialData, onSubmit, onClose, title }: LaborFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LaborFormData>({
        resolver: zodResolver(laborSchema),
        defaultValues: initialData || {
            description: '',
            hours: 1,
            ratePerHour: 0,
        },
    });

    const hours = watch('hours');
    const ratePerHour = watch('ratePerHour');

    const total = Number(((hours || 0) * (ratePerHour || 0)).toFixed(2));

    const handleFormSubmit = (data: LaborFormData) => {
        onSubmit({ ...data, total });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
                <div className="space-y-1">
                    <label htmlFor="description" className="text-sm font-medium">Opis prac *</label>
                    <Input
                        id="description"
                        {...register('description')}
                        placeholder="np. Przygotowanie podłoża i gruntowanie"
                        className={errors.description ? 'border-destructive' : ''}
                    />
                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="hours" className="text-sm font-medium">Liczba godzin *</label>
                        <Input
                            id="hours"
                            type="number"
                            step="any"
                            {...register('hours', { valueAsNumber: true })}
                            className={errors.hours ? 'border-destructive' : ''}
                        />
                        {errors.hours && <p className="text-xs text-destructive">{errors.hours.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="ratePerHour" className="text-sm font-medium">Stawka za h (netto) *</label>
                        <Input
                            id="ratePerHour"
                            type="number"
                            step="0.01"
                            {...register('ratePerHour', { valueAsNumber: true })}
                            className={errors.ratePerHour ? 'border-destructive' : ''}
                        />
                        {errors.ratePerHour && <p className="text-xs text-destructive">{errors.ratePerHour.message}</p>}
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex justify-between items-center">
                    <span className="text-sm font-medium">Suma netto:</span>
                    <span className="text-lg font-bold text-primary">{total.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
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
