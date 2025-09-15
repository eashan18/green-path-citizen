import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Truck, Fuel, Wrench, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const Vehicle = () => {
  const vehicleData = {
    id: 'WM-001',
    model: 'Tata LPT 1613',
    capacity: '8 Tons',
    fuelLevel: 75,
    status: 'active',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15',
    mileage: '12.5 km/l',
    totalKm: '45,230 km'
  };

  const maintenanceLog = [
    { date: '2024-01-15', type: 'Regular Service', status: 'completed', cost: '₹8,500' },
    { date: '2024-01-10', type: 'Tire Replacement', status: 'completed', cost: '₹12,000' },
    { date: '2024-02-15', type: 'Oil Change', status: 'scheduled', cost: '₹3,500' },
    { date: '2024-02-20', type: 'Brake Inspection', status: 'scheduled', cost: '₹2,000' },
  ];

  const fuelHistory = [
    { date: '2024-01-20', amount: '50L', cost: '₹4,500', mileage: '12.3 km/l' },
    { date: '2024-01-18', amount: '45L', cost: '₹4,050', mileage: '12.8 km/l' },
    { date: '2024-01-15', amount: '52L', cost: '₹4,680', mileage: '12.1 km/l' },
  ];

  return (
    <DashboardLayout userType="worker">
      <div className="space-y-6">
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Vehicle Status</h1>
          <p className="opacity-90">Monitor your assigned vehicle's condition and maintenance.</p>
        </div>

        {/* Vehicle Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Status</CardTitle>
              <Truck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{vehicleData.status}</div>
              <Badge className="mt-2 gradient-success text-white">Operational</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fuel Level</CardTitle>
              <Fuel className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{vehicleData.fuelLevel}%</div>
              <Progress value={vehicleData.fuelLevel} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <Truck className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{vehicleData.capacity}</div>
              <Badge variant="secondary" className="mt-2">Max Load</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mileage</CardTitle>
              <Fuel className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{vehicleData.mileage}</div>
              <Badge className="mt-2 gradient-success text-white">Efficient</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Details */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Vehicle ID</label>
                <p className="text-lg font-semibold">{vehicleData.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Model</label>
                <p className="text-lg font-semibold">{vehicleData.model}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Distance</label>
                <p className="text-lg font-semibold">{vehicleData.totalKm}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Next Service</label>
                <p className="text-lg font-semibold">{vehicleData.nextMaintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance Log */}
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-accent" />
                Maintenance Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {maintenanceLog.map((log, index) => (
                <div key={index} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{log.type}</span>
                    <Badge 
                      variant={log.status === 'completed' ? 'default' : 'secondary'}
                      className={log.status === 'completed' ? 'gradient-success text-white' : ''}
                    >
                      {log.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Calendar className="h-3 w-3 mr-1" />}
                      {log.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{log.date}</span>
                    <span className="font-medium">{log.cost}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Wrench className="h-4 w-4 mr-2" />
                Request Maintenance
              </Button>
            </CardContent>
          </Card>

          {/* Fuel History */}
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-warning" />
                Fuel History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fuelHistory.map((fuel, index) => (
                <div key={index} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{fuel.amount} Fuel</span>
                    <span className="text-sm font-medium">{fuel.cost}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{fuel.date}</span>
                    <span>Mileage: {fuel.mileage}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Fuel className="h-4 w-4 mr-2" />
                Add Fuel Entry
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="gradient-primary">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
              <Button variant="outline">
                <Fuel className="h-4 w-4 mr-2" />
                Refuel Log
              </Button>
              <Button variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                Maintenance
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Vehicle;