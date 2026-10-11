import DashboardLayout from '../../components/shared/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, Banknote, Landmark, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function DriverWallet() {
  const transactionHistory = [
    { title: 'Trip Earnings - Route A (Morning)', date: 'Oct 15, 2023, 08:30 AM', amount: '+₹450', type: 'credit' },
    { title: 'Trip Earnings - Route A (Evening)', date: 'Oct 15, 2023, 05:00 PM', amount: '+₹450', type: 'credit' },
    { title: 'Fuel Advance Deduction', date: 'Oct 14, 2023, 10:00 AM', amount: '-₹500', type: 'debit' },
    { title: 'Weekly Bonus', date: 'Oct 10, 2023, 12:00 PM', amount: '+₹1,000', type: 'credit' },
  ];

  const withdrawalHistory = [
    { id: 'WD-84291', date: 'Oct 12, 2023', amount: '₹5,000', status: 'Completed', method: 'Bank Transfer' },
    { id: 'WD-81903', date: 'Oct 05, 2023', amount: '₹8,450', status: 'Completed', method: 'Bank Transfer' },
    { id: 'WD-79301', date: 'Sep 28, 2023', amount: '₹6,200', status: 'Completed', method: 'Bank Transfer' },
  ];
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          Driver Wallet
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your earnings, trip payouts, and bank transfers</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Balance Card */}
          <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-0 shadow-xl shadow-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet className="w-40 h-40" />
            </div>
            <CardContent className="p-8 relative z-10">
              <p className="text-emerald-100 mb-2 font-medium">Available Balance</p>
              <h2 className="text-5xl font-bold tracking-tight mb-6">₹12,450<span className="text-xl text-emerald-200">.00</span></h2>
              
              <div className="flex gap-4">
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-md h-12 px-6 font-semibold">
                  <Landmark className="w-5 h-5 mr-2" /> Withdraw to Bank
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions & Withdrawals */}
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader className="border-b border-gray-100 dark:border-dark-border/50 pb-4">
              <CardTitle className="text-lg">Ledger & History</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="transactions" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
                  <TabsTrigger value="transactions" className="rounded-lg text-sm font-semibold data-[state=active]:shadow-sm">Transaction History</TabsTrigger>
                  <TabsTrigger value="withdrawals" className="rounded-lg text-sm font-semibold data-[state=active]:shadow-sm">Withdrawal History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="transactions" className="mt-0 space-y-1">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {transactionHistory?.map((txn, i) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-dark-surface/50 transition-colors rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'credit' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                            {txn.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{txn.title}</p>
                            <p className="text-xs text-gray-500">{txn.date}</p>
                          </div>
                        </div>
                        <p className={`font-bold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-gray-900 dark:text-white'}`}>
                          {txn.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="withdrawals" className="mt-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {withdrawalHistory?.map((wd, i) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-dark-surface/50 transition-colors rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                            <Landmark className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{wd.id}</p>
                            <p className="text-xs text-gray-500">{wd.method} • {wd.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">{wd.amount}</p>
                          <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">{wd.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-gray-200/50 dark:border-dark-border/50">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Banknote className="w-5 h-5 text-primary-500" /> Earnings Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-surface/50">
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-primary-500" /> Monthly Earnings (Oct)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹18,450</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-surface/50">
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Banknote className="w-4 h-4 text-emerald-500" /> Today's Earnings</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">₹900</p>
              </div>
              <div className="p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10">
                <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-2 mb-1"><Clock className="w-4 h-4" /> Pending Payments</p>
                <p className="text-xl font-bold text-orange-700 dark:text-orange-500">₹2,400</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Landmark className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Bank Account Linked</h4>
              <p className="text-sm text-gray-500 mb-4">State Bank of India •••• 1234</p>
              <Button variant="outline" className="w-full">Manage Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
