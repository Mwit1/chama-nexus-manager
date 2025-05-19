
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
    if (!groupId) return [];
    
    try {
      setLoading(true);
      console.log(`Fetching members for group ${groupId}`);
      
      // Get all group members for the specified group
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId);
      
      if (membersError) {
        console.error('Error fetching group members:', membersError);
        throw membersError;
      }
      
      console.log('Group members data:', membersData);
      
      if (!membersData || membersData.length === 0) {
        setMembers([]);
        return [];
      }
      
      // Filter out any members with null user_id
      const validMembers = membersData.filter(member => member.user_id);
      
      if (validMembers.length === 0) {
        setMembers([]);
        return [];
      }
      
      const userIds = validMembers.map(member => member.user_id);
      console.log('User IDs to fetch profiles for:', userIds);
      
      // Fetch profiles for these users in a separate query
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      console.log('Profiles data:', profilesData);
      
      // Create a map of profiles by user ID for easy lookup
      const profilesMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }
      
      // Combine member data with profile data
      const membersWithProfiles = validMembers.map(member => {
        const profile = profilesMap.get(member.user_id) || {};
        
        return {
          id: member.id,
          user_id: member.user_id,
          full_name: profile.full_name || null,
          phone_number: profile.phone_number || null,
          role: member.role || 'member',
          joined_at: member.joined_at || new Date().toISOString()
        };
      });
      
      console.log('Processed members with profiles:', membersWithProfiles);
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
