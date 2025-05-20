
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
import UserSearchField from './UserSearchField';
import UserRoleField from './UserRoleField';
import { useAddGroupMember } from '@/hooks/useAddGroupMember';

interface AddGroupMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onSuccess: () => void;
}

const AddGroupMemberDialog: React.FC<AddGroupMemberDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  onSuccess,
}) => {
  const {
    form,
    searchingUser,
    userFound,
    handleEmailSearch,
    onSubmit,
    resetForm
  } = useAddGroupMember(groupId, onSuccess);

  // Reset user found state when dialog is opened or closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group Member</DialogTitle>
          <DialogDescription>
            Add a new member to this group by their email address.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <UserSearchField 
              form={form} 
              userFound={userFound} 
              searchingUser={searchingUser} 
              onSearch={handleEmailSearch} 
            />

            {userFound && (
              <>
                <div className="bg-green-50 p-2 rounded-md text-green-800 text-sm">
                  User found: {userFound.email}
                </div>

                <UserRoleField form={form} />
              </>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting || searchingUser || (!userFound && !form.formState.isDirty)}
              >
                {form.formState.isSubmitting ? "Adding..." : userFound ? "Add Member" : "Search User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupMemberDialog;
