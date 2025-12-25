import { Badge } from '@/components/ui/badge';
import { QuoteStatus } from '@/types';

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

export default function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  const statusConfig: Record<QuoteStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'destructive' }> = {
    projekt: { label: 'Projekt', variant: 'info' },
    wyslane: { label: 'Wysłane', variant: 'warning' },
    zaakceptowane: { label: 'Zaakceptowane', variant: 'success' },
    odrzucone: { label: 'Odrzucone', variant: 'destructive' },
  };

  const config = statusConfig[status] || statusConfig.projekt;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
