import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigation from './BottomNavigation';
import TopNavigation from './TopNavigation';
import { ClipboardList } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground premium-gradient">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-card/30 backdrop-blur-3xl p-8 fixed inset-y-0 z-30">
        <div className="flex items-center space-x-3 mb-10">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ClipboardList className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Manager</h1>
        </div>
        <TopNavigation />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen md:pl-72 focus:outline-none">
        <div className="flex-1 pb-16 md:pb-0 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <BottomNavigation />

      <Toaster />
    </div>
  );
}
