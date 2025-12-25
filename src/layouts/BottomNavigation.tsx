import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/lib/stores/uiStore';
import { Home, Users, ClipboardList, FileText, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { id: 'dashboard' as const, label: 'Pulpit', icon: Home },
  { id: 'clients' as const, label: 'Klienci', icon: Users },
  { id: 'orders' as const, label: 'Zlecenia', icon: ClipboardList },
  { id: 'quotes' as const, label: 'Kosztorysy', icon: FileText },
  { id: 'reports' as const, label: 'Raporty', icon: BarChart3 },
  { id: 'settings' as const, label: 'Ustawienia', icon: Settings },
];

export default function BottomNavigation() {
  const navigate = useNavigate();
  const { currentPage } = useUIStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
      <div className="grid grid-cols-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id}`)}
              className={`flex flex-col items-center justify-center py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
