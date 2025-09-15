import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, Map, Clock, MapPin } from 'lucide-react';

const Routes = () => {
  const mockRoutes = [
    {
      id: '1',
      name: 'Morning Collection Route A',
      description: 'Residential areas in Sector 15-18',
      distance: '12.5 km',
      estimatedTime: '2h 30min',
      stops: 15,
      status: 'active',
      nextStop: 'Park Street Collection Point'
    },
    {
      id: '2', 
      name: 'Commercial Zone Route',
      description: 'Market and business district cleanup',
      distance: '8.2 km',
      estimatedTime: '1h 45min',
      stops: 12,
      status: 'scheduled',
      nextStop: 'Central Market Hub'
    },
    {
      id: '3',
      name: 'Hospital & Institution Route',
      description: 'Medical waste and institutional areas',
      distance: '6.8 km',
      estimatedTime: '1h 20min',
      stops: 8,
      status: 'completed',
      nextStop: null
    }
  ];

  return (
    <DashboardLayout userType="worker">
      <div className="space-y-6">
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Collection Routes</h1>
          <p className="opacity-90">View your assigned routes and navigate efficiently.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <Navigation className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {mockRoutes.filter(r => r.status === 'active').length}
              </div>
              <Badge className="mt-2 gradient-primary text-white">In Progress</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
              <Map className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">27.5 km</div>
              <Badge variant="secondary" className="mt-2">Today</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <Clock className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">92%</div>
              <Badge className="mt-2 gradient-success text-white">Excellent</Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Route Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRoutes.map((route) => (
              <div key={route.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{route.name}</h3>
                  <Badge 
                    variant={route.status === 'active' ? 'default' : route.status === 'completed' ? 'secondary' : 'outline'}
                    className={route.status === 'active' ? 'gradient-primary text-white' : route.status === 'completed' ? 'gradient-success text-white' : ''}
                  >
                    {route.status}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">{route.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-primary" />
                    <span>{route.distance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>{route.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-warning" />
                    <span>{route.stops} stops</span>
                  </div>
                  {route.nextStop && (
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-success" />
                      <span className="truncate">Next: {route.nextStop}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  {route.status === 'active' && (
                    <>
                      <Button className="gradient-primary">Continue Route</Button>
                      <Button variant="outline">Pause</Button>
                    </>
                  )}
                  {route.status === 'scheduled' && (
                    <Button className="gradient-success text-white">Start Route</Button>
                  )}
                  <Button variant="outline">
                    <Map className="h-4 w-4 mr-1" />
                    View Map
                  </Button>
                  <Button variant="outline">Route Details</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Routes;