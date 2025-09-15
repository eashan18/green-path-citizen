import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Clock, CheckCircle } from 'lucide-react';

const ManageWorkers = () => {
  const mockWorkers = [
    { id: '1', name: 'Raj Kumar', status: 'active', currentTask: 'Park Street Collection', phone: '+91 98765 43210' },
    { id: '2', name: 'Priya Sharma', status: 'idle', currentTask: null, phone: '+91 98765 43211' },
    { id: '3', name: 'Amit Singh', status: 'active', currentTask: 'Market Area Cleanup', phone: '+91 98765 43212' },
    { id: '4', name: 'Sunita Devi', status: 'offline', currentTask: null, phone: '+91 98765 43213' },
  ];

  return (
    <DashboardLayout userType="committee">
      <div className="space-y-6">
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Manage Workers</h1>
          <p className="opacity-90">View and manage all registered workers in your area.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockWorkers.length}</div>
              <Badge variant="secondary" className="mt-2">Registered</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {mockWorkers.filter(w => w.status === 'active').length}
              </div>
              <Badge className="mt-2 gradient-success text-white">Working</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {mockWorkers.filter(w => w.status === 'idle').length}
              </div>
              <Badge variant="secondary" className="mt-2">Ready</Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-medium border-0">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Worker Directory</CardTitle>
            <Button className="gradient-primary">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Worker
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockWorkers.map((worker) => (
                <div key={worker.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{worker.name}</h3>
                    <Badge 
                      variant={worker.status === 'active' ? 'default' : worker.status === 'idle' ? 'secondary' : 'destructive'}
                      className={worker.status === 'active' ? 'gradient-success text-white' : ''}
                    >
                      {worker.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{worker.phone}</p>
                  {worker.currentTask && (
                    <p className="text-sm">Current Task: <span className="font-medium">{worker.currentTask}</span></p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Contact</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageWorkers;