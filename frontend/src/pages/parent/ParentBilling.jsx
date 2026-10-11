import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CreditCard, Download, ExternalLink, Receipt, CheckCircle2, History, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function ParentBilling() {
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = () => {
    setPaymentProcessing(true);
    // Simulate Razorpay/Stripe network delay
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      setIsPaid(true);
    }, 2500);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          Billing & Payments
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your transportation subscriptions and invoices</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader className="border-b border-gray-100 dark:border-dark-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="w-5 h-5" /> Current Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹2,450</h3>
                  <p className="text-sm text-gray-500">October 2023 Smart Invoice</p>
                </div>
                <div className={cn("px-3 py-1 rounded-full text-sm font-semibold border", isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400")}>
                  {isPaid ? "Paid Successfully" : "Due in 5 Days"}
                </div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base Fare (2 Children x 30 Days)</span>
                  <span className="font-medium">₹3,000</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                  <span>Completed Trips (44 one-way)</span>
                  <span className="font-medium">Included</span>
                </div>
                <div className="flex justify-between text-sm text-orange-600 dark:text-orange-400">
                  <span>Child Absent (2 Days) - Auto Deduct</span>
                  <span className="font-medium">-₹200</span>
                </div>
                <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                  <span>School Holidays (3 Days) - Auto Deduct</span>
                  <span className="font-medium">-₹300</span>
                </div>
                <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                  <span>Cancelled Trips (1 Day) - Auto Deduct</span>
                  <span className="font-medium">-₹50</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-gray-100 dark:border-gray-800 pt-3">
                  <span>Final Smart Amount</span>
                  <span className="text-primary-600 dark:text-primary-400 text-lg">₹2,450</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  className={cn("flex-1 h-11 text-base", isPaid ? "bg-gray-100 text-gray-500 hover:bg-gray-100 cursor-not-allowed" : "shadow-glow-blue")} 
                  disabled={isPaid}
                  onClick={() => setShowPaymentModal(true)}
                >
                  <CreditCard className="w-4 h-4 mr-2" /> {isPaid ? "Paid" : "Pay Now"}
                </Button>
                <Button variant="outline" className="h-11 px-4">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5" /> Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isPaid && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 mb-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-900 dark:text-emerald-400">October 2023</p>
                        <p className="text-xs text-emerald-600/70">Paid on {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-900 dark:text-emerald-400">₹2,450</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-emerald-600">Receipt</Button>
                    </div>
                  </div>
                )}
                {[
                  { month: 'September 2023', amount: '₹2,450', date: 'Sep 02, 2023', status: 'PAID' },
                  { month: 'August 2023', amount: '₹2,450', date: 'Aug 04, 2023', status: 'PAID' },
                  { month: 'July 2023', amount: '₹2,450', date: 'Jul 01, 2023', status: 'PAID' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{item.month}</p>
                        <p className="text-xs text-gray-500">Paid on {item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{item.amount}</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-primary-600">Receipt</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-primary-500 to-indigo-600 text-white border-0 shadow-lg shadow-primary-500/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Auto-Pay is Disabled</h3>
              <p className="text-primary-100 text-sm mb-6">Enable auto-pay to never miss a payment and avoid late fees.</p>
              <Button className="w-full bg-white text-primary-600 hover:bg-gray-50">
                Setup Auto-Pay
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need help with billing?</h3>
              <p className="text-sm text-gray-500 mb-4">Contact our support team or your school administrator.</p>
              <Button variant="outline" className="w-full">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mock Payment Gateway Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#09090b] rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-dark-border relative overflow-hidden"
            >
              {!paymentSuccess && !paymentProcessing && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full" onClick={closePaymentModal}>
                  <X className="w-5 h-5 text-gray-500" />
                </Button>
              )}
              
              {!paymentSuccess && (
                <>
                  <div className="text-center mb-6 pt-4">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Secure Checkout</h2>
                    <p className="text-sm text-gray-500 mt-1">Powered by RideNest Pay</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border/50 mb-6 flex justify-between items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Amount to Pay</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">₹2,450</span>
                  </div>

                  <Button 
                    className="w-full h-12 text-base shadow-glow-blue bg-blue-600 hover:bg-blue-700 text-white relative"
                    onClick={handlePayment}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Payment...
                      </>
                    ) : (
                      "Pay via UPI / Card"
                    )}
                  </Button>
                </>
              )}

              {paymentSuccess && (
                <div className="text-center py-8">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-[#09090b] shadow-lg"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                  <p className="text-sm text-gray-500 mb-6">Your transaction ID is TXN{Math.floor(Math.random() * 100000000)}.</p>
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow-emerald" onClick={closePaymentModal}>
                    Return to Dashboard
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
