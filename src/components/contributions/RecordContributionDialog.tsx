
import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { contributionFormSchema, ContributionFormValues } from "./ContributionFormSchema";
import ContributionForm from "./ContributionForm";
import { useGroupMembers } from '@/hooks/useGroupMembers';

interface RecordContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const RecordContributionDialog: React.FC<RecordContributionDialogProps> = ({
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
  
  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      group_id: "",
      user_id: "",
      amount: undefined,
      payment_method: "M-Pesa",
      description: "",
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
    const membersList = await fetchGroupMembers(groupId);
    if (membersList && membersList.length > 0) {
      form.setValue('user_id', membersList[0].id);
    }
  };

  const onSubmit = async (values: ContributionFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to record contributions.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('contributions')
        .insert({
          group_id: values.group_id,
          user_id: values.user_id,
          amount: values.amount,
          payment_method: values.payment_method,
          description: values.description || null,
          recorded_by: user.id,
          contribution_date: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error('Error recording contribution:', error);
      toast({
        title: "Error recording contribution",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Contribution</DialogTitle>
          <DialogDescription>
            Record a new contribution from a group member.
          </DialogDescription>
        </DialogHeader>
        <ContributionForm
          form={form}
          groups={groups}
          members={members}
          loading={loading}
          selectedGroup={selectedGroup}
          onGroupChange={handleGroupChange}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecordContributionDialog;
