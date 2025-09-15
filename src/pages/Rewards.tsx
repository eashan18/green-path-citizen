import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Gift, Star, Trophy, Coins, ShoppingBag } from 'lucide-react';

const Rewards = () => {
  const userPoints = {
    total: 2450,
    thisMonth: 320,
    level: 'Gold',
    nextLevel: 'Platinum',
    pointsToNext: 550
  };

  const achievements = [
    { name: 'Eco Warrior', description: 'Reported 50+ waste issues', earned: true, points: 500 },
    { name: 'Green Guardian', description: 'Consistent reporter for 3 months', earned: true, points: 300 },
    { name: 'Community Hero', description: 'Help clean 10 locations', earned: false, points: 750 },
    { name: 'Recycling Master', description: 'Properly segregate waste 100 times', earned: false, points: 400 },
  ];

  const rewards = [
    { name: 'Amazon Gift Card', points: 1000, type: 'voucher', available: true },
    { name: 'Plant Sapling Kit', points: 200, type: 'physical', available: true },
    { name: 'Eco-friendly Bag', points: 300, type: 'physical', available: true },
    { name: 'Movie Ticket', points: 800, type: 'voucher', available: false },
    { name: 'Municipal Tax Discount', points: 1500, type: 'service', available: true },
    { name: 'Composting Kit', points: 400, type: 'physical', available: true },
  ];

  const recentActivity = [
    { date: '2024-01-20', action: 'Waste Report Submitted', points: 50 },
    { date: '2024-01-19', action: 'Location Cleaned', points: 100 },
    { date: '2024-01-18', action: 'Achievement Unlocked', points: 300 },
    { date: '2024-01-17', action: 'Weekly Challenge Complete', points: 75 },
  ];

  return (
    <DashboardLayout userType="citizen">
      <div className="space-y-6">
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Rewards & Points</h1>
          <p className="opacity-90">Earn points for your environmental contributions and redeem exciting rewards.</p>
        </div>

        {/* Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Coins className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{userPoints.total}</div>
              <Badge className="mt-2 gradient-primary text-white">All Time</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Star className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+{userPoints.thisMonth}</div>
              <Badge className="mt-2 gradient-success text-white">Earned</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Trophy className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{userPoints.level}</div>
              <Badge variant="secondary" className="mt-2">Member</Badge>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Level</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{userPoints.nextLevel}</div>
              <div className="mt-2 space-y-1">
                <Progress value={(userPoints.total / (userPoints.total + userPoints.pointsToNext)) * 100} />
                <p className="text-xs text-muted-foreground">{userPoints.pointsToNext} points to go</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Rewards */}
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Available Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rewards.map((reward, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{reward.name}</h4>
                    <Badge variant={reward.available ? 'default' : 'secondary'}>
                      {reward.points} pts
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {reward.type}
                    </Badge>
                    <Button 
                      size="sm" 
                      disabled={!reward.available || userPoints.total < reward.points}
                      className={reward.available && userPoints.total >= reward.points ? 'gradient-primary' : ''}
                    >
                      {userPoints.total >= reward.points ? 'Redeem' : 'Not Enough Points'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`border rounded-lg p-4 ${achievement.earned ? 'border-success bg-success/10' : 'border-border'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      {achievement.earned && <Trophy className="h-4 w-4 text-success" />}
                      {achievement.name}
                    </h4>
                    <Badge 
                      variant={achievement.earned ? 'default' : 'secondary'}
                      className={achievement.earned ? 'gradient-success text-white' : ''}
                    >
                      {achievement.points} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.earned && (
                    <Badge variant="outline" className="mt-2 text-success border-success">
                      ✓ Completed
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                  <Badge className="gradient-success text-white">
                    +{activity.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Earn More Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="gradient-primary">
                Report Waste Issue (+50 pts)
              </Button>
              <Button variant="outline">
                Complete Weekly Challenge (+100 pts)
              </Button>
              <Button variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Reward Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Rewards;