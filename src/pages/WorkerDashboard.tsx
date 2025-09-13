import { useEffect, useMemo, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import RouteMap, { LatLng } from '@/components/maps/RouteMap';
import { 
  Truck, 
  CheckSquare, 
  Clock, 
  Award, 
  Navigation,
  Calendar,
  Timer
} from 'lucide-react';

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  location_lat: number | null;
  location_lng: number | null;
  status: string;
}

interface TrackingRow {
  id: string;
  driver_id: string;
  start_lat: number | null;
  start_lng: number | null;
  end_lat: number | null;
  end_lng: number | null;
  current_lat: number | null;
  current_lng: number | null;
  status: string;
}

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [myTask, setMyTask] = useState<TaskRow | null>(null);
  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [current, setCurrent] = useState<LatLng | null>(null);
  const [trackingRow, setTrackingRow] = useState<TrackingRow | null>(null);
  const pathRef = useRef<LatLng[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Fetch assigned task
  useEffect(() => {
    const fetchTask = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('tasks')
        .select('id,title,description,location_lat,location_lng,status')
        .eq('worker_id', user.id)
        .in('status', ['assigned', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1);
      const row = data && data[0];
      if (row) {
        const task: TaskRow = {
          ...row,
          location_lat: row.location_lat ? Number(row.location_lat) : null,
          location_lng: row.location_lng ? Number(row.location_lng) : null,
        } as any;
        setMyTask(task);
        if (task.location_lat && task.location_lng) setEnd({ lat: task.location_lat, lng: task.location_lng });
      } else {
        setMyTask(null);
      }
    };
    fetchTask();
  }, [user?.id]);

  // Try to get current geolocation for start
  useEffect(() => {
    if (!start && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const ll = { lat: pos.coords.latitude, lng: pos.coords.longitude } as LatLng;
          setStart(ll);
          setCurrent(ll);
        },
        () => {
          // fallback near end if geolocation denied
          if (end) {
            const ll = { lat: end.lat + 0.005, lng: end.lng + 0.005 } as LatLng;
            setStart(ll);
            setCurrent(ll);
          }
        }
      );
    }
  }, [start, end?.lat, end?.lng]);

  const onDirectionsReady = (path: LatLng[]) => {
    pathRef.current = path;
  };

  const startRoute = async () => {
    if (!user || !start || !end) return;
    try {
      // Create or resume tracking
      const { data: existing } = await supabase
        .from('vehicle_tracking')
        .select('*')
        .eq('driver_id', user.id)
        .in('status', ['in_progress'])
        .order('created_at', { ascending: false })
        .limit(1);

      let row: TrackingRow | null = existing && existing[0];

      if (!row) {
        const { data, error } = await supabase
          .from('vehicle_tracking')
          .insert({
            driver_id: user.id,
            start_lat: start.lat,
            start_lng: start.lng,
            end_lat: end.lat,
            end_lng: end.lng,
            current_lat: start.lat,
            current_lng: start.lng,
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .select('*')
          .single();
        if (error) throw error;
        row = data as any;
      }

      const normalized: TrackingRow = {
        ...row,
        start_lat: row.start_lat ? Number(row.start_lat) : null,
        start_lng: row.start_lng ? Number(row.start_lng) : null,
        end_lat: row.end_lat ? Number(row.end_lat) : null,
        end_lng: row.end_lng ? Number(row.end_lng) : null,
        current_lat: row.current_lat ? Number(row.current_lat) : null,
        current_lng: row.current_lng ? Number(row.current_lng) : null,
      } as any;

      setTrackingRow(normalized);
      toast({ title: 'Route Started', description: 'Your live location is now being shared.' });

      // Animate along the polyline and update DB
      if (intervalRef.current) window.clearInterval(intervalRef.current);

      let idx = 0;
      intervalRef.current = window.setInterval(async () => {
        if (!pathRef.current.length) return;
        const p = pathRef.current[idx];
        if (!p) {
          // complete route
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          await supabase
            .from('vehicle_tracking')
            .update({ status: 'completed', completed_at: new Date().toISOString() })
            .eq('id', normalized.id);
          toast({ title: 'Route Completed' });
          return;
        }
        setCurrent(p);
        await supabase
          .from('vehicle_tracking')
          .update({ current_lat: p.lat, current_lng: p.lng })
          .eq('id', normalized.id);
        idx = Math.min(idx + 1, pathRef.current.length);
      }, 1000);
    } catch (e: any) {
      toast({ title: 'Error starting route', description: e.message, variant: 'destructive' });
    }
  };

  const stopRoute = async () => {
    if (!trackingRow) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    await supabase
      .from('vehicle_tracking')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', trackingRow.id);
    toast({ title: 'Route Stopped' });
  };

  return (
    <DashboardLayout userType="worker">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Worker Dashboard</h1>
          <p className="opacity-90">Manage your tasks efficiently and track your performance.</p>
        </div>

        {/* Quick Stats (static demo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Task</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{myTask ? 1 : 0}</div>
              <Badge variant="secondary" className="mt-2">{myTask ? (myTask.status) : 'None'}</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Status</CardTitle>
              <Truck className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{trackingRow ? 'Active' : 'Idle'}</div>
              <Badge className="mt-2 gradient-success text-white">Realtime</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,840</div>
              <Badge variant="secondary" className="mt-2">+120 Today</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">95%</div>
              <Progress value={95} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Task + Live Route */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-warning" />
              {myTask ? myTask.title : 'No task assigned yet'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myTask && end && start ? (
              <>
                <RouteMap start={start} end={end} current={current} onDirectionsReady={onDirectionsReady} height={420} />
                <div className="flex gap-2">
                  <Button className="gradient-primary" onClick={startRoute} disabled={!pathRef.current.length}>Start Route</Button>
                  <Button variant="outline" onClick={stopRoute} disabled={!trackingRow}>Stop</Button>
                  <Button variant="outline">
                    <Navigation className="h-4 w-4 mr-1" /> Navigate
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Waiting for assignment or location…</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;