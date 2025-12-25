import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders, useDeleteOrder } from '@/lib/hooks/useOrders';
import { useUIStore } from '@/lib/stores/uiStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { useToast } from '@/lib/hooks/useToast';
import AddOrderDialog from '@/components/orders/AddOrderDialog';
import EditOrderDialog from '@/components/orders/EditOrderDialog';
import StatusBadge from '@/components/orders/StatusBadge';
import { Order } from '@/types';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, isLoading } = useOrders();
  const deleteOrder = useDeleteOrder();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { setCurrentPage } = useUIStore();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentPage('orders');
  }, [setCurrentPage]);

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  const handleDelete = async (orderId: string) => {
    if (confirm('Czy na pewno chcesz usunąć to zlecenie?')) {
      await deleteOrder(orderId);
      toast({
        title: 'Sukces',
        description: 'Zlecenie zostało usunięte',
        variant: 'success',
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Ładowanie...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zlecenia</h1>
          <p className="text-muted-foreground">Zarządzaj zleceniami</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj zlecenie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <AddOrderDialog onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Wszystkie</TabsTrigger>
          <TabsTrigger value="nowe">Nowe</TabsTrigger>
          <TabsTrigger value="w trakcie">W trakcie</TabsTrigger>
          <TabsTrigger value="ukończone">Zakończone</TabsTrigger>
          <TabsTrigger value="oczekujące">Oczekujące</TabsTrigger>
          <TabsTrigger value="anulowane">Anulowane</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              {statusFilter !== 'all' ? 'Brak zleceń w tej kategorii' : 'Brak zleceń. Dodaj pierwsze zlecenie!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{order.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 line-clamp-2">{order.description}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Data: {formatDate(order.startDate)}</span>
                  {order.endDate && <span className="ml-2">- {formatDate(order.endDate)}</span>}
                </div>
                {order.value && (
                  <div className="text-lg font-semibold text-primary">
                    {formatCurrency(order.value)}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => navigate(`/orders/${order.id}`)}
                    title="Szczegóły"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => navigate(`/quotes/new?orderId=${order.id}`)}
                    title="Utwórz kosztorys"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsEditDialogOpen(true);
                    }}
                    title="Edytuj"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(order.id)}
                    title="Usuń"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedOrder && (
            <EditOrderDialog
              order={selectedOrder}
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedOrder(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
