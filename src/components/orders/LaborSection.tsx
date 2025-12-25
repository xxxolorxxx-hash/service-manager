import { useState } from 'react';
import { LaborList } from './LaborList';
import { AddLaborDialog } from './AddLaborDialog';
import { EditLaborDialog } from './EditLaborDialog';
import { useLaborByOrder, useDeleteLaborCost } from '@/lib/hooks/useFinance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LaborCost } from '@/types';
import { useToast } from '@/lib/hooks/useToast';
import { calculateTotalLabor } from '@/lib/utils/finance';
import { formatCurrency } from '@/lib/utils/formatters';

interface LaborSectionProps {
    orderId: string;
}

export function LaborSection({ orderId }: LaborSectionProps) {
    const { labor, isLoading } = useLaborByOrder(orderId);
    const deleteLabor = useDeleteLaborCost();
    const { toast } = useToast();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingLabor, setEditingLabor] = useState<LaborCost | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm('Czy na pewno chcesz usunąć ten koszt robocizny?')) {
            await deleteLabor(id);
            toast({
                title: 'Sukces',
                description: 'Koszt robocizny został usunięty',
                variant: 'success',
            });
        }
    };

    const total = calculateTotalLabor(labor);

    return (
        <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Robocizna
                    </CardTitle>
                    <div className="text-right">
                        <span className="text-xs text-muted-foreground block uppercase tracking-wider">Suma robocizny</span>
                        <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={() => setIsAddOpen(true)} className="w-full h-11 rounded-xl" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Dodaj robociznę
                </Button>

                {isLoading ? (
                    <p className="text-center py-8 text-sm text-muted-foreground">Ładowanie...</p>
                ) : (
                    <LaborList
                        laborEntries={labor}
                        onDelete={handleDelete}
                        onEdit={setEditingLabor}
                    />
                )}
            </CardContent>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-md">
                    <AddLaborDialog
                        orderId={orderId}
                        onClose={() => setIsAddOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingLabor} onOpenChange={(open) => !open && setEditingLabor(null)}>
                <DialogContent className="max-w-md">
                    {editingLabor && (
                        <EditLaborDialog
                            labor={editingLabor}
                            onClose={() => setEditingLabor(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
