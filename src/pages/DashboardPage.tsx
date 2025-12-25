import { useClients } from '@/lib/hooks/useClients';
import { useOrders } from '@/lib/hooks/useOrders';
import { useQuotes } from '@/lib/hooks/useQuotes';
import { useActiveOrders } from '@/lib/hooks/useOrders';
import { useRecentActivities } from '@/lib/hooks/useApp';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ClipboardList, FileText, TrendingUp, Plus, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUIStore } from '@/lib/stores/uiStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { setCurrentPage } = useUIStore();
  const { clients } = useClients();
  const { orders } = useOrders();
  const { quotes } = useQuotes();
  const { orders: activeOrders } = useActiveOrders();
  const { activities } = useRecentActivities(5);

  useEffect(() => {
    setCurrentPage('dashboard');
  }, [setCurrentPage]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.value || 0), 0);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container mx-auto p-4 md:p-12 space-y-6 md:space-y-10"
    >
      <motion.div variants={item} className="flex flex-col space-y-1 md:space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
          Witaj ponownie
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg">Oto co dzieje się dzisiaj.</p>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Przychód', value: formatCurrency(totalRevenue), icon: TrendingUp, desc: 'Łączna wartość zleceń', trend: '+12.5%' },
          { title: 'Zlecenia', value: activeOrders.length, icon: ClipboardList, desc: 'W trakcie realizacji', trend: 'Aktywne' },
          { title: 'Klienci', value: clients.length, icon: Users, desc: 'Zarejestrowane firmy', trend: '+3' },
          { title: 'Kosztorysy', value: quotes.length, icon: FileText, desc: 'Oczekujące i zaakceptowane', trend: 'Wszystkie' }
        ].map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter">{stat.value}</div>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {stat.trend}
                </span>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-8 md:grid-cols-7">
        <motion.div variants={item} className="md:col-span-4 space-y-6">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Aktywne zlecenia</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Podgląd bieżących prac serwisowych</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
                Zobacz wszystkie <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <ClipboardList className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">Brak aktywnych zleceń</p>
                  <Button variant="link" onClick={() => navigate('/orders/new')}>Dodaj swoje pierwsze zlecenie</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="group flex items-center justify-between p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{order.title}</p>
                          <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(order.value || 0)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.startDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="md:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Szybkie akcje</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Najczęściej używane funkcje</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              {[
                { label: 'Nowe zlecenie', icon: Plus, path: '/orders/new', variant: 'default' as const },
                { label: 'Nowy klient', icon: Users, path: '/clients/new', variant: 'outline' as const },
                { label: 'Utwórz kosztorys', icon: FileText, path: '/quotes/new', variant: 'outline' as const }
              ].map((action, i) => (
                <Button
                  key={i}
                  variant={action.variant}
                  className={cn(
                    "w-full justify-start h-12 rounded-xl text-md font-medium px-4",
                    action.variant === 'default' && "shadow-lg shadow-primary/20"
                  )}
                  onClick={() => navigate(action.path)}
                >
                  <action.icon className="mr-3 h-5 w-5" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ostatnia aktywność</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Brak aktywności</p>
              ) : (
                <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                  {activities.map((activity) => (
                    <div key={activity.id} className="relative pl-8 flex flex-col space-y-1">
                      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                      <p className="text-sm font-semibold truncate">{activity.itemName}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.action === 'created' && 'Utworzono'}
                        {activity.action === 'updated' && 'Zaktualizowano'}
                        {activity.action === 'deleted' && 'Usunięto'} • {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
