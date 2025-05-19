
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export interface Group {
  id: string;
  name: string;
  description: string | null;
}

export interface Member {
  id: string;
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  role: string;
  joined_at: string;
}

export function useGroupMembers() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('groups')
        .select('id, name, description');
      
      if (error) {
        console.error('Error fetching groups:', error);
        toast({
          title: "Error fetching groups",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      const groupData = data as Group[] || [];
      setGroups(groupData);
      
      if (groupData.length > 0) {
        const firstGroupId = groupData[0].id;
        setSelectedGroup(firstGroupId);
        return firstGroupId;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error in fetchGroups:', error);
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

  // Fetch members for a specific group with a simplified approach
  const fetchGroupMembers = async (groupId: string) => {
    if (!groupId) return [];
    
    try {
      setLoading(true);
      console.log('Fetching members for group:', groupId);
      
      // First get the group members
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('id, user_id, role, joined_at')
        .eq('group_id', groupId);
      
      if (memberError) {
        console.error('Error fetching group members:', memberError);
        toast({
          title: "Error fetching group members",
          description: memberError.message,
          variant: "destructive"
        });
        setMembers([]);
        return [];
      }
      
      if (!memberData || memberData.length === 0) {
        console.log('No members found for this group');
        setMembers([]);
        return [];
      }
      
      console.log('Group members found:', memberData.length);
      
      // Get user IDs that are not null
      const userIds = memberData
        .filter(member => member.user_id)
        .map(member => member.user_id);
      
      if (userIds.length === 0) {
        console.log('No valid user IDs found');
        setMembers([]);
        return [];
      }
      
      // Fetch user profiles separately
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number')
        .in('id', userIds);
      
      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        toast({
          title: "Error fetching user profiles",
          description: profileError.message,
          variant: "destructive"
        });
      }
      
      // Create a map of profiles for easy lookup
      const profileMap = new Map();
      if (profileData) {
        profileData.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }
      
      // Combine the data
      const combinedMembers = memberData.map(member => {
        const profile = member.user_id ? profileMap.get(member.user_id) : null;
        
        return {
          id: member.id,
          user_id: member.user_id,
          full_name: profile?.full_name || 'Unknown User',
          phone_number: profile?.phone_number || 'No phone number',
          role: member.role || 'member',
          joined_at: member.joined_at || new Date().toISOString()
        };
      });
      
      console.log('Combined members data:', combinedMembers);
      setMembers(combinedMembers);
      return combinedMembers;
      
    } catch (error: any) {
      console.error('Error in fetchGroupMembers:', error);
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
