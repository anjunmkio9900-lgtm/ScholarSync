import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  MessageSquare, 
  Download, 
  Send, 
  Paperclip,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';

const statusColors: Record<string, string> = {
  'pending': 'bg-amber-100 text-amber-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'revision': 'bg-purple-100 text-purple-700',
  'completed': 'bg-green-100 text-green-700',
  'cancelled': 'bg-slate-100 text-slate-700',
};

export default function OrderDetails() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !user) return;

    // Fetch Order
    const orderRef = doc(db, 'orders', id);
    const unsubscribeOrder = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate('/dashboard/orders');
      }
      setLoading(false);
    });

    // Fetch Messages
    const messagesQuery = query(
      collection(db, 'orders', id, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => {
      unsubscribeOrder();
      unsubscribeMessages();
    };
  }, [id, user, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !id || !user) return;

    try {
      await addDoc(collection(db, 'orders', id, 'messages'), {
        senderId: user.uid,
        senderName: profile?.displayName || 'User',
        text: newMessage.trim(),
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${id}/messages`);
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  const deadline = order.deadline?.toDate();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard/orders">
            <Button variant="ghost" size="icon" className="h-12 w-12 border bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-all">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">PROJECT #{order.id.slice(-6).toUpperCase()}</h1>
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase shadow-sm ${statusColors[order.status]}`}>
                 {(order.status === 'in-progress' ? 'Writing' : order.status)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest">
              Created {format(order.createdAt?.toDate(), 'MMM dd, yyyy')} • Project active
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-xl font-bold border-slate-200">Request Revision</Button>
          <Button className="h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">Client Resources</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Info */}
          <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
               <CardTitle className="text-xl font-bold text-slate-800 uppercase tracking-tight">Project Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
               <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{order.title}</h3>
                  <div className="flex flex-wrap gap-5">
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                       <FileText className="h-4 w-4 text-blue-600" /> {order.serviceType}
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                       <Search className="h-4 w-4 text-blue-600" /> {order.subject}
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                       <Clock className="h-4 w-4 text-blue-600" /> {order.pageCount} Pages
                     </div>
                  </div>
               </div>
               <div className="p-8 rounded-2xl bg-slate-50/50 border border-slate-200">
                  <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed italic">"{order.instructions}"</p>
               </div>
            </CardContent>
          </Card>

          {/* Real-time Messages */}
          <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col h-[650px] bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 py-6 px-8 bg-slate-50/50">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">
                     SS
                  </div>
                  <div>
                     <CardTitle className="text-lg font-bold text-slate-900">Expert Collaboration</CardTitle>
                     <CardDescription className="text-xs font-medium text-slate-500 uppercase tracking-widest">Secure 256-bit Encrypted Channel</CardDescription>
                  </div>
               </div>
               <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest gap-2 py-1.5 border-slate-200 bg-white shadow-sm px-4 rounded-lg">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Verified Writer
               </Badge>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/10">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                   <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                      <MessageSquare className="h-8 w-8 text-slate-300" />
                   </div>
                   <p className="text-sm font-bold text-slate-400">Initiate project dialogue.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] rounded-2xl p-4 text-sm shadow-sm ${
                      msg.senderId === user.uid 
                        ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none font-medium'
                    }`}>
                      <div className="flex items-baseline gap-3 mb-1.5">
                         <span className={`font-black text-[9px] uppercase tracking-widest ${msg.senderId === user.uid ? 'text-white/80' : 'text-slate-400'}`}>{msg.senderName}</span>
                         <span className={`text-[9px] font-bold ${msg.senderId === user.uid ? 'text-white/60' : 'text-slate-300'}`}>
                            {msg.createdAt && format(msg.createdAt.toDate(), 'HH:mm')}
                         </span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </CardContent>

            <CardFooter className="p-6 border-t border-slate-100 bg-white">
               <form onSubmit={handleSendMessage} className="w-full flex items-center gap-4">
                  <Button variant="ghost" size="icon" type="button" className="text-slate-400 hover:text-blue-600 rounded-xl h-12 w-12 active:scale-90 transition-all">
                     <Paperclip className="h-6 w-6" />
                  </Button>
                  <div className="relative flex-1">
                    <Input 
                      placeholder="Discuss project requirements with your expert..." 
                      className="w-full bg-slate-50 border-slate-100 focus-visible:ring-blue-600 h-14 rounded-2xl px-6 font-medium text-slate-700"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="icon" disabled={!newMessage.trim()} className="h-14 w-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 active:scale-95 transition-all">
                     <Send className="h-6 w-6 text-white" />
                  </Button>
               </form>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Status Card */}
          <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
             <div className="h-2 bg-blue-600 w-full" />
             <CardHeader className="pt-8 text-center">
                <CardTitle className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">Project Vitality</CardTitle>
             </CardHeader>
             <CardContent className="space-y-10 pt-4 pb-10">
                <div className="flex flex-col items-center text-center">
                   <div className="h-20 w-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 shadow-sm rotate-3 transition-transform hover:rotate-0">
                      <Clock className="h-10 w-10" />
                   </div>
                   <div className="text-2xl font-black tracking-tight text-slate-900 mb-2 uppercase">
                      {order.status === 'completed' ? 'Package Ready' : 'In Production'}
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{formatDistanceToNow(deadline)} remaining</p>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-slate-100">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross Investment</span>
                      <span className="font-black text-2xl text-slate-900 font-mono">${order.totalPrice.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Status</span>
                      <Badge className={`rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-tighter ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                         {order.paymentStatus}
                      </Badge>
                   </div>
                </div>

                {order.paymentStatus === 'unpaid' && (
                  <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-600/30 active:scale-95 transition-all">
                    Finalize Payment
                  </Button>
                )}
             </CardContent>
          </Card>

          {/* Deliverables */}
          <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
             <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg font-bold text-slate-800 uppercase tracking-tight">Deliverables</CardTitle>
             </CardHeader>
             <CardContent className="pt-8 pb-10">
                {order.status === 'completed' ? (
                  <div className="space-y-4">
                     <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50/30 flex items-center justify-between group hover:bg-blue-50 transition-all cursor-pointer shadow-sm">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                              <FileText className="h-6 w-6" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Final_Project.pdf</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">12:30 PM • 3.4 MB</p>
                           </div>
                        </div>
                        <Button size="icon" variant="ghost" className="text-blue-600 hover:bg-white rounded-xl active:scale-90 h-10 w-10">
                           <Download className="h-5 w-5" />
                        </Button>
                     </div>
                     <p className="text-[10px] text-center font-bold text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-2 mt-4">
                       <ShieldCheck className="h-3 w-3" /> Plagiarism report included
                     </p>
                  </div>
                ) : (
                  <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-slate-200">
                     <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Clock className="h-8 w-8 text-slate-200 animate-pulse" />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Drafting in progress by verified expert</p>
                  </div>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
