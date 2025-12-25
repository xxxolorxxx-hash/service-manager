import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients, useDeleteClient, searchClients } from '@/lib/hooks/useClients';
import { useUIStore } from '@/lib/stores/uiStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Phone, Mail, MapPin, Trash2, Edit, History } from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';
import AddClientDialog from '@/components/clients/AddClientDialog';
import EditClientDialog from '@/components/clients/EditClientDialog';
import { Client } from '@/types';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { clients, isLoading } = useClients();
  const deleteClient = useDeleteClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { setCurrentPage, setClientSearchQuery } = useUIStore();
  const { toast } = useToast();

  const filteredClients = searchQuery.trim() === ''
    ? clients
    : clients.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setClientSearchQuery(query);
  };

  const handleDelete = async (clientId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      await deleteClient(clientId);
      toast({
        title: 'Sukces',
        description: 'Klient został usunięty',
        variant: 'success',
      });
      handleSearch(searchQuery);
    }
  };

  useEffect(() => {
    setCurrentPage('clients');
  }, [setCurrentPage]);

  const handleCall = (phone: string) => {
    window.location.assign(`tel:${phone}`);
  };

  const handleSMS = (phone: string) => {
    window.location.assign(`sms:${phone}`);
  };

  const handleEmail = (email: string) => {
    window.location.assign(`mailto:${email}`);
  };

  if (isLoading) {
    return <div className="p-4">Ładowanie...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Klienci</h1>
          <p className="text-muted-foreground">Zarządzaj bazą klientów</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj klienta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <AddClientDialog onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj po nazwie, telefonie lub email..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              {searchQuery ? 'Nie znaleziono klientów' : 'Brak klientów. Dodaj pierwszego klienta!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{client.name}</CardTitle>
                {client.company && <p className="text-sm text-muted-foreground">{client.company}</p>}
              </CardHeader>
              <CardContent className="space-y-3">
                {client.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="truncate flex-1">{client.email}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                {client.address && (
                  <div className="flex items-start text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="flex-1">{client.address}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => handleCall(client.phone)}
                    title="Zadzwoń"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => handleSMS(client.phone)}
                    title="SMS"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  {client.email && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-1"
                      onClick={() => handleEmail(client.email)}
                      title="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => navigate(`/clients/${client.id}`)}
                    title="Historia"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                    onClick={() => {
                      setSelectedClient(client);
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
                    onClick={() => handleDelete(client.id)}
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
          {selectedClient && (
            <EditClientDialog
              client={selectedClient}
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedClient(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
