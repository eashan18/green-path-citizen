import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import RouteMap from '@/components/maps/RouteMap';
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
} from 'lucide-react';

interface ReportItem {
  id: string;
  title: string;
  description: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  user_id: string;
}

interface WorkerProfile { user_id: string; full_name: string | null }

interface TaskItem { id: string; title: string; worker_id: string | null; status: string; }

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

const CommitteeDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [pendingReports, setPendingReports] = useState<ReportItem[]>([]);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  const [trackOpen, setTrackOpen] = useState(false);
  const [trackForWorker, setTrackForWorker] = useState<string | null>(null);
  const [tracking, setTracking] = useState<TrackingRow | null>(null);
  const [current, setCurrent] = useState<{ lat: number; lng: number } | null>(null);

  const start = useMemo(() => tracking?.start_lat && tracking?.start_lng ? ({ lat: Number(tracking.start_lat), lng: Number(tracking.start_lng) }) : null, [tracking]);
  const end = useMemo(() => tracking?.end_lat && tracking?.end_lng ? ({ lat: Number(tracking.end_lat), lng: Number(tracking.end_lng) }) : null, [tracking]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: reports } = await supabase
        .from('reports')
        .select('id,title,description,location_lat,location_lng,location_address,user_id')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setPendingReports(
        (reports || []).map((r: any) => ({
          ...r,
          location_lat: r.location_lat ? Number(r.location_lat) : null,
          location_lng: r.location_lng ? Number(r.location_lng) : null,
        }))
      );

      const { data: workerProfiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, role')
        .eq('role', 'worker');
      setWorkers((workerProfiles || []).map((w: any) => ({ user_id: w.user_id, full_name: w.full_name })));
    };
    fetchData();
  }, []);

  const openAssign = (report: ReportItem) => {
    setSelectedReport(report);
    setSelectedWorkerId('');
    setAssignOpen(true);
  };

  const handleAssign = async () => {
    if (!user || !selectedReport || !selectedWorkerId) return;
    setAssigning(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        report_id: selectedReport.id,
        title: selectedReport.title,
        description: selectedReport.description,
        assigned_by: user.id,
        worker_id: selectedWorkerId,
        status: 'assigned',
        location_lat: selectedReport.location_lat,
        location_lng: selectedReport.location_lng,
      });
      if (error) throw error;

      toast({ title: 'Task Assigned', description: 'Worker has been assigned to this report.' });
      setAssignOpen(false);
      // Refresh pending reports list
      const { data: reports } = await supabase
        .from('reports')
        .select('id,title,description,location_lat,location_lng,location_address,user_id')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      setPendingReports(
        (reports || []).map((r: any) => ({
          ...r,
          location_lat: r.location_lat ? Number(r.location_lat) : null,
          location_lng: r.location_lng ? Number(r.location_lng) : null,
        }))
      );
    } catch (e: any) {
      toast({ title: 'Error assigning', description: e.message, variant: 'destructive' });
    } finally {
      setAssigning(false);
    }
  };

  // Tracking helpers
  const openTrackForWorker = async (workerId: string) => {
    setTrackForWorker(workerId);
    setTrackOpen(true);

    // Fetch latest in-progress tracking row
    const { data } = await supabase
      .from('vehicle_tracking')
      .select('*')
      .eq('driver_id', workerId)
      .in('status', ['in_progress'])
      .order('created_at', { ascending: false })
      .limit(1);

    const row = (data && data[0]) || null;
    if (row) {
      const normalized: TrackingRow = {
        ...row,
        start_lat: row.start_lat ? Number(row.start_lat) : null,
        start_lng: row.start_lng ? Number(row.start_lng) : null,
        end_lat: row.end_lat ? Number(row.end_lat) : null,
        end_lng: row.end_lng ? Number(row.end_lng) : null,
        current_lat: row.current_lat ? Number(row.current_lat) : null,
        current_lng: row.current_lng ? Number(row.current_lng) : null,
      } as any;
      setTracking(normalized);
      if (normalized.current_lat && normalized.current_lng) setCurrent({ lat: normalized.current_lat, lng: normalized.current_lng });
    } else {
      setTracking(null);
      setCurrent(null);
    }

    // Subscribe to realtime updates for this worker's tracking rows
    const channel = supabase
      .channel(`vt-${workerId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'vehicle_tracking', filter: `driver_id=eq.${workerId}` }, (payload) => {
        const row: any = payload.new;
        const normalized: TrackingRow = {
          ...row,
          start_lat: row.start_lat ? Number(row.start_lat) : null,
          start_lng: row.start_lng ? Number(row.start_lng) : null,
          end_lat: row.end_lat ? Number(row.end_lat) : null,
          end_lng: row.end_lng ? Number(row.end_lng) : null,
          current_lat: row.current_lat ? Number(row.current_lat) : null,
          current_lng: row.current_lng ? Number(row.current_lng) : null,
        } as any;
        setTracking(normalized);
        if (normalized.current_lat && normalized.current_lng) setCurrent({ lat: normalized.current_lat, lng: normalized.current_lng });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Minimal assigned tasks list for tracking
  const [assignedTasks, setAssignedTasks] = useState<TaskItem[]>([]);
  useEffect(() => {
    const fetchAssigned = async () => {
      const { data } = await supabase
        .from('tasks')
        .select('id,title,worker_id,status')
        .eq('status', 'assigned')
        .order('created_at', { ascending: false });
      setAssignedTasks((data || []) as TaskItem[]);
    };
    fetchAssigned();
  }, []);

  return (
    <DashboardLayout userType="committee">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Committee Control Panel</h1>
          <p className="opacity-90">Oversee operations, manage tasks, and coordinate waste management activities.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Bell className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingReports.length}</div>
              <Badge variant="secondary" className="mt-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                Queue
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{workers.length}</div>
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                Available
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Assigned</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{assignedTasks.length}</div>
              <Badge variant="secondary" className="mt-2">In Progress</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicles Tracking</CardTitle>
              <Truck className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">Live</div>
              <Badge className="mt-2 gradient-success text-white">Realtime</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Pending Reports to Assign */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingReports.map((r) => (
              <div key={r.id} className="border border-border rounded p-3">
                <h4 className="font-medium text-sm">{r.title}</h4>
                <p className="text-xs text-muted-foreground">{r.location_address || 'No address'}
                  {r.location_lat && r.location_lng ? ` — (${r.location_lat.toFixed(4)}, ${r.location_lng.toFixed(4)})` : ''}
                </p>
                <Button size="sm" className="w-full mt-2 gradient-primary" onClick={() => openAssign(r)}>
                  Assign Worker
                </Button>
              </div>
            ))}
            {pendingReports.length === 0 && (
              <div className="text-sm text-muted-foreground">No pending reports.</div>
            )}
          </CardContent>
        </Card>

        {/* Assigned - Track */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-accent" />
              Track Assigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedTasks.map((t) => (
              <div key={t.id} className="border border-border rounded p-3">
                <h4 className="font-medium text-sm">{t.title}</h4>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => t.worker_id && openTrackForWorker(t.worker_id)}>
                    Track Vehicle
                  </Button>
                </div>
              </div>
            ))}
            {assignedTasks.length === 0 && (
              <div className="text-sm text-muted-foreground">No assigned tasks yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Assign Dialog */}
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Assign Worker</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Report: {selectedReport?.title}</p>
              <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a worker" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((w) => (
                    <SelectItem key={w.user_id} value={w.user_id}>
                      {w.full_name || w.user_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button disabled={!selectedWorkerId || assigning} onClick={handleAssign} className="w-full gradient-primary">
                {assigning ? 'Assigning…' : 'Confirm Assign'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Track Dialog */}
        <Dialog open={trackOpen} onOpenChange={setTrackOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Live Vehicle Tracking</DialogTitle>
            </DialogHeader>
            {start && end ? (
              <RouteMap start={start} end={end} current={current} height={420} />
            ) : (
              <div className="text-sm text-muted-foreground">Waiting for the worker to start the route…</div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CommitteeDashboard;