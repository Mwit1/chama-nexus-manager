
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import AddMemberDialog from '@/components/members/AddMemberDialog';
import EditMemberDialog from '@/components/members/EditMemberDialog';
import DeleteMemberDialog from '@/components/members/DeleteMemberDialog';
import MembersSearch from '@/components/members/MembersSearch';
import MembersTable from '@/components/members/MembersTable';
import { useMembers, type Member } from '@/hooks/useMembers';

const Members: React.FC = () => {
  const { user } = useAuth();
  const {
    members,
    loading,
    userRole,
    fetchMembers,
    handleMemberAdded,
    handleMemberUpdated,
    handleMemberDeleted
  } = useMembers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchMembers(user.id);
    }
  }, [user]);

  const handleAddMemberSuccess = () => {
    setAddMemberOpen(false);
    if (user) {
      fetchMembers(user.id);
    }
    handleMemberAdded();
  };

  const handleEditMemberSuccess = () => {
    setEditMember(null);
    if (user) {
      fetchMembers(user.id);
    }
    handleMemberUpdated();
  };

  const handleDeleteMemberSuccess = () => {
    setDeleteMember(null);
    if (user) {
      fetchMembers(user.id);
    }
    handleMemberDeleted();
  };

  const isAdmin = userRole === 'admin';

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Members</h1>
          {isAdmin && (
            <Button 
              className="flex items-center gap-2"
              onClick={() => setAddMemberOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          )}
        </div>
        
        <MembersSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />
        
        <MembersTable
          members={members}
          loading={loading}
          isAdmin={isAdmin}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          onAddMember={() => setAddMemberOpen(true)}
          onEditMember={(member) => setEditMember(member)}
          onDeleteMember={(member) => setDeleteMember(member)}
        />
      </div>

      {/* Dialogs */}
      <AddMemberDialog 
        open={addMemberOpen} 
        onOpenChange={setAddMemberOpen}
        onSuccess={handleAddMemberSuccess}
      />
      
      {editMember && (
        <EditMemberDialog 
          open={!!editMember} 
          onOpenChange={() => setEditMember(null)}
          member={editMember}
          onSuccess={handleEditMemberSuccess}
        />
      )}
      
      {deleteMember && (
        <DeleteMemberDialog 
          open={!!deleteMember} 
          onOpenChange={() => setDeleteMember(null)}
          member={deleteMember}
          onSuccess={handleDeleteMemberSuccess}
        />
      )}
    </Layout>
  );
};

export default Members;
