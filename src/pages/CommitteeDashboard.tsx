import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  FileText, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MapPin,
  Truck,
  Calendar,
  ShoppingCart
} from 'lucide-react';

const CommitteeDashboard = () => {
  return (
    <DashboardLayout userType="committee">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Committee Control Panel</h1>
          <p className="opacity-90">
            Oversee operations, manage tasks, and coordinate waste management activities.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Bell className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">23</div>
              <Badge variant="secondary" className="mt-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                8 Urgent
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">18</div>
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2 Today
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Assigned</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">34</div>
              <Badge variant="secondary" className="mt-2">
                28 In Progress
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicles Tracking</CardTitle>
              <Truck className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">12</div>
              <Badge className="mt-2 gradient-success text-white">
                All Active
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-warning" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-2 bg-muted rounded">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Urgent waste report</p>
                  <p className="text-muted-foreground">Hospital Area - Hazardous waste</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 bg-muted rounded">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Task completed</p>
                  <p className="text-muted-foreground">Park cleaning by Worker #7</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View All Notifications
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Assignment Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border border-border rounded p-3">
                <h4 className="font-medium text-sm">Mixed Waste Collection</h4>
                <p className="text-xs text-muted-foreground">Central Park Area</p>
                <Button size="sm" className="w-full mt-2 gradient-primary">
                  Assign Worker
                </Button>
              </div>
              <div className="border border-border rounded p-3">
                <h4 className="font-medium text-sm">Bin Replacement</h4>
                <p className="text-xs text-muted-foreground">Market Street</p>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Assign Worker
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-success" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>9:00 AM - Team Meeting</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>11:30 AM - Site Inspection</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>2:00 PM - Budget Review</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule Event
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reports Overview */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Reports & Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="destructive">High Priority</Badge>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold">Industrial Waste Spill</h4>
                  <p className="text-sm text-muted-foreground mb-3">Factory District - Citizen Report</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="gradient-primary">Assign</Button>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">Medium</Badge>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <h4 className="font-semibold">Street Cleaning</h4>
                  <p className="text-sm text-muted-foreground mb-3">Downtown Area - Completed</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Review Completion
                  </Button>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="gradient-success text-white">Low</Badge>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold">Routine Collection</h4>
                  <p className="text-sm text-muted-foreground mb-3">Residential Zone A - In Progress</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Track Vehicle
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CommitteeDashboard;