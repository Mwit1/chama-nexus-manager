
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import UserRoleField from './UserRoleField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addMemberFormSchema, AddMemberFormValues } from './AddMemberFormSchema';
import { Member } from '@/types/group';

interface EditGroupMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  member: Member | null;
  onSuccess: () => void;
}

const EditGroupMemberDialog: React.FC<EditGroupMemberDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  member,
  onSuccess,
}) => {
  const { toast } = useToast();

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  // Set the form values when the member changes
  useEffect(() => {
    if (member) {
      form.setValue('role', member.role as 'admin' | 'treasurer' | 'member');
    }
  }, [member, form]);

  const onSubmit = async (values: AddMemberFormValues) => {
    if (!member) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: values.role })
        .eq('id', member.id)
        .eq('group_id', groupId);

      if (error) throw error;

      toast({
        title: "Member updated",
        description: `${member.full_name}'s role has been updated to ${values.role}.`,
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating member role:', error);
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member Role</DialogTitle>
          <DialogDescription>
            Change the role for {member?.full_name || 'this member'}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <UserRoleField form={form} />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupMemberDialog;
