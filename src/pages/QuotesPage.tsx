import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuotes, useDeleteQuote } from '@/lib/hooks/useQuotes';
import { useClients } from '@/lib/hooks/useClients';
import { useOrders } from '@/lib/hooks/useOrders';
import { useSettings } from '@/lib/hooks/useApp';
import { useUIStore } from '@/lib/stores/uiStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, FileText, Download, Mail } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { useToast } from '@/lib/hooks/useToast';
import AddQuoteDialog from '@/components/quotes/AddQuoteDialog';
import EditQuoteDialog from '@/components/quotes/EditQuoteDialog';
import QuoteStatusBadge from '@/components/quotes/QuoteStatusBadge';
import { generateQuotePDF } from '@/lib/pdf/generateQuotePDF';
import { Quote } from '@/types';

export default function QuotesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { quotes, isLoading } = useQuotes();
  const deleteQuote = useDeleteQuote();
  const { clients } = useClients();
  const { orders } = useOrders();
  const { settings } = useSettings();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { setCurrentPage } = useUIStore();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentPage('quotes');
  }, [setCurrentPage]);

  const filteredQuotes = statusFilter === 'all'
    ? quotes
    : quotes.filter(quote => quote.status === statusFilter);

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Nieznany klient';
  };

  const getOrderTitle = (orderId?: string) => {
    if (!orderId) return null;
    const order = orders.find(o => o.id === orderId);
    return order?.title;
  };

  const handleDelete = async (quoteId: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten kosztorys?')) {
      await deleteQuote(quoteId);
      toast({
        title: 'Sukces',
        description: 'Kosztorys został usunięty',
        variant: 'success',
      });
    }
  };

  const handleSendEmail = (quote: Quote, clientName: string) => {
    const subject = `Kosztorys ${quote.quoteNumber}`;
    const body = `Szanowny/a ${clientName},\n\nW załączniku przesyłam kosztorys nr ${quote.quoteNumber}.\n\nWartość brutto: ${formatCurrency(quote.total)}\n\nKosztorys ważny do: ${quote.validUntil ? formatDate(quote.validUntil) : 'brak'}\n\nPozdrawiam,\n`;
    window.location.assign(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleGeneratePDF = async (quote: Quote) => {
    const client = clients.find(c => c.id === quote.clientId);
    if (!client) {
      toast({
        title: 'Błąd',
        description: 'Nie znaleziono klienta',
        variant: 'destructive',
      });
      return;
    }

    try {
      await generateQuotePDF(quote, client, settings);
      toast({
        title: 'Sukces',
        description: 'PDF został wygenerowany',
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Błąd',
        description: 'Wystąpił błąd podczas generowania PDF',
        variant: 'destructive',
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
          <h1 className="text-3xl font-bold">Kosztorysy</h1>
          <p className="text-muted-foreground">Zarządzaj kosztorysami</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nowy kosztorys
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <AddQuoteDialog
              orderId={searchParams.get('orderId') || undefined}
              onClose={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Wszystkie</TabsTrigger>
          <TabsTrigger value="projekt">Projekt</TabsTrigger>
          <TabsTrigger value="wyslane">Wysłane</TabsTrigger>
          <TabsTrigger value="zaakceptowane">Zaakceptowane</TabsTrigger>
          <TabsTrigger value="odrzucone">Odrzucone</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredQuotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              {statusFilter !== 'all' ? 'Brak kosztorysów w tej kategorii' : 'Brak kosztorysów. Stwórz pierwszy kosztorys!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{quote.quoteNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">{getClientName(quote.clientId)}</p>
                    {getOrderTitle(quote.orderId) && (
                      <p className="text-xs text-muted-foreground">Zlecenie: {getOrderTitle(quote.orderId)}</p>
                    )}
                  </div>
                  <QuoteStatusBadge status={quote.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pozycje:</span>
                  <span>{quote.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Netto:</span>
                  <span>{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT:</span>
                  <span>{formatCurrency(quote.vatTotal)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-primary">
                  <span>Brutto:</span>
                  <span>{formatCurrency(quote.total)}</span>
                </div>
                {quote.validUntil && (
                  <div className="text-xs text-muted-foreground text-right">
                    Ważny do: {formatDate(quote.validUntil)}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => navigate(`/quotes/${quote.id}`)}
                    title="Szczegóły"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => handleGeneratePDF(quote)}
                    title="PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => handleSendEmail(quote, getClientName(quote.clientId))}
                    title="Wyślij email"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => {
                      setSelectedQuote(quote);
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
                    onClick={() => handleDelete(quote.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedQuote && (
            <EditQuoteDialog
              quote={selectedQuote}
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedQuote(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
