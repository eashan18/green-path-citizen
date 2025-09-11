import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page after a brief moment
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center gradient-bg">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-6">
          <Leaf className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
          EcoManage
        </h1>
        <p className="text-xl text-muted-foreground">Smart Waste Management System</p>
        <div className="flex items-center justify-center mt-6">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
