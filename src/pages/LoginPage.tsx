import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, ArrowLeft, Mail, Lock, User, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

interface LoginPageProps {
  isSignUp?: boolean;
}

export default function LoginPage({ isSignUp: initialIsSignUp = false }: LoginPageProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [isSignUp, setIsSignUp] = React.useState(initialIsSignUp || params.get('mode') === 'writer');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGoogleSignIn();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn();
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 blur-[100px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/50 blur-[100px] rounded-full -ml-48 -mb-48" />

      <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Core
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-600/30 mb-6">
             S
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Scholar<span className="text-blue-600 font-light lowercase italic">Sync</span></h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Executive Portal</p>
        </div>

        <Card className="border-slate-200 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="h-2 bg-blue-600 w-full" />
          <CardHeader className="space-y-4 text-center pt-10 pb-8">
            <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">{isSignUp ? 'New Account' : 'Welcome'}</CardTitle>
            <CardDescription className="text-slate-500 font-medium px-6">
              {isSignUp ? 'Initiate your professional academic partnership.' : 'Access your secure project environment.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-10 pb-10">
            <Button 
               // @ts-ignore
               variant="outline" 
               className="w-full gap-4 h-14 text-sm font-black border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest" 
               onClick={handleGoogleSignIn} 
               disabled={isLoading}
            >
                <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Google Authentication
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em]">
                <span className="bg-white px-4 text-slate-300">Sandbox Environment</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest leading-relaxed">
               Note: System restricted to Google enterprise authentication for secure onboarding during beta.
            </p>
          </CardContent>
          <CardFooter className="bg-slate-50/50 py-8 border-t border-slate-100">
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 text-center w-full">
              {isSignUp ? 'Member already?' : 'Require access?'}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isSignUp ? 'Login core' : 'Register partnership'}
              </button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-12 text-center">
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
             © ScholarSync Corporation • 2026
           </p>
        </div>
      </motion.div>
    </div>
  );
}
