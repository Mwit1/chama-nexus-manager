
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import MembersOverview from '@/components/members/MembersOverview';
import MembersGrid from '@/components/members/MembersGrid';
import MembersFilters from '@/components/members/MembersFilters';
import AddMemberDialog from '@/components/members/AddMemberDialog';
import { useAllMembers } from '@/hooks/useAllMembers';

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
  } = useAllMembers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  
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

  const isAdmin = userRole === 'admin';

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.group_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesRole = roleFilter === 'all' || member.role?.toLowerCase() === roleFilter.toLowerCase();
    const matchesGroup = groupFilter === 'all' || member.group_id === groupFilter;
    
    return matchesSearch && matchesStatus && matchesRole && matchesGroup;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Members</h1>
              <p className="text-gray-600 mt-1">View and manage all members across your groups</p>
            </div>
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
        </div>

        <MembersOverview members={members} loading={loading} />
        
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <MembersFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            groupFilter={groupFilter}
            setGroupFilter={setGroupFilter}
            members={members}
          />
          
          <MembersGrid
            members={filteredMembers}
            loading={loading}
            isAdmin={isAdmin}
            onAddMember={() => setAddMemberOpen(true)}
          />
        </div>

        <AddMemberDialog 
          open={addMemberOpen} 
          onOpenChange={setAddMemberOpen}
          onSuccess={handleAddMemberSuccess}
        />
      </div>
    </Layout>
  );
};

export default Members;
