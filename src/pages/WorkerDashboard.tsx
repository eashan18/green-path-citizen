import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Truck, 
  CheckSquare, 
  Clock, 
  Award, 
  AlertTriangle,
  Navigation,
  Calendar,
  Timer
} from 'lucide-react';

const WorkerDashboard = () => {
  return (
    <DashboardLayout userType="worker">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Worker Dashboard</h1>
          <p className="opacity-90">
            Manage your tasks efficiently and track your performance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">5</div>
              <Badge variant="secondary" className="mt-2">
                2 Due Today
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckSquare className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">8</div>
              <Badge variant="secondary" className="mt-2">
                100% On Time
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,840</div>
              <Badge variant="secondary" className="mt-2">
                +120 Today
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Status</CardTitle>
              <Truck className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">Active</div>
              <Badge className="mt-2 gradient-success text-white">
                On Route
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Current Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-warning" />
                Urgent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">Plastic Waste Collection</h4>
                    <p className="text-sm text-muted-foreground">Park Street, Zone A</p>
                  </div>
                  <Badge variant="destructive">2h left</Badge>
                </div>
                <Progress value={60} className="mb-3" />
                <div className="flex gap-2">
                  <Button size="sm" className="gradient-primary">
                    Start Task
                  </Button>
                  <Button size="sm" variant="outline">
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">Bin Replacement</h4>
                    <p className="text-sm text-muted-foreground">Main Road, Zone B</p>
                  </div>
                  <Badge variant="secondary">4h left</Badge>
                </div>
                <Progress value={20} className="mb-3" />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-success" />
                Recent Completions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <CheckSquare className="h-5 w-5 text-success" />
                <div className="flex-1">
                  <p className="font-medium">Organic Waste Collection</p>
                  <p className="text-sm text-muted-foreground">Market Area - 2 hours ago</p>
                </div>
                <Badge className="gradient-success text-white">+80 pts</Badge>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <CheckSquare className="h-5 w-5 text-success" />
                <div className="flex-1">
                  <p className="font-medium">Street Cleaning</p>
                  <p className="text-sm text-muted-foreground">City Center - 4 hours ago</p>
                </div>
                <Badge className="gradient-success text-white">+60 pts</Badge>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <CheckSquare className="h-5 w-5 text-success" />
                <div className="flex-1">
                  <p className="font-medium">Hazardous Waste Disposal</p>
                  <p className="text-sm text-muted-foreground">Industrial Zone - Yesterday</p>
                </div>
                <Badge className="gradient-success text-white">+120 pts</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              This Week's Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">45</div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <Progress value={90} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <p className="text-sm text-muted-foreground">On-Time Completion</p>
                <Progress value={95} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-warning mb-2">2</div>
                <p className="text-sm text-muted-foreground">Penalties</p>
                <Badge variant="destructive" className="mt-2">-20 pts</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;