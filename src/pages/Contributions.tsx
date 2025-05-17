
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import RecordContributionDialog from '@/components/contributions/RecordContributionDialog';
import ContributionDetailsDialog from '@/components/contributions/ContributionDetailsDialog';
import ContributionsOverview from '@/components/contributions/ContributionsOverview';
import ContributionsFilter from '@/components/contributions/ContributionsFilter';
import ContributionsTable from '@/components/contributions/ContributionsTable';
import { useContributions, Contribution } from '@/hooks/useContributions';

const Contributions: React.FC = () => {
  const { user } = useAuth();
  const {
    contributions,
    loading,
    thisMonthTotal,
    expectedTotal,
    outstandingTotal,
    percentCompletion,
    changeFromLastMonth,
    fetchContributions,
    formatCurrency
  } = useContributions();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const [recordContributionOpen, setRecordContributionOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

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
        fetchContributions(startDate, endDate);
      }
    }
  }, [selectedMonth, user]);

  const handleRecordContributionSuccess = () => {
    setRecordContributionOpen(false);
    
    // Refetch contributions with current selected month
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      if (year && month) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString();
        const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString();
        fetchContributions(startDate, endDate);
      }
    }
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
        <ContributionsOverview
          thisMonthTotal={thisMonthTotal}
          expectedTotal={expectedTotal}
          outstandingTotal={outstandingTotal}
          percentCompletion={percentCompletion}
          changeFromLastMonth={changeFromLastMonth}
          formatCurrency={formatCurrency}
        />
        
        {/* Search and filter */}
        <ContributionsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        
        {/* Contributions table */}
        <ContributionsTable
          contributions={filteredContributions}
          loading={loading}
          formatCurrency={formatCurrency}
          onViewDetails={setSelectedContribution}
        />
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
