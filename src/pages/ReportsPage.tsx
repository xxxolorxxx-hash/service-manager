import { useState, useEffect } from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { useQuotes } from '@/lib/hooks/useQuotes';
import { useClients } from '@/lib/hooks/useClients';
import { useUIStore } from '@/lib/stores/uiStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Download, Calendar } from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'year'>('all');
  const { orders } = useOrders();
  const { quotes } = useQuotes();
  const { clients } = useClients();
  const { toast } = useToast();
  const { setCurrentPage } = useUIStore();

  useEffect(() => {
    setCurrentPage('reports');
  }, [setCurrentPage]);

  const getFilteredOrders = () => {
    if (dateRange === 'all') return orders;

    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.startDate);
      if (dateRange === 'month') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'year') {
        return orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const getFilteredQuotes = () => {
    if (dateRange === 'all') return quotes;

    const now = new Date();
    return quotes.filter(quote => {
      const quoteDate = new Date(quote.createdAt);
      if (dateRange === 'month') {
        return quoteDate.getMonth() === now.getMonth() && quoteDate.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'year') {
        return quoteDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();
  const filteredQuotes = getFilteredQuotes();

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.value || 0), 0);
  const completedOrders = filteredOrders.filter(order => order.status === 'ukończone').length;
  const activeOrders = filteredOrders.filter(order => order.status === 'w trakcie').length;
  const acceptedQuotes = filteredQuotes.filter(quote => quote.status === 'zaakceptowane').length;

  const ordersByStatus = [
    { name: 'Nowe', value: filteredOrders.filter(o => o.status === 'nowe').length },
    { name: 'W trakcie', value: filteredOrders.filter(o => o.status === 'w trakcie').length },
    { name: 'Ukończone', value: filteredOrders.filter(o => o.status === 'ukończone').length },
    { name: 'Oczekujące', value: filteredOrders.filter(o => o.status === 'oczekujące').length },
    { name: 'Anulowane', value: filteredOrders.filter(o => o.status === 'anulowane').length },
  ];

  const revenueByMonth = (() => {
    const months = [
      'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
      'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'
    ];

    const currentYear = new Date().getFullYear();
    const data = months.map((month, index) => {
      const monthRevenue = filteredOrders.reduce((sum, order) => {
        const orderDate = new Date(order.startDate);
        if (orderDate.getMonth() === index && orderDate.getFullYear() === currentYear) {
          return sum + (order.value || 0);
        }
        return sum;
      }, 0);

      return { month, revenue: monthRevenue };
    });

    return data;
  })();

  const handleExportCSV = () => {
    const csvContent = [
      ['Typ', 'Numer', 'Tytuł/Klient', 'Status', 'Wartość', 'Data'].join(','),
      ...filteredOrders.map(order => [
        'Zlecenie',
        order.orderNumber,
        order.title,
        order.status,
        (order.value || 0).toFixed(2),
        formatDate(order.startDate)
      ].join(',')),
      ...filteredQuotes.map(quote => [
        'Kosztorys',
        quote.quoteNumber,
        quote.clientId,
        quote.status,
        quote.total.toFixed(2),
        formatDate(quote.createdAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raport-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'Sukces',
      description: 'Raport został wyeksportowany',
      variant: 'success',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Raporty</h1>
          <p className="text-muted-foreground">Przegląd przychodów i statystyk</p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Eksport CSV
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={dateRange === 'all' ? 'default' : 'outline'}
          onClick={() => setDateRange('all')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Wszystko
        </Button>
        <Button
          variant={dateRange === 'month' ? 'default' : 'outline'}
          onClick={() => setDateRange('month')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Ten miesiąc
        </Button>
        <Button
          variant={dateRange === 'year' ? 'default' : 'outline'}
          onClick={() => setDateRange('year')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Ten rok
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Przychód</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Zlecenia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
            <p className="text-xs text-muted-foreground">{completedOrders} ukończone</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktywne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Klienci</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Przychód w tym roku</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value || 0), 'Przychód']}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zlecenia wg statusu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Podsumowanie kosztorysów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Wszystkie</p>
              <p className="text-2xl font-bold">{filteredQuotes.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Zaakceptowane</p>
              <p className="text-2xl font-bold text-green-600">{acceptedQuotes}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Wartość zaakceptowanych</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(
                  filteredQuotes
                    .filter(q => q.status === 'zaakceptowane')
                    .reduce((sum, q) => sum + q.total, 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
