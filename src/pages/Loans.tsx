
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { useLoans } from '@/hooks/useLoans';
import NewLoanApplicationDialog from '@/components/loans/NewLoanApplicationDialog';

const Loans: React.FC = () => {
  const { user } = useAuth();
  const {
    loans,
    loading,
    activeLoansTotal,
    expectedInterest,
    overdueAmount,
    repaidThisMonth,
    fetchLoans,
    formatCurrency
  } = useLoans();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');

  const [newLoanDialogOpen, setNewLoanDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      setSelectedMonth(`${year}-${month}`);
    }
  }, [user]);

  useEffect(() => {
    if (selectedMonth && user) {
      const [year, month] = selectedMonth.split('-');
      if (year && month) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString();
        const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString();
        fetchLoans(startDate, endDate);
      }
    }
  }, [selectedMonth, user]);

  const handleNewLoanSuccess = () => {
    setNewLoanDialogOpen(false);
    
    // Refetch loans with current selected month
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      if (year && month) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString();
        const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString();
        fetchLoans(startDate, endDate);
      }
    }
  };

  // Filter loans based on search term and filters
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || loan.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Loans</h1>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setNewLoanDialogOpen(true)}
          >
            <CreditCard className="h-4 w-4" />
            New Loan Application
          </Button>
        </div>
        
        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">Active Loans</p>
            <h3 className="text-2xl font-bold">{formatCurrency(activeLoansTotal)}</h3>
            <p className="text-sm text-gray-500">{loans.filter(loan => loan.status === 'Active').length} active loans</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">Expected Interest</p>
            <h3 className="text-2xl font-bold">{formatCurrency(expectedInterest)}</h3>
            <p className="text-sm text-gray-500">Avg. {(expectedInterest / activeLoansTotal * 100).toFixed(1)}% rate</p>
          </div>
          <div className="bg-red-100 rounded-lg p-4">
            <p className="text-sm text-red-700">Overdue Amount</p>
            <h3 className="text-2xl font-bold text-red-700">{formatCurrency(overdueAmount)}</h3>
            <p className="text-sm text-red-700">{loans.filter(loan => loan.status === 'Overdue').length} overdue loan(s)</p>
          </div>
          <div className="bg-green-100 rounded-lg p-4">
            <p className="text-sm text-green-700">Repaid This Month</p>
            <h3 className="text-2xl font-bold text-green-700">{formatCurrency(repaidThisMonth)}</h3>
            <p className="text-sm text-green-700">{loans.filter(loan => loan.status === 'Repaid').length} completed loan(s)</p>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search loans..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-300 rounded-md px-4 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="repaid">Repaid</option>
            <option value="rejected">Rejected</option>
          </select>
          <Input
            type="month"
            className="w-40"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading loans...
                  </TableCell>
                </TableRow>
              ) : filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No loans found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.member_name}</TableCell>
                    <TableCell>{formatCurrency(loan.amount)}</TableCell>
                    <TableCell>{loan.interest_rate}%</TableCell>
                    <TableCell>{loan.issued_date ? new Date(loan.issued_date).toLocaleDateString() : 'Not issued'}</TableCell>
                    <TableCell>{loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'Not set'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        loan.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                        loan.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        loan.status === 'Repaid' ? 'bg-green-100 text-green-800' :
                        loan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        loan.status === 'Approved' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {loan.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(loan.balance)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <NewLoanApplicationDialog
        open={newLoanDialogOpen}
        onOpenChange={setNewLoanDialogOpen}
        onSuccess={handleNewLoanSuccess}
      />
    </Layout>
  );
};

export default Loans;
