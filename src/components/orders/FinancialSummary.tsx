import { MaterialCost, LaborCost, OtherCost } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Wallet, PieChart } from 'lucide-react';
import {
    calculateTotalMaterials,
    calculateTotalLabor,
    calculateTotalOther,
    calculateProfit,
    calculateMargin
} from '@/lib/utils/finance';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

interface FinancialSummaryProps {
    revenue: number;
    materials: MaterialCost[];
    labor: LaborCost[];
    otherCosts: OtherCost[];
}

export function FinancialSummary({ revenue, materials, labor, otherCosts }: FinancialSummaryProps) {
    const totalMaterials = calculateTotalMaterials(materials);
    const totalLabor = calculateTotalLabor(labor);
    const totalOther = calculateTotalOther(otherCosts);
    const totalCosts = totalMaterials + totalLabor + totalOther;

    const profit = calculateProfit(revenue, totalCosts);
    const margin = calculateMargin(revenue, profit);

    const isProfitable = profit > 0;
    const marginColor = margin > 30 ? 'text-green-500' : margin > 15 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-white/5 bg-white/5 overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Przychód</p>
                            <p className="text-xl font-bold">{formatCurrency(revenue)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-white/5 bg-white/5 overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Koszty całkowite</p>
                            <p className="text-xl font-bold">{formatCurrency(totalCosts)}</p>
                        </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                        <div className="h-1 flex-1 bg-primary/20 rounded-full overflow-hidden" title="Materiały">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${totalCosts > 0 ? (totalMaterials / totalCosts) * 100 : 0}%` }}
                            />
                        </div>
                        <div className="h-1 flex-1 bg-yellow-500/20 rounded-full overflow-hidden" title="Robocizna">
                            <div
                                className="h-full bg-yellow-500"
                                style={{ width: `${totalCosts > 0 ? (totalLabor / totalCosts) * 100 : 0}%` }}
                            />
                        </div>
                        <div className="h-1 flex-1 bg-blue-500/20 rounded-full overflow-hidden" title="Inne">
                            <div
                                className="h-full bg-blue-500"
                                style={{ width: `${totalCosts > 0 ? (totalOther / totalCosts) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-white/5 bg-white/5 overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-lg",
                            isProfitable ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                            {isProfitable ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Zysk operacyjny</p>
                            <p className={cn("text-xl font-bold", isProfitable ? "text-green-500" : "text-red-400")}>
                                {formatCurrency(profit)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-white/5 bg-white/5 overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <PieChart className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Marża brutto</p>
                            <p className={cn("text-xl font-bold", marginColor)}>
                                {margin.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
