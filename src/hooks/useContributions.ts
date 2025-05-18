
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type Contribution = {
  id: string;
  user_id: string;
  member_name: string;
  amount: number;
  contribution_date: string;
  payment_method: string;
  description: string | null;
  status: 'Completed' | 'Pending' | 'Failed';
  reference: string;
  group_id: string;
  group_name: string;
};

export function useContributions() {
  const { toast } = useToast();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const [expectedTotal, setExpectedTotal] = useState(3000); // Hardcoded for demo
  const [outstandingTotal, setOutstandingTotal] = useState(0);
  const [percentCompletion, setPercentCompletion] = useState(0);
  const [changeFromLastMonth, setChangeFromLastMonth] = useState(0);

  const fetchContributions = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      
      if (!startDate || !endDate) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        
        // Fix the type mismatch by first converting numbers to strings
        const yearString = year.toString();
        const monthString = month.toString();
        
        startDate = new Date(parseInt(yearString), parseInt(monthString) - 1, 1).toISOString();
        endDate = new Date(parseInt(yearString), parseInt(monthString), 0).toISOString();
      }
      
      // Fix the query to join correctly for profiles and groups
      const { data: contribData, error: contribError } = await supabase
        .from('contributions')
        .select(`
          *,
          groups (name),
          profiles:user_id (full_name)
        `)
        .gte('contribution_date', startDate)
        .lte('contribution_date', endDate);
      
      if (contribError) throw contribError;
      
      // Format the contributions data
      const formattedContributions = contribData.map((contrib: any): Contribution => ({
        id: contrib.id,
        user_id: contrib.user_id,
        member_name: contrib.profiles?.full_name || 'Unknown',
        amount: contrib.amount,
        contribution_date: contrib.contribution_date,
        payment_method: contrib.payment_method,
        description: contrib.description,
        status: 'Completed', // Default for demo
        reference: contrib.id.substring(0, 8).toUpperCase(),
        group_id: contrib.group_id,
        group_name: contrib.groups?.name || 'Unknown Group'
      }));
      
      setContributions(formattedContributions);
      
      // Calculate this month's total
      const monthlyTotal = formattedContributions.reduce((sum, contrib) => sum + contrib.amount, 0);
      setThisMonthTotal(monthlyTotal);
      
      // Calculate outstanding amount
      const outstanding = expectedTotal - monthlyTotal;
      setOutstandingTotal(outstanding > 0 ? outstanding : 0);
      
      // Calculate percentage completion
      const percentage = (monthlyTotal / expectedTotal) * 100;
      setPercentCompletion(percentage > 100 ? 100 : percentage);
      
      // Calculate change from last month
      // In a real application, fetch the previous month's data
      setChangeFromLastMonth(12); // Hardcoded for demo
      
      return formattedContributions;
      
    } catch (error: any) {
      console.error('Error fetching contributions:', error);
      toast({
        title: "Error fetching contributions",
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
    contributions,
    loading,
    thisMonthTotal,
    expectedTotal,
    outstandingTotal,
    percentCompletion,
    changeFromLastMonth,
    fetchContributions,
    formatCurrency
  };
}
