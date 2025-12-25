import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import TopNavigation from './TopNavigation';

export default function DesktopLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r bg-card p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-primary mb-8">Manager Usług</h1>
        <TopNavigation />
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
