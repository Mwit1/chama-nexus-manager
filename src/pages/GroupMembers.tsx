
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
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
import { supabase } from '@/integrations/supabase/client';
import { useGroupMembers, Member } from '@/hooks/useGroupMembers';

const GroupMembers: React.FC = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<{ id: string; name: string; description: string | null } | null>(null);
  const { members, loading, fetchGroupMembers } = useGroupMembers();
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Fetch group details
  useEffect(() => {
    const fetchGroup = async () => {
      if (!groupId || !user) return;
      
      try {
        // Get group details
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', groupId)
          .single();
        
        if (groupError) throw groupError;
        setGroup(groupData);
        
        // Get user's role in this group
        const { data: roleData, error: roleError } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .single();
          
        if (!roleError && roleData) {
          setUserRole(roleData.role);
        }
        
        // Fetch members
        fetchGroupMembers(groupId);
        
      } catch (error: any) {
        console.error('Error fetching group details:', error);
        toast({
          title: "Error",
          description: "Failed to load group details. Please try again.",
          variant: "destructive"
        });
        navigate('/groups');
      }
    };
    
    fetchGroup();
  }, [groupId, user]);

  const handleAddMember = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding new members will be available soon."
    });
  };

  const canManageMembers = userRole === 'admin' || userRole === 'treasurer';

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        {/* Group header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/groups')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{group?.name || 'Loading...'}</h1>
              {group?.description && (
                <p className="text-gray-500">{group.description}</p>
              )}
            </div>
          </div>
          
          {canManageMembers && (
            <Button 
              className="flex items-center gap-2"
              onClick={handleAddMember}
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          )}
        </div>

        {/* Members list */}
        {loading ? (
          <div className="flex justify-center my-8">
            <p>Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <CardDescription>
                This group doesn't have any members yet.
                {canManageMembers && (
                  <p className="mt-2">
                    <Button 
                      variant="outline" 
                      onClick={handleAddMember}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GroupMembers;
