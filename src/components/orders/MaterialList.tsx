import { MaterialCost } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Edit, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface MaterialListProps {
  materials: MaterialCost[];
  onDelete: (id: string) => void;
  onEdit: (material: MaterialCost) => void;
}

export function MaterialList({ materials, onDelete, onEdit }: MaterialListProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {materials.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground text-sm italic border border-dashed border-white/10 rounded-xl"
          >
            Brak dodanych materiałów.
          </motion.p>
        ) : (
          materials.map((material) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{material.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {material.quantity} {material.unit} × {formatCurrency(material.unitPrice)}
                          {material.vatRate > 0 && ` (+${material.vatRate}% VAT)`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatCurrency(material.total)}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(material)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(material.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
