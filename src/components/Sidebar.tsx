import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChevronLeft, 
  Leaf, 
  LogOut, 
  PlayCircle, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  MapPin, 
  CheckSquare, 
  Truck, 
  DollarSign,
  Bell,
  FileText,
  ThumbsUp,
  Navigation,
  ShoppingCart,
  Calendar,
  Megaphone,
  MessageSquare,
  Home,
  Users,
  Building,
  TrendingUp,
  BarChart,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  userType: 'citizen' | 'worker' | 'committee' | 'ulb';
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = {
  citizen: [
    { icon: Home, label: 'Dashboard', href: '/citizen-dashboard' },
    { icon: AlertTriangle, label: 'Report Waste', href: '/report-waste' },
    { icon: BookOpen, label: 'Training', href: '/training' },
    { icon: MessageSquare, label: 'Voice Chat', href: '/voice-chat' },
    { icon: Award, label: 'Rewards', href: '/rewards' },
  ],
  worker: [
    { icon: Home, label: 'Dashboard', href: '/worker-dashboard' },
    { icon: ClipboardList, label: 'Tasks', href: '/tasks' },
    { icon: MapPin, label: 'Routes', href: '/routes' },
    { icon: Truck, label: 'Vehicle Status', href: '/vehicle' },
    { icon: BookOpen, label: 'Training', href: '/training' },
  ],
  committee: [
    { icon: Home, label: 'Dashboard', href: '/committee-dashboard' },
    { icon: Users, label: 'Manage Workers', href: '/manage-workers' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: Calendar, label: 'Schedule', href: '/schedule' },
    { icon: BarChart, label: 'Analytics', href: '/analytics' },
  ],
  ulb: [
    { icon: Home, label: 'Dashboard', href: '/ulb-dashboard' },
    { icon: Building, label: 'Committees', href: '/committees' },
    { icon: FileText, label: 'Policies', href: '/policies' },
    { icon: TrendingUp, label: 'City Analytics', href: '/city-analytics' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
  ],
};

export function Sidebar({ userType, collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const items = navigationItems[userType];
  const userTypeLabels = {
    citizen: 'Citizen Portal',
    worker: 'Worker Dashboard',
    committee: 'Committee Panel',
    ulb: 'ULB Management'
  };

  return (
    <div className={cn(
      'flex flex-col h-screen bg-card border-r border-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <Leaf className="h-8 w-8 text-primary" />
            {!collapsed && (
              <div>
                <h2 className="text-lg font-semibold">EcoManage</h2>
                <p className="text-xs text-muted-foreground">{userTypeLabels[userType]}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg text-sm transition-colors',
                    'hover:bg-muted',
                    isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.label : ''}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button 
          onClick={async () => { await signOut(); navigate('/login'); }}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg text-sm transition-colors w-full text-left',
            'hover:bg-destructive/10 text-destructive',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}