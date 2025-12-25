import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'destructive' }> = {
    nowe: { label: 'Nowe', variant: 'info' },
    'w trakcie': { label: 'W trakcie', variant: 'warning' },
    ukończone: { label: 'Ukończone', variant: 'success' },
    oczekujące: { label: 'Oczekujące', variant: 'warning' },
    anulowane: { label: 'Anulowane', variant: 'destructive' },
  };

  const config = statusConfig[status] || statusConfig.nowe;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
