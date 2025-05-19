
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  member_count: number;
}

export function useGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get all groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*');
      
      if (groupsError) throw groupsError;
      
      if (!groupsData || groupsData.length === 0) {
        setGroups([]);
        return;
      }
      
      // Get member counts for each group
      const groupsWithCounts = await Promise.all(
        groupsData.map(async (group) => {
          try {
            const { count, error } = await supabase
              .from('group_members')
              .select('*', { count: 'exact', head: true })
              .eq('group_id', group.id);
              
            return {
              ...group,
              member_count: count || 0
            };
          } catch (err) {
            console.error(`Error getting member count for group ${group.id}:`, err);
            return {
              ...group,
              member_count: 0
            };
          }
        })
      );
      
      setGroups(groupsWithCounts);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error fetching groups",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  return {
    groups,
    loading,
    fetchGroups
  };
}
