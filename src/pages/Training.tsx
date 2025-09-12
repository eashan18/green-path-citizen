import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PlayCircle, CheckCircle, Award, BookOpen, Clock } from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  points: number;
  completed?: boolean;
}

const trainingModules: TrainingModule[] = [
  {
    id: 'waste-basics',
    title: 'Waste Management Basics',
    description: 'Learn the fundamentals of waste segregation and management',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '8 min',
    points: 50
  },
  {
    id: 'recycling-guide',
    title: 'Complete Recycling Guide',
    description: 'Understand different types of recyclable materials and processes',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '12 min',
    points: 75
  },
  {
    id: 'composting-basics',
    title: 'Home Composting Methods',
    description: 'Start composting at home to reduce organic waste',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '10 min',
    points: 60
  },
  {
    id: 'hazardous-waste',
    title: 'Hazardous Waste Handling',
    description: 'Safe disposal methods for dangerous materials',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15 min',
    points: 100
  },
  {
    id: 'community-action',
    title: 'Community Environmental Action',
    description: 'How to organize and participate in community cleanup drives',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '20 min',
    points: 120
  }
];

const Training = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('training_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching progress:', error);
      return;
    }

    setProgress(data || []);
    
    // Calculate total points from incentives
    const { data: incentivesData } = await supabase
      .from('incentives')
      .select('points')
      .eq('user_id', user.id)
      .eq('type', 'training');

    const points = incentivesData?.reduce((sum, item) => sum + item.points, 0) || 0;
    setTotalPoints(points);
  };

  const isModuleCompleted = (moduleId: string) => {
    return progress.some(p => p.video_id === moduleId && p.completed);
  };

  const completeModule = async (module: TrainingModule) => {
    if (!user) return;

    try {
      // Mark module as completed
      const { error: progressError } = await supabase
        .from('training_progress')
        .upsert([
          {
            user_id: user.id,
            video_id: module.id,
            video_title: module.title,
            completed: true,
            completed_at: new Date().toISOString()
          }
        ]);

      if (progressError) throw progressError;

      // Add points incentive
      const { error: incentiveError } = await supabase
        .from('incentives')
        .insert([
          {
            user_id: user.id,
            type: 'training',
            points: module.points,
            reason: `Completed training: ${module.title}`
          }
        ]);

      if (incentiveError) throw incentiveError;

      toast({
        title: "Module Completed!",
        description: `You earned ${module.points} points for completing "${module.title}"`,
      });

      fetchProgress();
      setSelectedModule(null);
    } catch (error) {
      console.error('Error completing module:', error);
      toast({
        title: "Error",
        description: "Failed to mark module as completed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const completedCount = trainingModules.filter(module => isModuleCompleted(module.id)).length;
  const progressPercentage = (completedCount / trainingModules.length) * 100;

  return (
    <DashboardLayout userType="citizen">
      <div className="space-y-6">
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Training Center</h1>
          <p className="opacity-90">
            Complete training modules to learn about waste management and earn points.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary mb-2">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                {completedCount} of {trainingModules.length} modules completed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              <Award className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{totalPoints}</div>
              <Badge variant="secondary" className="mt-2">
                From Training
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
              <Clock className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{completedCount * 12}</div>
              <p className="text-xs text-muted-foreground">Minutes learned</p>
            </CardContent>
          </Card>
        </div>

        {/* Training Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trainingModules.map((module) => {
            const completed = isModuleCompleted(module.id);
            return (
              <Card key={module.id} className="shadow-medium border-0">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    </div>
                    {completed && (
                      <CheckCircle className="h-5 w-5 text-success mt-1" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {module.duration}
                    </div>
                    <Badge className="gradient-primary text-white">
                      <Award className="h-3 w-3 mr-1" />
                      {module.points} pts
                    </Badge>
                  </div>

                  {completed ? (
                    <Button variant="outline" className="w-full" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                  ) : (
                    <Button 
                      className="w-full gradient-primary"
                      onClick={() => setSelectedModule(module)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Module
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Video Modal */}
        {selectedModule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
              <CardHeader>
                <CardTitle>{selectedModule.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <iframe
                    src={selectedModule.video_url}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
                <p className="text-muted-foreground">{selectedModule.description}</p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedModule(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => completeModule(selectedModule)}
                    className="flex-1 gradient-primary"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Complete & Earn {selectedModule.points} Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Training;