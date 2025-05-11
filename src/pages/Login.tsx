
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crm-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-md bg-crm-blue flex items-center justify-center text-white font-bold mr-2">
                  X
                </div>
                XenoCRM Platform
              </div>
            </CardTitle>
            <CardDescription className="pt-2">
              Sign in to manage your campaigns and customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 mr-2"
                >
                  <path 
                    fill="currentColor" 
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Sign in with Google
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleGoogleLogin}>
                Continue as Demo User
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500">
            <p className="w-full">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            2025 SDE Internship Assignment at Xeno
          </p>
          <p className="mt-1">
            This is a demo application. No real emails will be sent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
