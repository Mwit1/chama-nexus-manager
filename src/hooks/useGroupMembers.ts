
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group, Member } from '@/types/group';
import { useToast } from "@/components/ui/use-toast";

export function useGroupMembers() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch groups when component mounts
  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('groups')
        .select('id, name');
      
      if (error) throw error;
      
      // Use type assertion to ensure the data is treated as Group[]
      setGroups(data as Group[] || []);
      
      if (data?.length > 0) {
        const firstGroupId = data[0].id;
        setSelectedGroup(firstGroupId);
        return firstGroupId;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error fetching groups",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch members when a group is selected
  const fetchGroupMembers = async (groupId: string) => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      
      // Fixed query to properly join with the profiles table using user_id
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles:user_id (
            full_name,
            phone_number
          )
        `)
        .eq('group_id', groupId);
      
      if (error) throw error;
      
      // Format members data to match the Member type
      const formattedMembers: Member[] = data ? data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        full_name: item.profiles?.full_name || null,
        phone_number: item.profiles?.phone_number || null,
        role: item.role || 'member',
        joined_at: item.joined_at || new Date().toISOString()
      })) : [];
      
      setMembers(formattedMembers);
      return formattedMembers;
      
    } catch (error: any) {
      console.error('Error fetching group members:', error);
      toast({
        title: "Error fetching members",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    groups,
    members,
    selectedGroup,
    loading,
    setSelectedGroup,
    fetchGroups,
    fetchGroupMembers
  };
}
