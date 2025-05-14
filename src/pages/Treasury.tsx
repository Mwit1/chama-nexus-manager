
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Wallet, PiggyBank, CreditCard, Calendar } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const Treasury: React.FC = () => {
  // Mock data for treasury insights
  const monthlyData = [
    { name: 'Jan', contributions: 3500, loans: 2000, repayments: 1800 },
    { name: 'Feb', contributions: 4200, loans: 3000, repayments: 2200 },
    { name: 'Mar', contributions: 3800, loans: 2500, repayments: 2600 },
    { name: 'Apr', contributions: 5000, loans: 3500, repayments: 3000 },
    { name: 'May', contributions: 4700, loans: 2800, repayments: 3200 },
  ];
  
  // Mock data for recent transactions
  const recentTransactions = [
    { id: 1, type: 'Contribution', member: 'John Doe', amount: '$500', date: '12 May 2023', status: 'Completed' },
    { id: 2, type: 'Loan Disbursement', member: 'Jane Smith', amount: '-$2,000', date: '10 May 2023', status: 'Completed' },
    { id: 3, type: 'Loan Repayment', member: 'Michael Johnson', amount: '$350', date: '09 May 2023', status: 'Completed' },
    { id: 4, type: 'Withdrawal', member: 'Group Expense', amount: '-$200', date: '07 May 2023', status: 'Completed' },
    { id: 5, type: 'Contribution', member: 'Sara Williams', amount: '$500', date: '05 May 2023', status: 'Completed' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Treasury Overview</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fund</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,500</div>
              <p className="text-xs text-muted-foreground mt-1">
                +20% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$35,200</div>
              <div className="flex items-center pt-1">
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">$4,700 this month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$10,700</div>
              <p className="text-xs text-muted-foreground mt-1">
                3 active loans
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Meeting</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">May 28</div>
              <p className="text-xs text-muted-foreground mt-1">
                Sunday, 2:00 PM
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>Financial activity over the past 5 months</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="contributions" fill="#8884d8" name="Contributions" />
                  <Bar dataKey="loans" fill="#82ca9d" name="Loans" />
                  <Bar dataKey="repayments" fill="#ffc658" name="Repayments" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Fund Growth</CardTitle>
              <CardDescription>Chama fund growth over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="contributions" 
                    stroke="#8884d8" 
                    name="Fund Value"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities in the group</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.type}</TableCell>
                    <TableCell>{transaction.member}</TableCell>
                    <TableCell className={transaction.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                      {transaction.amount}
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            Download Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            Set Savings Goal
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Request Withdrawal
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Treasury;
