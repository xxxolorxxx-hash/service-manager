import { useClients } from '@/lib/hooks/useClients';
import { useOrders } from '@/lib/hooks/useOrders';
import { useQuotes } from '@/lib/hooks/useQuotes';
import { useActiveOrders } from '@/lib/hooks/useOrders';
import { useRecentActivities } from '@/lib/hooks/useApp';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ClipboardList, FileText, TrendingUp, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUIStore } from '@/lib/stores/uiStore';

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
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pulpit</h1>
          <p className="text-muted-foreground">Witaj! Oto podsumowanie Twojej działalności</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Przychód</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Wszystkie zlecenia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktywne zlecenia</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">W trakcie realizacji</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klienci</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Zarejestrowanych</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kosztorysy</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotes.length}</div>
            <p className="text-xs text-muted-foreground">Wszystkie</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Aktywne zlecenia</CardTitle>
            </CardHeader>
            <CardContent>
              {activeOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Brak aktywnych zleceń</p>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div>
                        <p className="font-medium">{order.title}</p>
                        <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.value || 0)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.startDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Szybkie akcje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/orders/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Dodaj zlecenie
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/clients/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Dodaj klienta
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/quotes/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Stwórz kosztorys
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Ostatnia aktywność</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Brak aktywności</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.itemName}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.action === 'created' && 'Utworzono'}
                          {activity.action === 'updated' && 'Zaktualizowano'}
                          {activity.action === 'deleted' && 'Usunięto'} • {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
