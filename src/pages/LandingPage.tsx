import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight,
  GraduationCap,
  PenTool,
  Search,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">S</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Scholar<span className="text-blue-600 font-light">Sync</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <a href="#services" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Services</a>
            <a href="#how-it-works" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Process</a>
            <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-600 font-bold hover:text-blue-600">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold h-11 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-36 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold mb-8 border border-blue-100 uppercase tracking-widest shadow-sm">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>The Trusted Academic Partner</span>
                </div>
                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 mb-8 uppercase">
                  Academic <br />
                  Excellence <br />
                  <span className="text-blue-600 italic font-light lowercase">defined.</span>
                </h1>
                <p className="text-xl text-slate-500 mb-12 max-w-lg leading-relaxed font-medium">
                  Direct connection with elite academic experts. Secure, transparent, and built for modern scholars.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link to="/signup">
                    <Button className="h-16 px-10 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                      Place New Order <ArrowRight className="h-6 w-6" />
                    </Button>
                  </Link>
                  <Link to="/signup?mode=writer">
                    <Button variant="outline" className="h-16 px-10 text-lg font-bold rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all">
                      Join as Writer
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block relative"
              >
                <div className="relative z-10 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-8">
                   <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                            <FileText className="text-blue-600 h-6 w-6" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-lg">Project #8842</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Case Study • Writing</p>
                         </div>
                      </div>
                      <div className="px-4 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100 font-mono">
                         04:12:22
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-600 w-[72%] transition-all duration-1000" />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                         <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Assigned Expert</p>
                            <p className="font-bold text-slate-900">Dr. Sterling</p>
                         </div>
                         <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Current Stage</p>
                            <p className="font-bold text-slate-900">Data analysis</p>
                         </div>
                      </div>
                   </div>
                   <div className="mt-10 pt-8 border-t border-slate-100">
                      <div className="flex gap-4 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 grayscale">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Expert" alt="Expert" />
                        </div>
                        <div className="bg-slate-100 px-5 py-3 rounded-2xl rounded-tl-none text-sm font-medium text-slate-700">
                          Just updated the methodology section. Please review.
                        </div>
                      </div>
                      <div className="flex gap-4 justify-end">
                        <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-none text-sm font-bold shadow-lg shadow-blue-600/10">
                          Perfect, looking for the charts next.
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs uppercase">
                          Me
                        </div>
                      </div>
                   </div>
                </div>
                {/* Visual accents */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent)] -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 underline-offset-8">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose ScholarSync?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We combine human expertise with a streamlined machine-assisted workflow to deliver the best results.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Top 1% Writers', desc: 'Rigorous vetting ensure only PhD and Expert writers handle your work.', icon: PenTool },
                { title: 'Zero Plagiarism', desc: 'Every order includes a free similarity report to guarantee originality.', icon: ShieldCheck },
                { title: 'Always on Time', desc: 'Advanced deadline tracking system with real-time countdown alerts.', icon: Clock },
                { title: '24/7 Live Chat', desc: 'Direct secure messaging between you and your dedicated writer.', icon: MessageSquare },
              ].map((feature, i) => (
                <Card key={i} className="border-none shadow-none bg-transparent">
                  <CardContent className="pt-6 px-0">
                    <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold tracking-tight mb-4 uppercase">Our Expertise</h2>
                <p className="text-muted-foreground">From academic papers to complex technical implementations, we cover it all.</p>
              </div>
              <Link to="/signup">
                <Button variant="link" className="p-0 text-primary h-auto text-lg gap-2">
                  View all services <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'Research Papers', 'Custom Essays', 'Thesis & Dissertations',
                'Technical Reports', 'Case Studies', 'Literature Reviews',
                'Code Reviews', 'UX/UI Analysis', 'Business Proposals'
              ].map((service, i) => (
                <div key={i} className="group p-6 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-bold">{service}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Starting from $10/page</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                No hidden fees. Pay only for what you need with our flexible pricing models.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  name: 'Standard', 
                  price: '10', 
                  unit: 'per page', 
                  features: ['PhD & Expert Writers', 'Free Plagiarism Report', 'Standard 3-Day Delivery', '24/7 Chat Support'] 
                },
                { 
                  name: 'Urgent', 
                  price: '15', 
                  unit: 'per page', 
                  features: ['Priority Assignment', 'Express 24h Delivery', 'Direct Writer Messaging', 'Unlimited Revisions'],
                  popular: true 
                },
                { 
                  name: 'Technical', 
                  price: '20', 
                  unit: 'per hour', 
                  features: ['Coding & Design Tasks', 'Code Review Sessions', 'Architecture Planning', 'Technical Documentation'] 
                }
              ].map((tier, i) => (
                <Card key={i} className={`relative overflow-hidden border-none shadow-lg ${tier.popular ? 'ring-2 ring-primary bg-card' : 'bg-card'}`}>
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 uppercase tracking-tighter rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold tracking-tight">${tier.price}</span>
                      <span className="ml-1 text-sm font-medium text-muted-foreground">/{tier.unit}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/signup" className="w-full">
                      <Button className="w-full h-11 font-bold" variant={tier.popular ? 'default' : 'outline'}>
                        Get Started
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center p-6 border border-dashed rounded-2xl bg-background">
               <p className="text-sm text-muted-foreground">
                 Pricing may vary based on task complexity and specific deadlines. 
                 <Link to="/signup" className="text-primary font-bold hover:underline ml-1">Get an instant quote →</Link>
               </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {[
                { q: "How do I communicate with my writer?", a: "Once your order is active, you'll have access to a real-time secure chat in your dashboard to talk directly with your assigned expert." },
                { q: "Is the work plagiarism-free?", a: "Absolutely. We run every document through advanced similarity detection tools and provide a free report with every completed order." },
                { q: "What if I'm not satisfied with the result?", a: "We offer unlimited free revisions until you're completely satisfied with the quality of the work." },
                { q: "How do I pay for my order?", a: "We use Stripe for secure payments. You can pay using any major credit card or digital wallet." }
              ].map((faq, i) => (
                <div key={i} className="space-y-2">
                   <h3 className="text-lg font-bold">{faq.q}</h3>
                   <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-muted rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Ready to reach your academic goals?</h2>
                 <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                   Join thousands of students who trust ScholarSync for their most important tasks.
                 </p>
                 <Link to="/signup">
                   <Button size="lg" className="h-16 px-12 text-xl rounded-full">
                     Place Your First Order Now
                   </Button>
                 </Link>
                 <p className="mt-8 text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
                   <CheckCircle className="h-4 w-4 text-green-500" /> No hidden fees • Cancel anytime
                 </p>
               </div>
               {/* Background accents */}
               <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold tracking-tight">ScholarSync</span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                The world's leading academic writing marketplace, connecting students with certified experts for professional writing and technical tasks.
              </p>
              <div className="flex gap-4">
                 <div className="h-10 w-10 rounded-full border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                 </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="hover:text-primary cursor-pointer">Research Paper</li>
                <li className="hover:text-primary cursor-pointer">Custom Essay</li>
                <li className="hover:text-primary cursor-pointer">Dissertation</li>
                <li className="hover:text-primary cursor-pointer">Term Paper</li>
                <li className="hover:text-primary cursor-pointer">Coding Projects</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="hover:text-primary cursor-pointer">About Us</li>
                <li className="hover:text-primary cursor-pointer">Become a Writer</li>
                <li className="hover:text-primary cursor-pointer">Success Stories</li>
                <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
                <li className="hover:text-primary cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ScholarSync. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> System Operational</span>
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
