
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CreditCard, Search } from "lucide-react";

const Loans: React.FC = () => {
  // Mock data for loans
  const loans = [
    { id: 1, member: 'John Doe', amount: '$2,000', interestRate: '10%', issued: '10 Apr 2023', dueDate: '10 Jul 2023', status: 'Active', balance: '$1,500' },
    { id: 2, member: 'Jane Smith', amount: '$1,500', interestRate: '12%', issued: '15 Apr 2023', dueDate: '15 Jun 2023', status: 'Active', balance: '$1,000' },
    { id: 3, member: 'Michael Johnson', amount: '$3,000', interestRate: '8%', issued: '20 Mar 2023', dueDate: '20 Jun 2023', status: 'Active', balance: '$1,800' },
    { id: 4, member: 'Sara Williams', amount: '$1,000', interestRate: '15%', issued: '05 Feb 2023', dueDate: '05 May 2023', status: 'Overdue', balance: '$400' },
    { id: 5, member: 'Robert Brown', amount: '$2,500', interestRate: '10%', issued: '01 Jan 2023', dueDate: '01 Apr 2023', status: 'Repaid', balance: '$0' },
  ];

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Loans</h1>
          <Button className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            New Loan Application
          </Button>
        </div>
        
        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">Active Loans</p>
            <h3 className="text-2xl font-bold">$7,000</h3>
            <p className="text-sm text-gray-500">3 active loans</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">Expected Interest</p>
            <h3 className="text-2xl font-bold">$630</h3>
            <p className="text-sm text-gray-500">Avg. 9% rate</p>
          </div>
          <div className="bg-red-100 rounded-lg p-4">
            <p className="text-sm text-red-700">Overdue Amount</p>
            <h3 className="text-2xl font-bold text-red-700">$400</h3>
            <p className="text-sm text-red-700">1 overdue loan</p>
          </div>
          <div className="bg-green-100 rounded-lg p-4">
            <p className="text-sm text-green-700">Repaid This Month</p>
            <h3 className="text-2xl font-bold text-green-700">$2,500</h3>
            <p className="text-sm text-green-700">1 completed loan</p>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search loans..." 
              className="pl-10" 
            />
          </div>
          <select className="border border-gray-300 rounded-md px-4 py-2">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="repaid">Repaid</option>
          </select>
          <Input
            type="month"
            className="w-40"
            defaultValue="2023-05"
          />
        </div>
        
        {/* Loans table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.member}</TableCell>
                  <TableCell>{loan.amount}</TableCell>
                  <TableCell>{loan.interestRate}</TableCell>
                  <TableCell>{loan.issued}</TableCell>
                  <TableCell>{loan.dueDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      loan.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                      loan.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {loan.status}
                    </span>
                  </TableCell>
                  <TableCell>{loan.balance}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default Loans;
