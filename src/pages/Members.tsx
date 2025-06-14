
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import MembersOverview from '@/components/members/MembersOverview';
import MembersGrid from '@/components/members/MembersGrid';
import MembersFilters from '@/components/members/MembersFilters';
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
  
  useEffect(() => {
    if (user) {
      fetchMembers(user.id);
    }
  }, [user]);

  const handleRefresh = () => {
    if (user) {
      fetchMembers(user.id);
    }
  };

  const isAdmin = userRole === 'admin';

  // Filter members based on search term and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.group_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesRole = roleFilter === 'all' || member.role?.toLowerCase() === roleFilter.toLowerCase();
    const matchesGroup = groupFilter === 'all' || member.group_name === groupFilter;
    
    return matchesSearch && matchesStatus && matchesRole && matchesGroup;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Members Directory</h1>
              <p className="text-gray-600 mt-1">View and manage all members across your groups</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <MembersOverview members={members} loading={loading} />
        
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Members</h2>
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
          </div>
          
          <MembersGrid
            members={filteredMembers}
            loading={loading}
            isAdmin={isAdmin}
            onAddMember={() => {}}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Members;
