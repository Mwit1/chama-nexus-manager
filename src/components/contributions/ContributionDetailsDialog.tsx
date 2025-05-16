
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

interface Contribution {
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
}

interface ContributionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contribution: Contribution;
}

const ContributionDetailsDialog: React.FC<ContributionDetailsDialogProps> = ({
  open,
  onOpenChange,
  contribution,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contribution Details</DialogTitle>
          <DialogDescription>
            Details for contribution #{contribution.reference}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Group</h4>
              <p className="text-base">{contribution.group_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Member</h4>
              <p className="text-base">{contribution.member_name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Amount</h4>
              <p className="text-base font-bold">${contribution.amount.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Date</h4>
              <p className="text-base">
                {format(new Date(contribution.contribution_date), 'PPP')}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
              <p className="text-base">{contribution.payment_method}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                contribution.status === 'Completed' ? 'bg-green-100 text-green-800' :
                contribution.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {contribution.status}
              </span>
            </div>
          </div>
          
          {contribution.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="text-base">{contribution.description}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
          <Button variant="outline">Print Receipt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContributionDetailsDialog;
