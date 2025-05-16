
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { UserPlus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import AddGroupMemberDialog from '@/components/groups/AddGroupMemberDialog';
import EditGroupMemberDialog from '@/components/groups/EditGroupMemberDialog';
import DeleteGroupMemberDialog from '@/components/groups/DeleteGroupMemberDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Member = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  role: string;
  joined_at: string;
  user_id: string;
};

type Group = {
  id: string;
  name: string;
  description: string | null;
};

const GroupMembers: React.FC = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);

  useEffect(() => {
    if (!groupId) {
      navigate('/groups');
      return;
    }
    
    fetchGroupAndMembers();
  }, [groupId, user]);

  const fetchGroupAndMembers = async () => {
    if (!user || !groupId) return;
    
    try {
      setLoading(true);
      
      // Query groups table directly
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
      
      setGroup(groupData);
      
      // Fetch group members with their profiles
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
      
      setUserRole(userRoleData?.role || null);
      
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

  const handleAddMemberSuccess = () => {
    setAddMemberOpen(false);
    fetchGroupAndMembers();
    toast({
      title: "Member added",
      description: "The member has been added to the group successfully."
    });
  };

  const handleEditMemberSuccess = () => {
    setEditMember(null);
    fetchGroupAndMembers();
    toast({
      title: "Member updated",
      description: "Member role has been updated successfully."
    });
  };

  const handleDeleteMemberSuccess = () => {
    setDeleteMember(null);
    fetchGroupAndMembers();
    toast({
      title: "Member removed",
      description: "The member has been removed from the group successfully."
    });
  };

  const canManageMembers = userRole === 'admin' || userRole === 'treasurer';

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={() => navigate('/groups')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{group?.name || 'Loading...'}</h1>
              {group?.description && (
                <p className="text-muted-foreground mt-1">{group.description}</p>
              )}
            </div>
            
            {canManageMembers && (
              <Button 
                className="flex items-center gap-2"
                onClick={() => setAddMemberOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                Add Member
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center my-8">
            <p>Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="pt-8 pb-8 text-center">
              <CardDescription>
                This group doesn't have any members yet.
                {canManageMembers && (
                  <p className="mt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setAddMemberOpen(true)}
                    >
                      Add the first member
                    </Button>
                  </p>
                )}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  {canManageMembers && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.full_name}</TableCell>
                    <TableCell>{member.phone_number}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        member.role === 'treasurer' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {member.role}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(member.joined_at).toLocaleDateString()}</TableCell>
                    {canManageMembers && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Don't show edit/delete actions for the current user */}
                          {member.user_id !== user?.id && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      size="icon" 
                                      variant="outline"
                                      onClick={() => setEditMember(member)}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit role</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              {userRole === 'admin' && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        size="icon" 
                                        variant="destructive"
                                        onClick={() => setDeleteMember(member)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Remove member</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {groupId && (
        <AddGroupMemberDialog 
          open={addMemberOpen} 
          onOpenChange={setAddMemberOpen}
          groupId={groupId}
          onSuccess={handleAddMemberSuccess}
        />
      )}
      
      {editMember && groupId && (
        <EditGroupMemberDialog 
          open={!!editMember} 
          onOpenChange={() => setEditMember(null)}
          groupId={groupId}
          member={editMember}
          onSuccess={handleEditMemberSuccess}
        />
      )}
      
      {deleteMember && groupId && (
        <DeleteGroupMemberDialog 
          open={!!deleteMember} 
          onOpenChange={() => setDeleteMember(null)}
          groupId={groupId}
          member={deleteMember}
          onSuccess={handleDeleteMemberSuccess}
        />
      )}
    </Layout>
  );
};

export default GroupMembers;
