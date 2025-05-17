
import React from 'react';
import { Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface ContributionsFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  methodFilter: string;
  setMethodFilter: (method: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

const ContributionsFilter: React.FC<ContributionsFilterProps> = ({
  searchTerm,
  setSearchTerm,
  methodFilter,
  setMethodFilter,
  statusFilter,
  setStatusFilter,
  selectedMonth,
  setSelectedMonth
}) => {
  return (
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
        <option value="m-pesa">M-Pesa</option>
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
  );
};

export default ContributionsFilter;
