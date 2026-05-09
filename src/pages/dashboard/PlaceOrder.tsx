import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calendar as CalendarIcon, 
  Clock, 
  Calculator, 
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';

const serviceTypes = [
  { value: 'essay', label: 'Custom Essay', price: 10 },
  { value: 'research', label: 'Research Paper', price: 12 },
  { value: 'thesis', label: 'Thesis/Dissertation', price: 15 },
  { value: 'technical', label: 'Technical Report', price: 14 },
  { value: 'code', label: 'Coding Project', price: 20 },
];

export default function PlaceOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [serviceType, setServiceType] = useState('essay');
  const [instructions, setInstructions] = useState('');
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [pages, setPages] = useState(1);
  const [hours, setHours] = useState(0);
  const [isUrgent, setIsUrgent] = useState(false);

  // Pricing State
  const [pricing, setPricing] = useState({
    base: 0,
    urgency: 0,
    service: 0,
    total: 0
  });

  useEffect(() => {
    const selectedService = serviceTypes.find(s => s.value === serviceType);
    const baseRate = selectedService?.price || 10;
    
    let basePrice = pages > 0 ? pages * baseRate : hours * (baseRate * 1.5);
    const urgencyFee = isUrgent ? basePrice * 0.3 : 0;
    const serviceFee = basePrice * 0.05; // 5% platform fee
    
    setPricing({
      base: basePrice,
      urgency: urgencyFee,
      service: serviceFee,
      total: basePrice + urgencyFee + serviceFee
    });
  }, [serviceType, pages, hours, isUrgent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const orderData = {
        clientId: user.uid,
        title,
        subject,
        serviceType,
        instructions,
        deadline: date,
        pageCount: pages,
        hours: hours,
        totalPrice: pricing.total,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      toast.success('Order created successfully!');
      navigate(`/dashboard/orders/${docRef.id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">New Order</h1>
        <p className="text-slate-500 font-medium">Configure your task parameters and get matched with a top-tier academic expert.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <form id="order-form" onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-800">Project Parameters</CardTitle>
                <CardDescription className="text-slate-500">Define the core scope of your assignment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-8">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-slate-400">Order Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Strategic Marketing Analysis of Apple Inc." 
                    className="h-12 border-slate-200 bg-white focus-visible:ring-blue-500 rounded-xl"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-slate-400">Subject Category</Label>
                    <Input 
                      id="subject" 
                      placeholder="e.g., Business or Psychology" 
                      className="h-12 border-slate-200 bg-white focus-visible:ring-blue-500 rounded-xl"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-xs font-bold uppercase tracking-widest text-slate-400">Service Model</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger id="service" className="h-12 border-slate-200 bg-white focus-visible:ring-blue-500 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {serviceTypes.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Technical Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-8">
                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-xs font-bold uppercase tracking-widest text-slate-400">Brief & Requirements</Label>
                  <Textarea 
                    id="instructions" 
                    placeholder="Explicitly define all requirements, formatting styles (APA, MLA, etc.), and specific data points to include." 
                    className="min-h-[220px] resize-none border-slate-200 bg-white focus-visible:ring-blue-500 rounded-xl p-4 leading-relaxed"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                  />
                </div>
                <div className="pt-2">
                   <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-4">Supporting Materials</Label>
                   <div className="border-2 border-dashed rounded-2xl p-10 text-center bg-slate-50/50 border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="flex flex-col items-center gap-3">
                         <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                            <Paperclip className="h-6 w-6 text-slate-400" />
                         </div>
                         <p className="text-sm font-bold text-slate-700">Attach project files or data source</p>
                         <p className="text-xs text-slate-400">Supported: PDF, DOCX, XLSX, ZIP (Max 25MB)</p>
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                  Timeline & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Deadline</Label>
                       <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-bold h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
                          >
                            <CalendarIcon className="mr-3 h-5 w-5 text-slate-400" />
                            {date ? format(date, "PPP") : <span>Set project deadline</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden border-none shadow-2xl" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="pages" className="text-xs font-bold uppercase tracking-widest text-slate-400">Project Scope (Pages)</Label>
                       <Input 
                        id="pages" 
                        type="number" 
                        min="1" 
                        max="200" 
                        className="h-12 border-slate-200 bg-white focus-visible:ring-blue-500 rounded-xl font-bold"
                        value={pages}
                        onChange={(e) => setPages(parseInt(e.target.value) || 0)}
                       />
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Approx. 2,200 words calculated</p>
                    </div>
                 </div>

                 <div className={`mt-10 p-6 rounded-2xl border transition-all ${isUrgent ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-start gap-4">
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${isUrgent ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                          <AlertCircle className="h-6 w-6" />
                       </div>
                       <div className="flex-1">
                          <p className={`text-sm font-bold leading-none mb-2 ${isUrgent ? 'text-orange-900' : 'text-slate-900'}`}>Priority Assignment</p>
                          <p className={`text-xs font-medium ${isUrgent ? 'text-orange-700' : 'text-slate-500'}`}>Urgent priority moves your project to the top of our expert queue for instant matching.</p>
                          <div className="mt-4">
                             <button 
                               type="button"
                               onClick={() => setIsUrgent(!isUrgent)}
                               className={`h-10 px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                 isUrgent 
                                   ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                                   : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                               }`}
                             >
                                {isUrgent ? 'Urgent Enabled' : 'Enable Urgent Priority'}
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-3xl sticky top-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 blur-3xl rounded-full" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Calculator className="h-6 w-6 text-blue-400" />
                Price Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
               <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Base Project Rate</span>
                    <span className="font-bold font-mono">${pricing.base.toFixed(2)}</span>
                  </div>
                  {isUrgent && (
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-orange-400">Urgency Multiplier (x1.3)</span>
                      <span className="font-bold text-orange-400 font-mono">+${pricing.urgency.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Platform Management</span>
                    <span className="font-bold font-mono">+${pricing.service.toFixed(2)}</span>
                  </div>
               </div>
               <div className="h-px bg-slate-800" />
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Gross Total</span>
                  <span className="text-5xl font-black tracking-tighter text-white">${pricing.total.toFixed(2)}</span>
               </div>
               
               <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 100% Satisfaction Guarantee
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Encrypted Stripe Checkout
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Direct Writer Messaging
                  </div>
               </div>
            </CardContent>
            <CardFooter className="pt-6 relative z-10">
              <Button 
                form="order-form" 
                type="submit"
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-2xl shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
                disabled={loading || !title}
              >
                {loading ? 'Processing...' : 'Confirm & Pay'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-sm">
             <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-7 w-7 text-slate-300" />
             </div>
             <p className="font-bold text-slate-900 mb-2">Academic Standards</p>
             <p className="text-sm text-slate-400 leading-relaxed font-medium">All our experts follow strict citation guidelines for APA, MLA, Harvard, and Chicago.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
