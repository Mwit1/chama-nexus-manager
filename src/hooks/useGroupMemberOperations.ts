
import { useState } from 'react';
import { Member } from '@/types/group';

export function useGroupMemberOperations() {
  // Dialog states
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);
  
  // Open and close dialog functions
  const openAddMemberDialog = () => setShowAddMemberDialog(true);
  const closeAddMemberDialog = () => setShowAddMemberDialog(false);
  
  const openEditMemberDialog = (member: Member) => setEditMember(member);
  const closeEditMemberDialog = () => setEditMember(null);
  
  const openDeleteMemberDialog = (member: Member) => setDeleteMember(member);
  const closeDeleteMemberDialog = () => setDeleteMember(null);
  
  return {
    // Add member dialog
    showAddMemberDialog,
    openAddMemberDialog,
    closeAddMemberDialog,
    
    // Edit member dialog
    editMember,
    openEditMemberDialog,
    closeEditMemberDialog,
    
    // Delete member dialog
    deleteMember,
    openDeleteMemberDialog,
    closeDeleteMemberDialog
  };
}
