import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigation from './BottomNavigation';
import TopNavigation from './TopNavigation';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card p-6 fixed inset-y-0 z-30">
        <h1 className="text-2xl font-bold text-primary mb-8">Manager Usług</h1>
        <TopNavigation />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen md:pl-64">
        <div className="flex-1 pb-16 md:pb-0">
           <Outlet />
        </div>
      </main>

      {/* Mobile Navigation - component handles md:hidden itself */}
      <BottomNavigation />
      
      <Toaster />
    </div>
  );
}
