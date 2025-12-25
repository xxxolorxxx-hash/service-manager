import { useState, useEffect } from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { useUIStore } from '@/lib/stores/uiStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Tag,
    MapPin
} from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    isWithinInterval,
    parseISO
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import StatusBadge from '@/components/orders/StatusBadge';

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { orders } = useOrders();
    const { setCurrentPage } = useUIStore();
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage('calendar');
    }, [setCurrentPage]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight capitalize">
                            {format(currentMonth, 'LLLL yyyy', { locale: pl })}
                        </h1>
                        <p className="text-muted-foreground">Terminarz zleceń i projektów</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date())}
                        className="px-4 font-medium"
                    >
                        Dzisiaj
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");

                // Find orders occurring on this day
                const dayOrders = orders.filter(order => {
                    const start = parseISO(order.startDate);
                    const end = order.endDate ? parseISO(order.endDate) : start;
                    return isSameDay(day, start) || isSameDay(day, end) ||
                        isWithinInterval(day, { start, end });
                });

                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "relative min-h-[120px] border border-white/5 p-2 transition-colors",
                            !isSameMonth(day, monthStart) ? "bg-black/20 opacity-30" : "bg-white/[0.02]",
                            isSameDay(day, new Date()) && "bg-primary/5 ring-1 ring-inset ring-primary/20"
                        )}
                    >
                        <span className={cn(
                            "text-sm font-medium",
                            isSameDay(day, new Date()) && "text-primary font-bold"
                        )}>
                            {formattedDate}
                        </span>

                        <div className="mt-2 space-y-1">
                            {dayOrders.slice(0, 3).map((order) => (
                                <motion.div
                                    layoutId={order.id}
                                    key={order.id}
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                    className={cn(
                                        "text-[10px] p-1.5 rounded-lg border border-white/5 cursor-pointer truncate transition-transform hover:scale-[1.02] active:scale-[0.98]",
                                        order.status === 'ukończone' ? "bg-emerald-500/10 text-emerald-500" :
                                            order.status === 'w trakcie' ? "bg-blue-500/10 text-blue-500" :
                                                "bg-orange-500/10 text-orange-500"
                                    )}
                                >
                                    {order.title}
                                </motion.div>
                            ))}
                            {dayOrders.length > 3 && (
                                <div className="text-[10px] text-muted-foreground text-center pt-1 font-medium">
                                    + {dayOrders.length - 3} więcej
                                </div>
                            )}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">{rows}</div>;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto p-4 md:p-12"
        >
            {renderHeader()}

            <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    {renderDays()}
                    {renderCells()}
                </div>

                <div className="space-y-6">
                    <Card className="border-white/5 bg-white/5 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Nadchodzące zlecenia</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {orders
                                .filter(o => parseISO(o.startDate) >= new Date())
                                .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime())
                                .slice(0, 5)
                                .map(order => (
                                    <div
                                        key={order.id}
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                        className="group p-3 rounded-xl border border-white/5 hover:bg-white/5 cursor-pointer transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <StatusBadge status={order.status} />
                                            <span className="text-[10px] text-muted-foreground font-mono">{format(parseISO(order.startDate), 'dd.MM')}</span>
                                        </div>
                                        <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{order.title}</p>
                                        {order.address && (
                                            <p className="text-[11px] text-muted-foreground mt-1 flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" /> {order.address}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            {orders.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-8 italic">Brak nadchodzących zleceń.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-white/5 bg-white/5 overflow-hidden">
                        <div className="p-4 bg-primary/10">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Tag className="h-4 w-4 text-primary" />
                                Legenda
                            </h3>
                        </div>
                        <CardContent className="p-4 space-y-2">
                            {[
                                { label: 'Ukończone', color: 'bg-emerald-500' },
                                { label: 'W trakcie', color: 'bg-blue-500' },
                                { label: 'Oczekujące / Nowe', color: 'bg-orange-500' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={cn("h-2 w-2 rounded-full", item.color)} />
                                    <span className="text-xs text-muted-foreground">{item.label}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
