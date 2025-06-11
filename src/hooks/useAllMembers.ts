
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export type AllMember = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  role: string;
  status?: 'Active' | 'Inactive' | 'Suspended';
  joined_at: string;
  group_id: string;
  group_name: string;
};

export type UserRole = 'admin' | 'treasurer' | 'member';

export function useAllMembers() {
  const { toast } = useToast();
  const [members, setMembers] = useState<AllMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  const fetchMembers = async (userId?: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Check if current user is an admin using the correct function signature
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
        
      if (roleError) {
        console.error('Error checking user role:', roleError);
        throw roleError;
      }
      
      const isAdmin = userRoles?.some(ur => ur.role === 'admin') || false;
      setUserRole(isAdmin ? 'admin' : 'member');
      
      // Fetch all group members with their profiles and group information
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          group_id,
          profiles:user_id (
            full_name,
            phone_number
          ),
          groups:group_id (
            name
          )
        `);
      
      if (membersError) throw membersError;
      
      const formattedMembers = membersData?.map((member: any): AllMember => ({
        id: member.id,
        user_id: member.user_id,
        full_name: member.profiles?.full_name || 'Unknown',
        phone_number: member.profiles?.phone_number || 'No phone number',
        role: member.role || 'member',
        status: 'Active', // Default status
        joined_at: member.joined_at || new Date().toISOString(),
        group_id: member.group_id,
        group_name: member.groups?.name || 'Unknown Group'
      })) || [];
      
      setMembers(formattedMembers);
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

  const handleMemberAdded = () => {
    toast({
      title: "Member added",
      description: "New member has been added successfully."
    });
  };

  const handleMemberUpdated = () => {
    toast({
      title: "Member updated",
      description: "Member information has been updated successfully."
    });
  };

  const handleMemberDeleted = () => {
    toast({
      title: "Member deleted",
      description: "The member has been deleted successfully."
    });
  };

  return {
    members,
    loading,
    userRole,
    fetchMembers,
    handleMemberAdded,
    handleMemberUpdated,
    handleMemberDeleted
  };
}
