import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MaterialCost } from '@/types';
import { useEffect } from 'react';

const materialSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
  quantity: z.number().min(0.01, 'Ilość musi być większa od 0'),
  unit: z.string().min(1, 'Jednostka jest wymagana'),
  unitPrice: z.number().min(0, 'Cena nie może być ujemna'),
  vatRate: z.number().min(0, 'VAT nie może być ujemny'),
});

type MaterialFormData = z.infer<typeof materialSchema>;

interface MaterialFormProps {
  initialData?: MaterialCost;
  onSubmit: (data: MaterialFormData & { total: number }) => void;
  onClose: () => void;
  title: string;
}

export function MaterialForm({ initialData, onSubmit, onClose, title }: MaterialFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: initialData || {
      name: '',
      quantity: 1,
      unit: 'szt.',
      unitPrice: 0,
      vatRate: 23,
    },
  });

  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');
  const vatRate = watch('vatRate');

  const calculateTotal = () => {
    const net = (quantity || 0) * (unitPrice || 0);
    const vat = net * ((vatRate || 0) / 100);
    return Number((net + vat).toFixed(2));
  };

  const total = calculateTotal();

  const handleFormSubmit = (data: MaterialFormData) => {
    onSubmit({ ...data, total });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">Nazwa materiału *</label>
          <Input
            id="name"
            {...register('name')}
            placeholder="np. Farba biała 5L"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="quantity" className="text-sm font-medium">Ilość *</label>
            <Input
              id="quantity"
              type="number"
              step="any"
              {...register('quantity', { valueAsNumber: true })}
              className={errors.quantity ? 'border-destructive' : ''}
            />
            {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="unit" className="text-sm font-medium">Jednostka *</label>
            <Input
              id="unit"
              {...register('unit')}
              placeholder="szt., mb, m2, kg"
              className={errors.unit ? 'border-destructive' : ''}
            />
            {errors.unit && <p className="text-xs text-destructive">{errors.unit.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="unitPrice" className="text-sm font-medium">Cena jedn. netto *</label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              {...register('unitPrice', { valueAsNumber: true })}
              className={errors.unitPrice ? 'border-destructive' : ''}
            />
            {errors.unitPrice && <p className="text-xs text-destructive">{errors.unitPrice.message}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="vatRate" className="text-sm font-medium">Stawka VAT (%)</label>
            <Input
              id="vatRate"
              type="number"
              {...register('vatRate', { valueAsNumber: true })}
              className={errors.vatRate ? 'border-destructive' : ''}
            />
            {errors.vatRate && <p className="text-xs text-destructive">{errors.vatRate.message}</p>}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex justify-between items-center">
          <span className="text-sm font-medium">Suma brutto:</span>
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
