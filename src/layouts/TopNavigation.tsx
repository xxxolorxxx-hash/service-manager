import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/lib/stores/uiStore';
import { Home, Users, ClipboardList, FileText, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { id: 'dashboard' as const, label: 'Pulpit', icon: Home },
  { id: 'clients' as const, label: 'Klienci', icon: Users },
  { id: 'orders' as const, label: 'Zlecenia', icon: ClipboardList },
  { id: 'quotes' as const, label: 'Kosztorysy', icon: FileText },
  { id: 'reports' as const, label: 'Raporty', icon: BarChart3 },
  { id: 'settings' as const, label: 'Ustawienia', icon: Settings },
];

export default function TopNavigation() {
  const navigate = useNavigate();
  const { currentPage } = useUIStore();

  return (
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(`/${item.id}`)}
            className={cn(
              'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
