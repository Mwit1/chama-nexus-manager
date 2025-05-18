
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loan, LoanStatus } from '@/types/loan';

export function useLoans() {
  const { toast } = useToast();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLoansTotal, setActiveLoansTotal] = useState(0);
  const [expectedInterest, setExpectedInterest] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);
  const [repaidThisMonth, setRepaidThisMonth] = useState(0);
  
  const fetchLoans = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      
      // In a real implementation, this would query the loans table
      // This is a mock implementation since we don't have the loans table yet
      const mockLoans: Loan[] = [
        {
          id: '1',
          user_id: '1',
          member_name: 'John Doe',
          group_id: '1',
          group_name: 'Savings Group A',
          amount: 2000,
          interest_rate: 10,
          issued_date: '2023-04-10',
          due_date: '2023-07-10',
          application_date: '2023-04-05',
          status: 'Active',
          purpose: 'Business expansion',
          balance: 1500
        },
        {
          id: '2',
          user_id: '2',
          member_name: 'Jane Smith',
          group_id: '1',
          group_name: 'Savings Group A',
          amount: 1500,
          interest_rate: 12,
          issued_date: '2023-04-15',
          due_date: '2023-06-15',
          application_date: '2023-04-10',
          status: 'Active',
          purpose: 'Home repairs',
          balance: 1000
        },
        {
          id: '3',
          user_id: '3',
          member_name: 'Michael Johnson',
          group_id: '2',
          group_name: 'Savings Group B',
          amount: 3000,
          interest_rate: 8,
          issued_date: '2023-03-20',
          due_date: '2023-06-20',
          application_date: '2023-03-15',
          status: 'Active',
          purpose: 'Education',
          balance: 1800
        },
        {
          id: '4',
          user_id: '4',
          member_name: 'Sara Williams',
          group_id: '2',
          group_name: 'Savings Group B',
          amount: 1000,
          interest_rate: 15,
          issued_date: '2023-02-05',
          due_date: '2023-05-05',
          application_date: '2023-02-01',
          status: 'Overdue',
          purpose: 'Medical expenses',
          balance: 400
        },
        {
          id: '5',
          user_id: '5',
          member_name: 'Robert Brown',
          group_id: '1',
          group_name: 'Savings Group A',
          amount: 2500,
          interest_rate: 10,
          issued_date: '2023-01-01',
          due_date: '2023-04-01',
          application_date: '2022-12-25',
          status: 'Repaid',
          purpose: 'Debt consolidation',
          balance: 0
        }
      ];
      
      setLoans(mockLoans);
      
      // Calculate active loans total
      const active = mockLoans.filter(loan => loan.status === 'Active');
      const activeTotal = active.reduce((sum, loan) => sum + loan.balance, 0);
      setActiveLoansTotal(activeTotal);
      
      // Calculate expected interest
      const expectedInt = active.reduce((sum, loan) => {
        return sum + (loan.balance * loan.interest_rate / 100);
      }, 0);
      setExpectedInterest(expectedInt);
      
      // Calculate overdue amount
      const overdue = mockLoans.filter(loan => loan.status === 'Overdue');
      const overdueTotal = overdue.reduce((sum, loan) => sum + loan.balance, 0);
      setOverdueAmount(overdueTotal);
      
      // Calculate repaid this month
      const repaid = mockLoans.filter(loan => loan.status === 'Repaid');
      const repaidTotal = repaid.reduce((sum, loan) => sum + loan.amount, 0);
      setRepaidThisMonth(repaidTotal);
      
      return mockLoans;
    } catch (error: any) {
      console.error('Error fetching loans:', error);
      toast({
        title: "Error fetching loans",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Format currency to Kenya Shillings
  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  return {
    loans,
    loading,
    activeLoansTotal,
    expectedInterest,
    overdueAmount,
    repaidThisMonth,
    fetchLoans,
    formatCurrency
  };
}
