
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
import { PiggyBank, Filter, ArrowDown, ArrowUp } from "lucide-react";

const Contributions: React.FC = () => {
  // Mock data for contributions
  const contributions = [
    { id: 1, member: 'John Doe', amount: '$500', date: '05 May 2023', method: 'M-Pesa', status: 'Completed', reference: 'MP12345678' },
    { id: 2, member: 'Jane Smith', amount: '$300', date: '05 May 2023', method: 'Bank Transfer', status: 'Completed', reference: 'BT98765432' },
    { id: 3, member: 'Michael Johnson', amount: '$400', date: '04 May 2023', method: 'Cash', status: 'Completed', reference: 'CH87654321' },
    { id: 4, member: 'Sara Williams', amount: '$500', date: '03 May 2023', method: 'M-Pesa', status: 'Failed', reference: 'MP23456789' },
    { id: 5, member: 'Robert Brown', amount: '$500', date: '01 May 2023', method: 'Bank Transfer', status: 'Pending', reference: 'BT34567890' },
  ];

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contributions</h1>
          <Button className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            Record Contribution
          </Button>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">This Month</p>
            <h3 className="text-2xl font-bold">$2,750</h3>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUp className="h-4 w-4 mr-1" /> 
              <span>12% from last month</span>
            </div>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">Expected This Month</p>
            <h3 className="text-2xl font-bold">$3,000</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span>92% completion rate</span>
            </div>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">Outstanding</p>
            <h3 className="text-2xl font-bold">$250</h3>
            <div className="flex items-center text-sm text-red-600 mt-1">
              <span>1 member pending</span>
            </div>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Filter contributions..." 
              className="pl-10" 
            />
          </div>
          <select className="border border-gray-300 rounded-md px-4 py-2">
            <option value="all">All Methods</option>
            <option value="mpesa">M-Pesa</option>
            <option value="bank">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>
          <select className="border border-gray-300 rounded-md px-4 py-2">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <Input
            type="month"
            className="w-40"
            defaultValue="2023-05"
          />
        </div>
        
        {/* Contributions table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map((contribution) => (
                <TableRow key={contribution.id}>
                  <TableCell className="font-medium">{contribution.member}</TableCell>
                  <TableCell>{contribution.amount}</TableCell>
                  <TableCell>{contribution.date}</TableCell>
                  <TableCell>{contribution.method}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contribution.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      contribution.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {contribution.status}
                    </span>
                  </TableCell>
                  <TableCell>{contribution.reference}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Details</Button>
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

export default Contributions;
