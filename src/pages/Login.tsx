import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Users, HardHat, Building2, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import heroImage from "@/assets/hero-bg.jpg";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', fullName: '' });
  const [activeTab, setActiveTab] = useState('citizen');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, user, userRole } = useAuth();

  const userTypes = [
    {
      id: 'citizen',
      title: 'Citizen',
      description: 'Report waste, learn recycling, earn rewards',
      icon: Users,
      color: 'text-primary',
      route: '/citizen-dashboard'
    },
    {
      id: 'worker',
      title: 'Worker',
      description: 'Manage tasks, track progress, view assignments',
      icon: HardHat,
      color: 'text-accent',
      route: '/worker-dashboard'
    },
    {
      id: 'committee',
      title: 'Committee',
      description: 'Oversee operations, assign tasks, monitor progress',
      icon: Shield,
      color: 'text-success',
      route: '/committee-dashboard'
    },
    {
      id: 'ulb',
      title: 'ULB',
      description: 'Urban planning, policy updates, coordination',
      icon: Building2,
      color: 'text-warning',
      route: '/ulb-dashboard'
    }
  ];

  // Redirect if already logged in
  useEffect(() => {
    if (user && userRole) {
      const userType = userTypes.find(type => type.id === userRole);
      if (userType) {
        navigate(userType.route);
      }
    }
  }, [user, userRole, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) return;
    
    setLoading(true);
    
    if (isSignUp) {
      if (!credentials.fullName) {
        setLoading(false);
        return;
      }
      const { error } = await signUp(credentials.email, credentials.password, activeTab, credentials.fullName);
      if (!error) {
        setIsSignUp(false);
        setCredentials({ email: '', password: '', fullName: '' });
      }
    } else {
      const { error } = await signIn(credentials.email, credentials.password);
    }
    
    setLoading(false);
  };

  const currentUser = userTypes.find(type => type.id === activeTab);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero */}
        <div className="hidden lg:block">
          <img 
            src={heroImage} 
            alt="Waste Management System" 
            className="w-full h-[600px] object-cover rounded-2xl shadow-strong"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                EcoManage
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Smart Waste Management System
            </p>
          </div>

          <Card className="shadow-medium border-0">
            <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isSignUp ? 'Select your role and create account' : 'Select your role and login to continue'}
            </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  {userTypes.map((type) => (
                    <TabsTrigger 
                      key={type.id} 
                      value={type.id}
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <type.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{type.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {userTypes.map((type) => (
                  <TabsContent key={type.id} value={type.id} className="space-y-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <type.icon className={`h-8 w-8 ${type.color} mx-auto mb-2`} />
                      <h3 className="font-semibold">
                        {isSignUp ? `${type.title} Registration` : `${type.title} Login`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                      {isSignUp && (
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            placeholder="Enter your full name"
                            value={credentials.fullName}
                            onChange={(e) => setCredentials(prev => ({ ...prev, fullName: e.target.value }))}
                            required={isSignUp}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={`Enter your ${type.title.toLowerCase()} email`}
                          value={credentials.email}
                          onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={credentials.password}
                          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full gradient-primary hover:opacity-90 transition-opacity"
                        size="lg"
                      >
                        {loading ? 'Processing...' : `${isSignUp ? 'Create Account' : 'Login'} as ${type.title}`}
                      </Button>
                    </form>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-6 text-center text-sm">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setCredentials({ email: '', password: '', fullName: '' });
                  }}
                  className="text-primary hover:text-primary/80"
                >
                  {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;