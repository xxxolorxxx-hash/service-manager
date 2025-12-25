import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/lib/stores/uiStore';
import { Home, Users, ClipboardList, FileText, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'dashboard' as const, label: 'Pulpit', icon: Home },
  { id: 'calendar' as const, label: 'Kalendarz', icon: Calendar },
  { id: 'clients' as const, label: 'Klienci', icon: Users },
  { id: 'orders' as const, label: 'Zlecenia', icon: ClipboardList },
  { id: 'quotes' as const, label: 'Kosztorysy', icon: FileText },
];

export default function BottomNavigation() {
  const navigate = useNavigate();
  const { currentPage } = useUIStore();

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-50 md:hidden">
      <nav className="mx-auto max-w-md bg-card/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-2">
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id} className="relative">
                <button
                  onClick={() => navigate(`/${item.id}`)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-3 transition-all duration-300 rounded-xl relative z-10",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5 mb-1", isActive && "scale-110")} />
                  <span className="text-[10px] font-medium">{item.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
