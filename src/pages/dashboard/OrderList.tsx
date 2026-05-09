import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MoreVertical, 
  ArrowUpRight,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { formatDistanceToNow, isPast } from 'date-fns';

interface Order {
  id: string;
  title: string;
  status: string;
  deadline: any;
  totalPrice: number;
  serviceType: string;
}

const statusColors: Record<string, string> = {
  'pending': 'bg-amber-100 text-amber-700 border-amber-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'revision': 'bg-purple-100 text-purple-700 border-purple-200',
  'completed': 'bg-green-100 text-green-700 border-green-200',
  'cancelled': 'bg-slate-100 text-slate-700 border-slate-200',
};

const CountdownTimer = ({ deadline }: { deadline: any }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    if (!deadline) return;
    
    const update = () => {
      const date = deadline instanceof Timestamp ? deadline.toDate() : new Date(deadline);
      if (isPast(date)) {
        setTimeLeft('Overdue');
      } else {
        setTimeLeft(formatDistanceToNow(date, { addSuffix: false }) + ' remaining');
      }
    };
    
    update();
    const interval = setInterval(update, 1000 * 60); // Update every minute
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
      <Clock className="h-3 w-3" />
      {timeLeft}
    </div>
  );
};

export default function OrderList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'all' || order.status === filter;
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
          <p className="text-sm text-muted-foreground">Manage and track your active and past academic orders.</p>
        </div>
        <Link to="/dashboard/new-order">
          <Button className="gap-2">
            <ArrowUpRight className="h-4 w-4" /> Place New Order
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
          <TabsList className="bg-muted/50 border border-border/50">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or ID..." 
            className="pl-10 h-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <div className="bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent border-slate-200">
                <TableHead className="w-[120px] pl-8 font-bold uppercase tracking-widest text-[10px] text-slate-500 py-5">Order ID</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] text-slate-500 py-5">Project Details</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] text-slate-500 py-5">Status</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] text-slate-500 py-5">Deadline</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] text-slate-500 py-5 text-right pr-8">Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 border-none">
              {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                       <TableCell className="pl-8 py-6"><div className="h-4 w-16 bg-slate-100 animate-pulse rounded" /></TableCell>
                       <TableCell className="py-6"><div className="h-4 w-48 bg-slate-100 animate-pulse rounded" /></TableCell>
                       <TableCell className="py-6"><div className="h-4 w-20 bg-slate-100 animate-pulse rounded" /></TableCell>
                       <TableCell className="py-6"><div className="h-4 w-24 bg-slate-100 animate-pulse rounded" /></TableCell>
                       <TableCell className="pr-8 py-6 text-right"><div className="h-4 w-12 bg-slate-100 animate-pulse rounded ml-auto" /></TableCell>
                    </TableRow>
                 ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer group hover:bg-slate-50 transition-colors border-none" onClick={() => navigate(`/dashboard/orders/${order.id}`)}>
                    <TableCell className="font-mono text-xs text-slate-400 pl-8 py-6">
                      #{order.id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-xs">{order.title}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">{order.serviceType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase shadow-sm ${statusColors[order.status]}`}>
                        {(order.status === 'in-progress' ? 'Writing' : order.status)}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 font-mono text-xs text-slate-500">
                      <CountdownTimer deadline={order.deadline} />
                    </TableCell>
                    <TableCell className="text-right pr-8 py-6 font-bold text-slate-900">
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-2 border border-slate-100">
                        <FileText className="h-8 w-8 text-slate-300" />
                      </div>
                      <p className="text-lg font-bold text-slate-900">No projects found</p>
                      <p className="text-sm text-slate-400 mb-6">Start your academic journey by placing your first order.</p>
                      <Link to="/dashboard/new-order">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-blue-600/20 font-bold transition-all active:scale-95">
                          Create New Project
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
