import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  Megaphone
} from 'lucide-react';

interface SidebarProps {
  userType: 'citizen' | 'worker' | 'committee' | 'ulb';
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = {
  citizen: [
    { icon: PlayCircle, label: 'Training', href: '/citizen/training' },
    { icon: AlertTriangle, label: 'Report Waste', href: '/citizen/report' },
    { icon: Award, label: 'Incentives', href: '/citizen/incentives' },
    { icon: BookOpen, label: 'Knowledge Base', href: '/citizen/knowledge' },
  ],
  worker: [
    { icon: PlayCircle, label: 'Training', href: '/worker/training' },
    { icon: FileText, label: 'Assigned Tasks', href: '/worker/assigned' },
    { icon: CheckSquare, label: 'Completed Tasks', href: '/worker/completed' },
    { icon: Award, label: 'Incentives', href: '/worker/incentives' },
    { icon: DollarSign, label: 'Penalties', href: '/worker/penalties' },
    { icon: Truck, label: 'Vehicle Location', href: '/worker/vehicle' },
  ],
  committee: [
    { icon: Bell, label: 'Notifications', href: '/committee/notifications' },
    { icon: FileText, label: 'Reports', href: '/committee/reports' },
    { icon: ThumbsUp, label: 'Approval Tasks', href: '/committee/approval' },
    { icon: Navigation, label: 'Vehicle Tracking', href: '/committee/tracking' },
    { icon: ShoppingCart, label: 'Shopping', href: '/committee/shopping' },
    { icon: Calendar, label: 'Events', href: '/committee/events' },
  ],
  ulb: [
    { icon: Megaphone, label: 'Notices', href: '/ulb/notices' },
    { icon: AlertTriangle, label: 'Report Waste', href: '/ulb/report' },
  ],
};

export function Sidebar({ userType, collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
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
        <Link 
          to="/"
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg text-sm transition-colors',
            'hover:bg-destructive/10 text-destructive',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
}