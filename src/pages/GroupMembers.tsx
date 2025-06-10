
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import GroupMembersHeader from '@/components/groups/GroupMembersHeader'; 
import GroupMembersList from '@/components/groups/GroupMembersList';
import AddGroupMemberDialog from '@/components/groups/AddGroupMemberDialog';
import EditGroupMemberDialog from '@/components/groups/EditGroupMemberDialog';
import DeleteGroupMemberDialog from '@/components/groups/DeleteGroupMemberDialog';
import { useGroupDetails } from '@/hooks/useGroupDetails';
import { useGroupMemberOperations } from '@/hooks/useGroupMemberOperations';

const GroupMembers: React.FC = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Custom hooks
  const { 
    group, 
    members, 
    loading, 
    canManageMembers, 
    userRole,
    fetchGroupAndMembers 
  } = useGroupDetails(groupId, user);
  
  const {
    showAddMemberDialog,
    openAddMemberDialog,
    closeAddMemberDialog,
    editMember,
    openEditMemberDialog,
    closeEditMemberDialog,
    deleteMember,
    openDeleteMemberDialog,
    closeDeleteMemberDialog
  } = useGroupMemberOperations();
  
  // Navigation handlers
  const handleBackClick = () => {
    navigate('/groups');
  };
  
  // Success handlers
  const handleAddMemberSuccess = () => {
    closeAddMemberDialog();
    toast({
      title: "Member added",
      description: "The member has been added to the group successfully."
    });
    fetchGroupAndMembers();
  };
  
  const handleEditMemberSuccess = () => {
    closeEditMemberDialog();
    fetchGroupAndMembers();
  };
  
  const handleDeleteMemberSuccess = () => {
    closeDeleteMemberDialog();
    fetchGroupAndMembers();
  };
  
  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <GroupMembersHeader 
          group={group}
          canManageMembers={canManageMembers}
          onBackClick={handleBackClick}
          onAddMemberClick={openAddMemberDialog}
        />

        <GroupMembersList
          members={members}
          loading={loading}
          canManageMembers={canManageMembers}
          currentUserId={user?.id}
          isAdmin={userRole === 'admin'}
          onAddMember={openAddMemberDialog}
          onEditMember={openEditMemberDialog}
          onDeleteMember={openDeleteMemberDialog}
        />
        
        {/* Dialogs */}
        {groupId && (
          <>
            <AddGroupMemberDialog
              open={showAddMemberDialog}
              onOpenChange={closeAddMemberDialog}
              groupId={groupId}
              onSuccess={handleAddMemberSuccess}
            />
            
            <EditGroupMemberDialog
              open={!!editMember}
              onOpenChange={closeEditMemberDialog}
              groupId={groupId}
              member={editMember}
              onSuccess={handleEditMemberSuccess}
            />
            
            <DeleteGroupMemberDialog
              open={!!deleteMember}
              onOpenChange={closeDeleteMemberDialog}
              groupId={groupId}
              member={deleteMember}
              onSuccess={handleDeleteMemberSuccess}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default GroupMembers;
