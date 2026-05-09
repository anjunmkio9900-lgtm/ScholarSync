import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign,
  ArrowRight,
  Zap,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';

export default function Overview() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    spent: 0
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const q = query(collection(db, 'orders'), where('clientId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      let active = 0;
      let completed = 0;
      let spent = 0;

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (['pending', 'in-progress', 'revision'].includes(data.status)) active++;
        if (data.status === 'completed') completed++;
        if (data.paymentStatus === 'paid') spent += (data.totalPrice || 0);
      });

      setStats({
        total: snapshot.size,
        active,
        completed,
        spent
      });
    };

    fetchStats();
  }, [user]);

  return (
    <div className="space-y-8 min-h-0 flex flex-col">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">Welcome back, {profile?.displayName?.split(' ')[0]}</h1>
        <p className="text-slate-500 font-medium">Here's what's happening with your academic projects today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Active Orders</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.active.toString().padStart(2, '0')}</h3>
            <span className="text-[10px] text-emerald-600 font-bold px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> ON TRACK
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Balance</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">${stats.spent.toLocaleString()}</h3>
            <span className="text-[10px] text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded-full border border-blue-100 uppercase">Paid in full</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Completed</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.completed.toString().padStart(2, '0')}</h3>
            <div className="flex text-amber-400">
               {[1,2,3,4,5].map(i => <TrendingUp key={i} className="h-4 w-4 fill-current text-amber-500" />)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500 transition-all hover:shadow-md">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Next Deadline</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tighter">04h:12m</h3>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Main Body Row items can go here */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-lg">Ongoing Projects</h2>
              <Link to="/dashboard/orders" className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1 transition-all">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
           </div>
           
           <div className="flex-1 overflow-auto rounded-b-2xl">
              <div className="min-w-full inline-block align-middle">
                 <div className="border-t border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                       <thead className="bg-slate-50/80">
                          <tr>
                             <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project Title</th>
                             <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                             <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Price</th>
                          </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-slate-100">
                          {stats.total === 0 ? (
                             <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No orders found yet.</td>
                             </tr>
                          ) : (
                             /* Placeholder rows matching the theme style if no real data or just map them */
                             <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                <td className="px-6 py-5">
                                   <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Economic Analysis Draft</div>
                                   <div className="text-xs text-slate-400 italic">8 Pages • APA Style</div>
                                </td>
                                <td className="px-6 py-5">
                                   <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded shadow-sm uppercase">Researching</span>
                                </td>
                                <td className="px-6 py-5 text-right font-bold text-slate-900">$120.00</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>

        {/* Quick Actions Column */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <h2 className="font-bold text-slate-800 text-lg">Quick Actions</h2>
              <div className="space-y-3">
                 <Link to="/dashboard/new-order" className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-all group">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                       <Zap className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">New Order</p>
                       <p className="text-xs text-slate-500">Get an expert matching now</p>
                    </div>
                 </Link>
                 <Link to="/dashboard/messages" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all group">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                       <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">Live Chat</p>
                       <p className="text-xs text-slate-500">Talk to your writer team</p>
                    </div>
                 </Link>
              </div>
           </div>

           <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
              <div className="relative z-10 space-y-3">
                 <h3 className="text-lg font-bold">Premium Support</h3>
                 <p className="text-slate-400 text-sm">Need help with complex tasks or custom requirements?</p>
                 <Button className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold h-11 rounded-xl">Contact Experts</Button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/40 transition-all"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
