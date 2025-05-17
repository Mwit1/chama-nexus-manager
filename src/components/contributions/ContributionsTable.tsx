
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Contribution } from '@/hooks/useContributions';

interface ContributionsTableProps {
  contributions: Contribution[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
  onViewDetails: (contribution: Contribution) => void;
}

const ContributionsTable: React.FC<ContributionsTableProps> = ({
  contributions,
  loading,
  formatCurrency,
  onViewDetails
}) => {
  return (
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
          ) : contributions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No contributions found for this period.
              </TableCell>
            </TableRow>
          ) : (
            contributions.map((contribution) => (
              <TableRow key={contribution.id}>
                <TableCell className="font-medium">{contribution.member_name}</TableCell>
                <TableCell>{formatCurrency(contribution.amount)}</TableCell>
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
                    onClick={() => onViewDetails(contribution)}
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
  );
};

export default ContributionsTable;
