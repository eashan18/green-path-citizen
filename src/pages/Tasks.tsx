import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, Clock, CheckCircle, MapPin, Timer } from 'lucide-react';

const Tasks = () => {
  const mockTasks = [
    { 
      id: '1', 
      title: 'Park Street Collection', 
      description: 'Collect waste from Park Street area including bins and scattered waste',
      status: 'in_progress', 
      priority: 'high',
      location: 'Park Street, Sector 15',
      estimatedTime: '2 hours',
      progress: 65
    },
    { 
      id: '2', 
      title: 'Market Area Cleanup', 
      description: 'Complete cleanup of the central market area after morning rush',
      status: 'assigned', 
      priority: 'medium',
      location: 'Central Market, Block A',
      estimatedTime: '3 hours',
      progress: 0
    },
    { 
      id: '3', 
      title: 'Hospital Zone Maintenance', 
      description: 'Regular maintenance and sanitization of hospital zone waste bins',
      status: 'completed', 
      priority: 'high',
      location: 'City Hospital Zone',
      estimatedTime: '1.5 hours',
      progress: 100
    },
  ];

  return (
    <DashboardLayout userType="worker">
      <div className="space-y-6">
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">My Tasks</h1>
          <p className="opacity-90">View and manage your assigned waste collection tasks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {mockTasks.filter(t => t.status === 'assigned').length}
              </div>
              <Badge variant="secondary" className="mt-2">Pending</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {mockTasks.filter(t => t.status === 'in_progress').length}
              </div>
              <Badge className="mt-2 gradient-primary text-white">Active</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {mockTasks.filter(t => t.status === 'completed').length}
              </div>
              <Badge className="mt-2 gradient-success text-white">Done</Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Task List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTasks.map((task) => (
              <div key={task.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <Badge 
                      variant={task.status === 'completed' ? 'default' : 'secondary'}
                      className={task.status === 'completed' ? 'gradient-success text-white' : task.status === 'in_progress' ? 'gradient-primary text-white' : ''}
                    >
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-muted-foreground">{task.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{task.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-accent" />
                    <span>Est. {task.estimatedTime}</span>
                  </div>
                </div>

                {task.status === 'in_progress' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {task.status === 'assigned' && (
                    <Button className="gradient-primary">Start Task</Button>
                  )}
                  {task.status === 'in_progress' && (
                    <>
                      <Button className="gradient-success text-white">Mark Complete</Button>
                      <Button variant="outline">Update Progress</Button>
                    </>
                  )}
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-1" />
                    View Route
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;