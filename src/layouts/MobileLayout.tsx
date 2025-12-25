import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigation from './BottomNavigation';

export default function MobileLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNavigation />
      <Toaster />
    </div>
  );
}
