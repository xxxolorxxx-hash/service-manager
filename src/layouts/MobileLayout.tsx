import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigation from './BottomNavigation';
import { useUIStore } from '@/lib/stores/uiStore';
import { ClipboardList, Settings } from 'lucide-react';

export default function MobileLayout() {
  const { currentPage } = useUIStore();
  const navigate = useNavigate();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'clients': return 'Klienci';
      case 'orders': return 'Zlecenia';
      case 'quotes': return 'Kosztorysy';
      case 'reports': return 'Raporty';
      case 'settings': return 'Ustawienia';
      default: return 'Manager';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-28 md:pb-0 premium-gradient">
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-background/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 md:hidden flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">{getPageTitle()}</h1>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="h-8 w-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          title="Ustawienia"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>
      </header>

      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <BottomNavigation />
      <Toaster />
    </div>
  );
}
