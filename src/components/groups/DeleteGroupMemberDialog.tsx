
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/types/group';

interface DeleteGroupMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  member: Member | null;
  onSuccess: () => void;
}

const DeleteGroupMemberDialog: React.FC<DeleteGroupMemberDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  member,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!member) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', member.id)
        .eq('group_id', groupId);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: `${member.full_name} has been removed from the group.`
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: "Error removing member",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {member?.full_name || 'this member'} from the group? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground"
          >
            {isDeleting ? "Removing..." : "Remove Member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGroupMemberDialog;
