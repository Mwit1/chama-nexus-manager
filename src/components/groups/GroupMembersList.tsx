
import React from 'react';
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
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Member } from "@/types/group";

interface GroupMembersListProps {
  members: Member[];
  loading: boolean;
  canManageMembers: boolean;
  currentUserId: string | undefined;
  isAdmin: boolean;
  onAddMember: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
}

const GroupMembersList: React.FC<GroupMembersListProps> = ({
  members,
  loading,
  canManageMembers,
  currentUserId,
  isAdmin,
  onAddMember,
  onEditMember,
  onDeleteMember
}) => {
  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <p>Loading members...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-8 pb-8 text-center">
          <CardDescription>
            This group doesn't have any members yet.
            {canManageMembers && (
              <p className="mt-2">
                <Button 
                  variant="outline" 
                  onClick={onAddMember}
                >
                  Add the first member
                </Button>
              </p>
            )}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
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
                    {member.user_id !== currentUserId && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => onEditMember(member)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit role</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {isAdmin && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="destructive"
                                  onClick={() => onDeleteMember(member)}
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
  );
};

export default GroupMembersList;
