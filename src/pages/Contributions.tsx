
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
import { PiggyBank, Filter, ArrowDown, ArrowUp } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import RecordContributionDialog from '@/components/contributions/RecordContributionDialog';
import ContributionDetailsDialog from '@/components/contributions/ContributionDetailsDialog';

type Contribution = {
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

const Contributions: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const [recordContributionOpen, setRecordContributionOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  
  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const [expectedTotal, setExpectedTotal] = useState(3000); // Hardcoded for demo
  const [outstandingTotal, setOutstandingTotal] = useState(0);
  const [percentCompletion, setPercentCompletion] = useState(0);
  const [changeFromLastMonth, setChangeFromLastMonth] = useState(0);

  useEffect(() => {
    if (user) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      setSelectedMonth(`${year}-${month}`);
      fetchContributions();
    }
  }, [user, selectedMonth]);

  const fetchContributions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Parse selected month
      const [year, month] = selectedMonth ? selectedMonth.split('-') : [null, null];
      
      if (!year || !month) {
        toast({
          title: "Invalid date selection",
          description: "Please select a valid month",
          variant: "destructive"
        });
        return;
      }
      
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString();
      const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString();
      
      // Fetch contributions for the selected month
      const { data: contribData, error: contribError } = await supabase
        .from('contributions')
        .select(`
          *,
          groups:group_id (name),
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
      
    } catch (error: any) {
      console.error('Error fetching contributions:', error);
      toast({
        title: "Error fetching contributions",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordContributionSuccess = () => {
    setRecordContributionOpen(false);
    fetchContributions();
    toast({
      title: "Contribution recorded",
      description: "The contribution has been recorded successfully."
    });
  };

  // Filter contributions based on search term and filters
  const filteredContributions = contributions.filter(contribution => {
    const matchesSearch = 
      contribution.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.payment_method.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = methodFilter === 'all' || contribution.payment_method.toLowerCase() === methodFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || contribution.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contributions</h1>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setRecordContributionOpen(true)}
          >
            <PiggyBank className="h-4 w-4" />
            Record Contribution
          </Button>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">This Month</p>
            <h3 className="text-2xl font-bold">${thisMonthTotal.toFixed(2)}</h3>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUp className="h-4 w-4 mr-1" /> 
              <span>{changeFromLastMonth}% from last month</span>
            </div>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">Expected This Month</p>
            <h3 className="text-2xl font-bold">${expectedTotal.toFixed(2)}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span>{percentCompletion.toFixed(0)}% completion rate</span>
            </div>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-gray-500">Outstanding</p>
            <h3 className="text-2xl font-bold">${outstandingTotal.toFixed(2)}</h3>
            <div className="flex items-center text-sm text-red-600 mt-1">
              <span>{outstandingTotal > 0 ? '1 member pending' : 'All contributions received'}</span>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-300 rounded-md px-4 py-2"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value="mpesa">M-Pesa</option>
            <option value="bank transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>
          <select 
            className="border border-gray-300 rounded-md px-4 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <Input
            type="month"
            className="w-40"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading contributions...
                  </TableCell>
                </TableRow>
              ) : filteredContributions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No contributions found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContributions.map((contribution) => (
                  <TableRow key={contribution.id}>
                    <TableCell className="font-medium">{contribution.member_name}</TableCell>
                    <TableCell>${contribution.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(contribution.contribution_date).toLocaleDateString()}</TableCell>
                    <TableCell>{contribution.payment_method}</TableCell>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedContribution(contribution)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialogs */}
      <RecordContributionDialog
        open={recordContributionOpen}
        onOpenChange={setRecordContributionOpen}
        onSuccess={handleRecordContributionSuccess}
      />
      
      {selectedContribution && (
        <ContributionDetailsDialog
          open={!!selectedContribution}
          onOpenChange={() => setSelectedContribution(null)}
          contribution={selectedContribution}
        />
      )}
    </Layout>
  );
};

export default Contributions;
