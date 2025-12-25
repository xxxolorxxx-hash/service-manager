import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderById, useUpdateOrder, useDeleteOrder, useUpdateOrderTasks } from '@/lib/hooks/useOrders';
import { useClients } from '@/lib/hooks/useClients';
import { useUIStore } from '@/lib/stores/uiStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Clock,
    Edit,
    Trash2,
    FileText,
    User,
    Phone,
    Mail
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { useToast } from '@/lib/hooks/useToast';
import StatusBadge from '@/components/orders/StatusBadge';
import EditOrderDialog from '@/components/orders/EditOrderDialog';
import OrderGallery from '@/components/orders/OrderGallery';
import { motion } from 'framer-motion';
import { OrderChecklist } from '@/components/orders/OrderChecklist';
import { MaterialsSection } from '@/components/orders/MaterialsSection';

import { ChecklistItem } from '@/types';

export default function OrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { order, isLoading: isOrderLoading } = useOrderById(id!);
    const { clients } = useClients();
    const updateOrder = useUpdateOrder();
    const updateOrderTasks = useUpdateOrderTasks();
    const deleteOrder = useDeleteOrder();
    const { setCurrentPage } = useUIStore();
    const { toast } = useToast();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        setCurrentPage('orders');
    }, [setCurrentPage]);

    if (isOrderLoading) {
        return <div className="p-8 text-center">Ładowanie szczegółów zlecenia...</div>;
    }

    if (!order) {
        return (
            <div className="container mx-auto p-8 text-center space-y-4">
                <p className="text-xl">Nie znaleziono zlecenia.</p>
                <Button onClick={() => navigate('/orders')}>Powrót do listy</Button>
            </div>
        );
    }

    const client = clients.find(c => c.id === order.clientId);

    const handleDelete = async () => {
        if (confirm('Czy na pewno chcesz usunąć to zlecenie? Wszystkie zdjęcia zostaną utracone.')) {
            await deleteOrder(order.id);
            toast({
                title: 'Sukces',
                description: 'Zlecenie zostało usunięte',
                variant: 'success',
            });
            navigate('/orders');
        }
    };

    const handleImagesChange = async (images: { before: string[]; after: string[] }) => {
        await updateOrder(order.id, { images });
    };

    const handleTasksUpdate = async (tasks: ChecklistItem[]) => {
        await updateOrderTasks(order.id, tasks);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto p-4 md:p-8 space-y-8"
        >
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate('/orders')} className="group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Powrót
                </Button>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edytuj
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Usuń
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card className="overflow-hidden border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-mono text-muted-foreground">{order.orderNumber}</span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <CardTitle className="text-3xl font-bold">{order.title}</CardTitle>
                                </div>
                                {order.value && (
                                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                        {formatCurrency(order.value)}
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-muted-foreground whitespace-pre-wrap">{order.description || 'Brak opisu.'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 text-sm">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Rozpoczęcie</p>
                                        <p className="font-medium">{formatDate(order.startDate)}</p>
                                    </div>
                                </div>
                                {order.endDate && (
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="p-2 rounded-lg bg-white/5">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Zakończenie</p>
                                            <p className="font-medium">{formatDate(order.endDate)}</p>
                                        </div>
                                    </div>
                                )}
                                {order.address && (
                                    <div className="col-span-2 flex items-center space-x-3 text-sm">
                                        <div className="p-2 rounded-lg bg-white/5">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Lokalizacja</p>
                                            <p className="font-medium">{order.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <OrderChecklist
                        tasks={order.tasks || []}
                        onUpdate={handleTasksUpdate}
                    />

                    <MaterialsSection orderId={order.id} />

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center">
                            <ImageIcon className="mr-3 h-6 w-6 text-primary" />
                            Galeria Realizacji
                        </h2>
                        <OrderGallery images={order.images} onImagesChange={handleImagesChange} />
                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="border-white/5 bg-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <User className="mr-2 h-5 w-5 text-primary" />
                                Klient
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {client ? (
                                <>
                                    <div>
                                        <p className="font-bold text-lg">{client.name}</p>
                                        {client.company && <p className="text-sm text-muted-foreground">{client.company}</p>}
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <Button variant="ghost" className="w-full justify-start h-9 px-2 hover:bg-white/10" asChild>
                                            <a href={`tel:${client.phone}`}>
                                                <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                                                {client.phone}
                                            </a>
                                        </Button>
                                        {client.email && (
                                            <Button variant="ghost" className="w-full justify-start h-9 px-2 hover:bg-white/10" asChild>
                                                <a href={`mailto:${client.email}`}>
                                                    <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                                                    {client.email}
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-red-400">Brak przypisanego klienta</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-white/5 bg-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-primary" />
                                Szybkie akcje
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => navigate(`/quotes/new?orderId=${order.id}`)}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Utwórz kosztorys
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <EditOrderDialog
                        order={order}
                        onClose={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}

// Sprawdź brakujące importy
import { Image as ImageIcon } from 'lucide-react';
