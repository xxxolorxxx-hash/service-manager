import { useState } from 'react';
import { OtherCostList } from './OtherCostList';
import { AddOtherCostDialog } from './AddOtherCostDialog';
import { EditOtherCostDialog } from './EditOtherCostDialog';
import { useOtherCostsByOrder, useDeleteOtherCost } from '@/lib/hooks/useFinance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Coins } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { OtherCost } from '@/types';
import { useToast } from '@/lib/hooks/useToast';
import { calculateTotalOther } from '@/lib/utils/finance';
import { formatCurrency } from '@/lib/utils/formatters';

interface OtherCostsSectionProps {
    orderId: string;
}

export function OtherCostsSection({ orderId }: OtherCostsSectionProps) {
    const { otherCosts, isLoading } = useOtherCostsByOrder(orderId);
    const deleteOtherCost = useDeleteOtherCost();
    const { toast } = useToast();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCost, setEditingCost] = useState<OtherCost | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm('Czy na pewno chcesz usunąć ten koszt?')) {
            await deleteOtherCost(id);
            toast({
                title: 'Sukces',
                description: 'Koszt został usunięty',
                variant: 'success',
            });
        }
    };

    const total = calculateTotalOther(otherCosts);

    return (
        <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Coins className="h-5 w-5 text-primary" />
                        Inne koszty
                    </CardTitle>
                    <div className="text-right">
                        <span className="text-xs text-muted-foreground block uppercase tracking-wider">Suma innych</span>
                        <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={() => setIsAddOpen(true)} className="w-full h-11 rounded-xl" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Dodaj koszt
                </Button>

                {isLoading ? (
                    <p className="text-center py-8 text-sm text-muted-foreground">Ładowanie...</p>
                ) : (
                    <OtherCostList
                        entries={otherCosts}
                        onDelete={handleDelete}
                        onEdit={setEditingCost}
                    />
                )}
            </CardContent>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-md">
                    <AddOtherCostDialog
                        orderId={orderId}
                        onClose={() => setIsAddOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingCost} onOpenChange={(open) => !open && setEditingCost(null)}>
                <DialogContent className="max-w-md">
                    {editingCost && (
                        <EditOtherCostDialog
                            otherCost={editingCost}
                            onClose={() => setEditingCost(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
