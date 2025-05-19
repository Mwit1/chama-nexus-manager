import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import GroupMembersHeader from '@/components/groups/GroupMembersHeader'; 
import GroupMembersList from '@/components/groups/GroupMembersList';
import AddGroupMemberDialog from '@/components/groups/AddGroupMemberDialog';
import { useGroupDetails } from '@/hooks/useGroupDetails';
import { Member, Group } from '@/types/group';

const GroupMembers: React.FC = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);
  
  const { 
    group, 
    members, 
    loading, 
    canManageMembers, 
    userRole,
    fetchGroupAndMembers 
  } = useGroupDetails(groupId, user);
  
  const handleBackClick = () => {
    navigate('/groups');
  };
  
  const handleAddMemberClick = () => {
    setShowAddMemberDialog(true);
  };
  
  const handleAddMemberSuccess = () => {
    setShowAddMemberDialog(false);
    toast({
      title: "Member added",
      description: "The member has been added to the group successfully."
    });
    fetchGroupAndMembers();
  };
  
  const handleEditMember = (member: Member) => {
    setEditMember(member);
  };
  
  const handleDeleteMember = (member: Member) => {
    setDeleteMember(member);
  };
  
  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <GroupMembersHeader 
          group={group}
          canManageMembers={canManageMembers}
          onBackClick={handleBackClick}
          onAddMemberClick={handleAddMemberClick}
        />

        <GroupMembersList
          members={members}
          loading={loading}
          canManageMembers={canManageMembers}
          currentUserId={user?.id}
          isAdmin={userRole === 'admin'}
          onAddMember={handleAddMemberClick}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
        />
        
        {groupId && (
          <AddGroupMemberDialog
            open={showAddMemberDialog}
            onOpenChange={setShowAddMemberDialog}
            groupId={groupId}
            onSuccess={handleAddMemberSuccess}
          />
        )}
        
        {/* Placeholder for edit/delete member dialogs that would be implemented later */}
      </div>
    </Layout>
  );
};

export default GroupMembers;
