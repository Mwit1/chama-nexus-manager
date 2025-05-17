
import React from 'react';
import { ArrowUp } from 'lucide-react';

interface ContributionsOverviewProps {
  thisMonthTotal: number;
  expectedTotal: number;
  outstandingTotal: number;
  percentCompletion: number;
  changeFromLastMonth: number;
  formatCurrency: (amount: number) => string;
}

const ContributionsOverview: React.FC<ContributionsOverviewProps> = ({
  thisMonthTotal,
  expectedTotal,
  outstandingTotal,
  percentCompletion,
  changeFromLastMonth,
  formatCurrency
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-primary/10 rounded-lg p-4">
        <p className="text-sm text-gray-500">This Month</p>
        <h3 className="text-2xl font-bold">{formatCurrency(thisMonthTotal)}</h3>
        <div className="flex items-center text-sm text-green-600 mt-1">
          <ArrowUp className="h-4 w-4 mr-1" /> 
          <span>{changeFromLastMonth}% from last month</span>
        </div>
      </div>
      <div className="bg-primary/10 rounded-lg p-4">
        <p className="text-sm text-gray-500">Expected This Month</p>
        <h3 className="text-2xl font-bold">{formatCurrency(expectedTotal)}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <span>{percentCompletion.toFixed(0)}% completion rate</span>
        </div>
      </div>
      <div className="bg-primary/10 rounded-lg p-4">
        <p className="text-sm text-gray-500">Outstanding</p>
        <h3 className="text-2xl font-bold">{formatCurrency(outstandingTotal)}</h3>
        <div className="flex items-center text-sm text-red-600 mt-1">
          <span>{outstandingTotal > 0 ? '1 member pending' : 'All contributions received'}</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionsOverview;
