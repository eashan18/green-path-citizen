import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  Megaphone, 
  FileText, 
  AlertTriangle,
  Users,
  BarChart3,
  Send,
  PlusCircle,
  Calendar,
  Globe
} from 'lucide-react';

const ULBDashboard = () => {
  return (
    <DashboardLayout userType="ulb">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">ULB Management Portal</h1>
          <p className="opacity-90">
            Urban Local Body - Policy coordination, notices, and strategic waste management oversight.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Committees</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">8</div>
              <Badge variant="secondary" className="mt-2">
                All Operational
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Policy Updates</CardTitle>
              <FileText className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">3</div>
              <Badge variant="secondary" className="mt-2">
                This Month
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citizen Reports</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">156</div>
              <Badge variant="secondary" className="mt-2">
                +12 Today
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">94%</div>
              <Badge className="mt-2 gradient-success text-white">
                Above Target
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notice Creation */}
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Create Notice/Update
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notice-title">Notice Title</Label>
                <Input 
                  id="notice-title"
                  placeholder="Enter notice title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notice-content">Notice Content</Label>
                <Textarea 
                  id="notice-content"
                  placeholder="Enter detailed notice content..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effective-date">Effective Date</Label>
                  <Input 
                    id="effective-date"
                    type="date"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <select className="w-full p-2 border border-input rounded-md">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <Button className="w-full gradient-primary">
                <Send className="h-4 w-4 mr-2" />
                Send to Committees
              </Button>
            </CardContent>
          </Card>

          {/* Quick Report */}
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Quick Waste Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location Description</Label>
                <Input 
                  id="location"
                  placeholder="Describe the location..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="waste-type">Waste Type</Label>
                <select className="w-full p-2 border border-input rounded-md">
                  <option value="mixed">Mixed Waste</option>
                  <option value="plastic">Plastic</option>
                  <option value="organic">Organic</option>
                  <option value="hazardous">Hazardous</option>
                  <option value="electronic">Electronic</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe the waste issue..."
                  rows={3}
                />
              </div>
              
              <Button className="w-full" variant="outline">
                📍 Select Location on Map
              </Button>
              
              <Button className="w-full gradient-primary">
                Submit Report to Committee
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sent Notices */}
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Notices Sent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="destructive">Critical</Badge>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <h4 className="font-semibold">New Hazardous Waste Guidelines</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Updated protocols for industrial waste handling...
                </p>
                <Badge variant="secondary">Sent to all committees</Badge>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="gradient-success text-white">Medium</Badge>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
                <h4 className="font-semibold">Budget Allocation Update</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Q2 budget distribution for waste management...
                </p>
                <Badge variant="secondary">Read by 7/8 committees</Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <FileText className="h-4 w-4 mr-1" />
                View All Sent Notices
              </Button>
            </CardContent>
          </Card>

          {/* Policy Metrics */}
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-success" />
                Policy Impact Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">89%</div>
                  <p className="text-sm text-muted-foreground">Policy Compliance</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-success">24</div>
                  <p className="text-sm text-muted-foreground">Active Policies</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Waste Segregation Policy</span>
                  <Badge className="gradient-success text-white">92% Compliance</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Collection Schedule Policy</span>
                  <Badge className="gradient-primary text-white">87% Compliance</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Recycling Incentive Policy</span>
                  <Badge variant="secondary">78% Compliance</Badge>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Globe className="h-4 w-4 mr-1" />
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ULBDashboard;