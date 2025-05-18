
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useGroupDetails } from '@/hooks/useGroupDetails';
import { useToast } from '@/components/ui/use-toast';
import AddGroupMemberDialog from '@/components/groups/AddGroupMemberDialog';
import EditGroupMemberDialog from '@/components/groups/EditGroupMemberDialog';
import DeleteGroupMemberDialog from '@/components/groups/DeleteGroupMemberDialog';
import GroupMembersHeader from '@/components/groups/GroupMembersHeader';
import GroupMembersList from '@/components/groups/GroupMembersList';
import { Member } from '@/types/group';

const GroupMembers: React.FC = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Update to ensure groupId is passed as string
  const { 
    group, 
    members, 
    loading, 
    userRole, 
    canManageMembers,
    fetchGroupAndMembers 
  } = useGroupDetails(groupId, user);
  
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);

  // Ensure groupId is defined before fetching
  useEffect(() => {
    if (user && groupId) {
      fetchGroupAndMembers();
    }
  }, [groupId, user]);

  const handleAddMemberSuccess = () => {
    setAddMemberOpen(false);
    fetchGroupAndMembers();
    toast({
      title: "Member added",
      description: "The member has been added to the group successfully."
    });
  };

  const handleEditMemberSuccess = () => {
    setEditMember(null);
    fetchGroupAndMembers();
    toast({
      title: "Member updated",
      description: "Member role has been updated successfully."
    });
  };

  const handleDeleteMemberSuccess = () => {
    setDeleteMember(null);
    fetchGroupAndMembers();
    toast({
      title: "Member removed",
      description: "The member has been removed from the group successfully."
    });
  };

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <GroupMembersHeader 
          group={group}
          canManageMembers={canManageMembers}
          onBackClick={() => navigate('/groups')}
          onAddMemberClick={() => setAddMemberOpen(true)}
        />

        <GroupMembersList 
          members={members}
          loading={loading}
          canManageMembers={canManageMembers}
          currentUserId={user?.id}
          isAdmin={userRole === 'admin'}
          onAddMember={() => setAddMemberOpen(true)}
          onEditMember={(member) => setEditMember(member)}
          onDeleteMember={(member) => setDeleteMember(member)}
        />
      </div>

      {groupId && (
        <AddGroupMemberDialog 
          open={addMemberOpen} 
          onOpenChange={setAddMemberOpen}
          groupId={groupId}
          onSuccess={handleAddMemberSuccess}
        />
      )}
      
      {editMember && groupId && (
        <EditGroupMemberDialog 
          open={!!editMember} 
          onOpenChange={() => setEditMember(null)}
          groupId={groupId}
          member={editMember}
          onSuccess={handleEditMemberSuccess}
        />
      )}
      
      {deleteMember && groupId && (
        <DeleteGroupMemberDialog 
          open={!!deleteMember} 
          onOpenChange={() => setDeleteMember(null)}
          groupId={groupId}
          member={deleteMember}
          onSuccess={handleDeleteMemberSuccess}
        />
      )}
    </Layout>
  );
};

export default GroupMembers;
