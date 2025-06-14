
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
import { Form } from "@/components/ui/form";
import MemberNameField from './MemberNameField';
import MemberPhoneField from './MemberPhoneField';
import UserRoleField from './UserRoleField';
import { useAddMemberByName } from '@/hooks/useAddMemberByName';

interface AddMemberByNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onSuccess: () => void;
}

const AddMemberByNameDialog: React.FC<AddMemberByNameDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  onSuccess,
}) => {
  const { form, onSubmit } = useAddMemberByName(groupId, onSuccess);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group Member</DialogTitle>
          <DialogDescription>
            Add a new member to this group by their name and phone number.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <MemberNameField form={form} />
            <MemberPhoneField form={form} />
            <UserRoleField form={form} />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberByNameDialog;
