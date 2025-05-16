
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Users } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import CreateGroupDialog from '@/components/groups/CreateGroupDialog';
import EditGroupDialog from '@/components/groups/EditGroupDialog';
import DeleteGroupDialog from '@/components/groups/DeleteGroupDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';

type Group = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  member_count: number;
  is_creator: boolean;
};

const Groups: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Query the groups table directly
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (!data) {
        setGroups([]);
        return;
      }
      
      // Get member counts for each group
      const groupsWithMemberCounts = await Promise.all(
        data.map(async (group: any) => {
          const { count, error: countError } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);
            
          if (countError) throw countError;
          
          return {
            ...group,
            member_count: count || 0,
            is_creator: group.created_by === user.id
          };
        })
      );
      
      setGroups(groupsWithMemberCounts);
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

  const handleCreateGroupSuccess = () => {
    setCreateGroupOpen(false);
    fetchGroups();
    toast({
      title: "Group created",
      description: "Your group has been created successfully."
    });
  };

  const handleEditGroupSuccess = () => {
    setEditGroup(null);
    fetchGroups();
    toast({
      title: "Group updated",
      description: "Group information has been updated successfully."
    });
  };

  const handleDeleteGroupSuccess = () => {
    setDeleteGroup(null);
    fetchGroups();
    toast({
      title: "Group deleted",
      description: "The group has been deleted successfully."
    });
  };

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chama Groups</h1>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setCreateGroupOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Create Group
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center my-8">
            <p>Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="pt-8 pb-8 text-center">
              <CardDescription>
                You haven't created or joined any groups yet.
                <p className="mt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCreateGroupOpen(true)}
                  >
                    Create your first group
                  </Button>
                </p>
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.description || "No description"}</TableCell>
                    <TableCell>{group.member_count}</TableCell>
                    <TableCell>{new Date(group.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="outline"
                                asChild
                              >
                                <Link to={`/group-members/${group.id}`}>
                                  <Users className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View members</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {group.is_creator && (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="outline"
                                    onClick={() => setEditGroup(group)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit group</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="destructive"
                                    onClick={() => setDeleteGroup(group)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete group</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CreateGroupDialog 
        open={createGroupOpen} 
        onOpenChange={setCreateGroupOpen}
        onSuccess={handleCreateGroupSuccess}
      />
      
      {editGroup && (
        <EditGroupDialog 
          open={!!editGroup} 
          onOpenChange={() => setEditGroup(null)}
          group={editGroup}
          onSuccess={handleEditGroupSuccess}
        />
      )}
      
      {deleteGroup && (
        <DeleteGroupDialog 
          open={!!deleteGroup} 
          onOpenChange={() => setDeleteGroup(null)}
          group={deleteGroup}
          onSuccess={handleDeleteGroupSuccess}
        />
      )}
    </Layout>
  );
};

export default Groups;
