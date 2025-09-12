import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  MapPin, 
  PlayCircle, 
  BookOpen, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';

const CitizenDashboard = () => {
  return (
    <DashboardLayout userType="citizen">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome Back, Citizen!</h1>
          <p className="opacity-90">
            Make a difference in your community. Report waste, learn sustainability, and earn rewards.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2,450</div>
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +180 this week
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Submitted</CardTitle>
              <MapPin className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">12</div>
              <Badge variant="secondary" className="mt-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                8 Resolved
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
              <PlayCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">75%</div>
              <Badge variant="secondary" className="mt-2">
                9/12 Videos Completed
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Star className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">Silver</div>
              <Badge variant="secondary" className="mt-2">
                550 points to Gold
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Quick Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Spotted waste in your area? Report it quickly and earn points.
              </p>
              <Button 
                className="w-full gradient-primary hover:opacity-90"
                onClick={() => window.location.href = '/report-waste'}
              >
                Report Waste Now
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-success" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Complete training modules to unlock more rewards and knowledge.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/training'}
              >
                Continue Training
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
                <div className="flex-1">
                  <p className="font-medium">Waste report resolved</p>
                  <p className="text-sm text-muted-foreground">Park Street - Plastic bottles</p>
                </div>
                <Badge className="gradient-success text-white">+50 points</Badge>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <PlayCircle className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Training video completed</p>
                  <p className="text-sm text-muted-foreground">Recycling Basics - Module 3</p>
                </div>
                <Badge className="gradient-primary text-white">+25 points</Badge>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <MapPin className="h-5 w-5 text-accent" />
                <div className="flex-1">
                  <p className="font-medium">New waste report submitted</p>
                  <p className="text-sm text-muted-foreground">Main Road - Mixed waste</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;