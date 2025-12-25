import { useState } from 'react';
import { MaterialList } from './MaterialList';
import { AddMaterialDialog } from './AddMaterialDialog';
import { EditMaterialDialog } from './EditMaterialDialog';
import { useMaterialsByOrder, useDeleteMaterialCost } from '@/lib/hooks/useFinance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MaterialCost } from '@/types';
import { useToast } from '@/lib/hooks/useToast';
import { calculateTotalMaterials } from '@/lib/utils/finance';
import { formatCurrency } from '@/lib/utils/formatters';

interface MaterialsSectionProps {
  orderId: string;
}

export function MaterialsSection({ orderId }: MaterialsSectionProps) {
  const { materials, isLoading } = useMaterialsByOrder(orderId);
  const deleteMaterial = useDeleteMaterialCost();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialCost | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten koszt materiałowy?')) {
      await deleteMaterial(id);
      toast({
        title: 'Sukces',
        description: 'Materiał został usunięty',
        variant: 'success',
      });
    }
  };

  const total = calculateTotalMaterials(materials);

  return (
    <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Materiały
          </CardTitle>
          <div className="text-right">
             <span className="text-xs text-muted-foreground block uppercase tracking-wider">Suma materiałów</span>
             <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => setIsAddOpen(true)} className="w-full h-11 rounded-xl" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Dodaj materiał
        </Button>

        {isLoading ? (
          <p className="text-center py-8 text-sm text-muted-foreground">Ładowanie...</p>
        ) : (
          <MaterialList
            materials={materials}
            onDelete={handleDelete}
            onEdit={setEditingMaterial}
          />
        )}
      </CardContent>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <AddMaterialDialog
            orderId={orderId}
            onClose={() => setIsAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingMaterial} onOpenChange={(open) => !open && setEditingMaterial(null)}>
        <DialogContent className="max-w-md">
          {editingMaterial && (
            <EditMaterialDialog
              material={editingMaterial}
              onClose={() => setEditingMaterial(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
