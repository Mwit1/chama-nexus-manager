import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { UserPlus, Search, Pencil, Trash } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import AddMemberDialog from '@/components/members/AddMemberDialog';
import EditMemberDialog from '@/components/members/EditMemberDialog';
import DeleteMemberDialog from '@/components/members/DeleteMemberDialog';

type Member = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  email: string;
  role: 'admin' | 'treasurer' | 'member';
  status: 'Active' | 'Inactive' | 'Suspended';
  created_at: string;
};

type UserRole = 'admin' | 'treasurer' | 'member';

const Members: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [user]);

  const fetchMembers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Check if current user is an admin
      const { data: isAdmin, error: roleError } = await supabase
        .rpc('has_role', { user_id: user.id, role: 'admin' });
        
      if (roleError) throw roleError;
      
      // Set user role with proper type
      setUserRole(isAdmin ? 'admin' : 'member');
      
      // Fetch all profiles and their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });
      
      if (profilesError) throw profilesError;
      
      // Fetch roles for each user
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Map roles to user IDs for quick lookup
      const userRoles: Record<string, string> = {};
      roles.forEach((role: any) => {
        userRoles[role.user_id] = role.role;
      });
      
      // Combine profiles with roles
      const mappedMembers = profiles.map((profile: any): Member => {
        return {
          id: profile.id,
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          email: profile.id, // Using UUID as email since we don't have it in profiles
          role: userRoles[profile.id] || 'member', // Default to member if no role found
          status: 'Active', // Default status
          created_at: profile.created_at
        };
      });
      
      setMembers(mappedMembers);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error fetching members",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemberSuccess = () => {
    setAddMemberOpen(false);
    fetchMembers();
    toast({
      title: "Member added",
      description: "New member has been added successfully."
    });
  };

  const handleEditMemberSuccess = () => {
    setEditMember(null);
    fetchMembers();
    toast({
      title: "Member updated",
      description: "Member information has been updated successfully."
    });
  };

  const handleDeleteMemberSuccess = () => {
    setDeleteMember(null);
    fetchMembers();
    toast({
      title: "Member deleted",
      description: "The member has been deleted successfully."
    });
  };

  // Filter members based on search term and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesRole = roleFilter === 'all' || member.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesRole;
  });

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
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search members..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-300 rounded-md px-4 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select 
            className="border border-gray-300 rounded-md px-4 py-2"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="treasurer">Treasurer</option>
            <option value="member">Member</option>
          </select>
        </div>
        
        {/* Members table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8">
                    Loading members...
                  </TableCell>
                </TableRow>
              ) : filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8">
                    No members found. {isAdmin && searchTerm === '' && 
                      <Button 
                        variant="link" 
                        onClick={() => setAddMemberOpen(true)}
                      >
                        Add a new member
                      </Button>
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.full_name || 'Unknown'}</TableCell>
                    <TableCell>{member.phone_number || 'No phone number'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        member.role === 'treasurer' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {member.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'Active' ? 'bg-green-100 text-green-800' :
                        member.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setEditMember(member)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => setDeleteMember(member)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
