
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
      
      // First, get all group members
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('id, user_id, role, joined_at')
        .eq('group_id', groupId);
      
      if (membersError) throw membersError;
      
      const membersWithProfiles: Member[] = [];
      
      if (membersData && membersData.length > 0) {
        // Get all user IDs to fetch their profiles
        const userIds = membersData.map(member => member.user_id);
        
        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, phone_number')
          .in('id', userIds);
        
        if (profilesError) throw profilesError;
        
        // Create a map of profiles by user ID for easy lookup
        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }
        
        // Combine member data with profile data
        membersData.forEach(member => {
          const profile = profilesMap.get(member.user_id);
          membersWithProfiles.push({
            id: member.id,
            user_id: member.user_id,
            full_name: profile?.full_name || null,
            phone_number: profile?.phone_number || null,
            role: member.role || 'member',
            joined_at: member.joined_at || new Date().toISOString()
          });
        });
      }
      
      setMembers(membersWithProfiles);
      return membersWithProfiles;
      
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
