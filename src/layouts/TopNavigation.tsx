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
              'group flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
              isActive
                ? 'bg-primary/20 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent'
            )}
          >
            <Icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive && "text-primary")} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
