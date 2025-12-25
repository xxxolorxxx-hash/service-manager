import { OtherCost } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Edit, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface OtherCostListProps {
    entries: OtherCost[];
    onDelete: (id: string) => void;
    onEdit: (cost: OtherCost) => void;
}

export function OtherCostList({ entries, onDelete, onEdit }: OtherCostListProps) {
    return (
        <div className="space-y-3">
            <AnimatePresence initial={false}>
                {entries.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-muted-foreground text-sm italic border border-dashed border-white/10 rounded-xl"
                    >
                        Brak dodanych innych kosztów.
                    </motion.p>
                ) : (
                    entries.map((entry) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Coins className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm">{entry.description}</h4>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-sm">{formatCurrency(entry.cost)}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEdit(entry)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDelete(entry.id)}
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
