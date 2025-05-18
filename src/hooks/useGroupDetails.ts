
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Member, Group, UserRole } from '@/types/group';
import { User } from '@supabase/supabase-js';

export function useGroupDetails(groupId: string | undefined, user: User | null) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const fetchGroupAndMembers = async () => {
    if (!user || !groupId) return;
    
    try {
      setLoading(true);
      
      // Query groups table
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();
      
      if (groupError) throw groupError;
      if (!groupData) {
        toast({
          title: "Group not found",
          description: "The requested group does not exist.",
          variant: "destructive"
        });
        navigate('/groups');
        return;
      }
      
      setGroup(groupData as Group);
      
      // Fix the group members query by joining the profiles table correctly
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select(`
          id,
          role,
          joined_at,
          user_id,
          profiles:user_id (
            full_name,
            phone_number
          )
        `)
        .eq('group_id', groupId);
      
      if (membersError) throw membersError;
      
      // Fetch the current user's role in this group
      const { data: userRoleData, error: userRoleError } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single();
        
      if (userRoleError && userRoleError.code !== 'PGRST116') {
        // PGRST116 is the error code for "No rows returned", which is expected if user is not a member
        throw userRoleError;
      }
      
      setUserRole(userRoleData?.role as UserRole || null);
      
      // Format members data
      const formattedMembers = membersData.map((member: any) => ({
        id: member.id,
        full_name: member.profiles?.full_name || 'Unknown',
        phone_number: member.profiles?.phone_number || 'No phone number',
        role: member.role,
        joined_at: member.joined_at,
        user_id: member.user_id
      }));
      
      setMembers(formattedMembers);
    } catch (error: any) {
      console.error('Error fetching group details:', error);
      toast({
        title: "Error fetching group details",
        description: error.message,
        variant: "destructive"
      });
      navigate('/groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!groupId) {
      navigate('/groups');
      return;
    }
    
    if (user) {
      fetchGroupAndMembers();
    }
  }, [groupId, user]);

  const canManageMembers = userRole === 'admin' || userRole === 'treasurer';

  return {
    group,
    members,
    loading,
    userRole,
    canManageMembers,
    fetchGroupAndMembers
  };
}
