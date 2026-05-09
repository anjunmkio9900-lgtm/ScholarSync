import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/AuthContext';

// Sub-pages
import OrderList from './dashboard/OrderList';
import PlaceOrder from './dashboard/PlaceOrder';
import OrderDetails from './dashboard/OrderDetails';
import Overview from './dashboard/Overview';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: PlusCircle, label: 'Place New Order', path: '/dashboard/new-order' },
  { icon: FileText, label: 'My Orders', path: '/dashboard/orders' },
  { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
  { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function Dashboard() {
  const { user, profile, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium animate-pulse">Syncing your workspace...</p>
      </div>
    </div>
  );

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-400">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">S</div>
          <span className="text-xl font-bold tracking-tight text-white group">
            Scholar<span className="text-blue-400 font-light group-hover:text-blue-300 transition-colors">Sync</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = item.path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-500 rounded-l-none'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                {item.label}
                {item.label === 'Messages' && (
                   <span className="ml-auto bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">4</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-6">
           <Avatar className="h-10 w-10 border-2 border-slate-700 bg-slate-800">
              <AvatarImage src={profile?.photoURL} />
              <AvatarFallback className="bg-slate-700 text-white">{profile?.displayName?.[0] || 'U'}</AvatarFallback>
           </Avatar>
           <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{profile?.displayName}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">ID: {user?.uid.slice(-4)}</p>
           </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-slate-500 hover:text-red-400 hover:bg-slate-800/50 transition-colors"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-6">
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                   <Button variant="ghost" size="icon" className="lg:hidden text-slate-600">
                      <Menu className="h-5 w-5" />
                   </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 border-none">
                   <NavContent />
                </SheetContent>
             </Sheet>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden md:block">
                {sidebarItems.find(i => (i.path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(i.path)))?.label || 'Dashboard'}
             </h1>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex relative group max-w-sm">
                <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input 
                   placeholder="Search orders, tickets, writers..." 
                   className="pl-12 h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 w-80 transition-all text-sm" 
                />
             </div>

             <div className="relative group">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-slate-100 rounded-xl">
                   <Bell className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                   <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
                </Button>
             </div>
             
             <Button 
                className="hidden xl:flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all h-10 shadow-lg shadow-blue-600/20 active:scale-95"
                onClick={() => navigate('/dashboard/new-order')}
             >
                + New Order
             </Button>
          </div>
        </header>

        {/* Dashboard Router */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth bg-slate-50">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="new-order" element={<PlaceOrder />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
