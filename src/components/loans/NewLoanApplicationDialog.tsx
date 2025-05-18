
import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useGroupMembers } from '@/hooks/useGroupMembers';
import { LoanFormValues } from '@/types/loan';

// Form schema
const loanFormSchema = z.object({
  group_id: z.string().min(1, "Group is required"),
  user_id: z.string().min(1, "Member is required"),
  amount: z.number().min(1000, "Amount must be at least 1000"),
  interest_rate: z.number().min(0, "Interest rate must be positive"),
  payment_period: z.number().min(1, "Payment period must be at least 1 month"),
  purpose: z.string().min(10, "Purpose description must be at least 10 characters")
});

interface NewLoanApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NewLoanApplicationDialog: React.FC<NewLoanApplicationDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    groups,
    members,
    selectedGroup,
    loading,
    setSelectedGroup,
    fetchGroups,
    fetchGroupMembers
  } = useGroupMembers();
  
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      group_id: "",
      user_id: "",
      amount: 0,
      interest_rate: 10, // Default interest rate
      payment_period: 3, // Default payment period in months
      purpose: "",
    },
  });

  // Fetch groups when dialog opens
  useEffect(() => {
    if (open) {
      const loadInitialData = async () => {
        const groupId = await fetchGroups();
        if (groupId) {
          form.setValue('group_id', groupId);
          const membersList = await fetchGroupMembers(groupId);
          if (membersList && membersList.length > 0) {
            form.setValue('user_id', membersList[0].id);
          }
        }
      };
      
      loadInitialData();
    }
  }, [open]);

  const handleGroupChange = async (groupId: string) => {
    setSelectedGroup(groupId);
    form.setValue('group_id', groupId);
    const membersList = await fetchGroupMembers(groupId);
    if (membersList && membersList.length > 0) {
      form.setValue('user_id', membersList[0].id);
    }
  };

  const onSubmit = async (values: LoanFormValues) => {
    // In a real implementation, this would insert into the loans table
    // For now, we'll just simulate success
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Loan application submitted:', values);
      
      toast({
        title: "Loan application submitted",
        description: "Your loan application has been submitted successfully.",
      });
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting loan application:', error);
      toast({
        title: "Error submitting loan application",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Loan Application</DialogTitle>
          <DialogDescription>
            Submit a new loan application to be reviewed by group administrators.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Group selection */}
            <FormField
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border border-input rounded-md p-2"
                      disabled={loading}
                      {...field}
                      onChange={(e) => handleGroupChange(e.target.value)}
                    >
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Member selection */}
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border border-input rounded-md p-2"
                      disabled={loading || members.length === 0}
                      {...field}
                    >
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.full_name || 'Unknown'}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (KES)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter loan amount"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interest Rate */}
            <FormField
              control={form.control}
              name="interest_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter interest rate"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Period */}
            <FormField
              control={form.control}
              name="payment_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Period (months)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter payment period in months"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purpose */}
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose of this loan"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLoanApplicationDialog;
