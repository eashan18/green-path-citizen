import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'citizen' | 'worker' | 'committee' | 'ulb';
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar 
        userType={userType} 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-auto gradient-bg">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}