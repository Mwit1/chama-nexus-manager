
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export type Member = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  email: string;
  role: 'admin' | 'treasurer' | 'member';
  status: 'Active' | 'Inactive' | 'Suspended';
  created_at: string;
};

export type UserRole = 'admin' | 'treasurer' | 'member';

export function useMembers() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  const fetchMembers = async (userId?: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Check if current user is an admin - cast role to text to avoid function overloading issue
      const { data: isAdmin, error: roleError } = await supabase
        .rpc('has_role', { 
          user_id: userId, 
          role: 'admin'  // Pass it as a string directly to avoid the overloading issue
        });
        
      if (roleError) throw roleError;
      
      // Set user role with proper type assertion
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
      const userRoles: Record<string, UserRole> = {};
      
      if (roles) {
        roles.forEach((role: any) => {
          // Ensure role is one of the valid UserRole types
          if (role.role === 'admin' || role.role === 'treasurer' || role.role === 'member') {
            userRoles[role.user_id] = role.role as UserRole;
          } else {
            userRoles[role.user_id] = 'member'; // Default to member for unknown roles
          }
        });
      }
      
      // Combine profiles with roles
      const mappedMembers = profiles ? profiles.map((profile: any): Member => {
        return {
          id: profile.id,
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          email: profile.id, // Using UUID as email since we don't have it in profiles
          role: userRoles[profile.id] || 'member', // Default to member if no role found
          status: 'Active', // Default status
          created_at: profile.created_at
        };
      }) : [];
      
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
