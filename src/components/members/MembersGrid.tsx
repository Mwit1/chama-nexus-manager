
import React from 'react';
import { UserPlus, UserCog, UserX, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AllMember } from '@/hooks/useAllMembers';
import { MemberForCredentials } from '@/hooks/useCreateUserCredentials';

interface MembersGridProps {
  members: AllMember[];
  loading: boolean;
  isAdmin: boolean;
  onAddMember: () => void;
  onEditMember?: (member: AllMember) => void;
  onDeleteMember?: (member: AllMember) => void;
  onCreateCredentials?: (member: MemberForCredentials) => void;
}

const MembersGrid: React.FC<MembersGridProps> = ({
  members,
  loading,
  isAdmin,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onCreateCredentials
}) => {
  const getInitials = (name: string | null) => {
    if (!name) return "UN";
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (name: string | null) => {
    if (!name) return "bg-gray-400";
    
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
    ];
    
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="w-full overflow-hidden">
            <CardContent className="pt-6 flex flex-col items-center">
              <Skeleton className="h-20 w-20 rounded-full mb-4" />
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </CardContent>
            <CardFooter className="flex justify-center gap-2 pb-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold mb-2">No members found</h3>
        <p className="text-gray-500 mb-4">There are no members matching your search criteria.</p>
        <Button onClick={onAddMember} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <Card key={member.id} className="w-full overflow-hidden">
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className={`h-20 w-20 ${getAvatarColor(member.full_name)} text-white text-xl`}>
              <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
            </Avatar>
            <h3 className="mt-4 font-semibold text-lg">{member.full_name || 'Unknown'}</h3>
            <p className="text-gray-500 text-sm">{member.phone_number || 'No phone number'}</p>
            
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={member.role === 'admin' ? 'destructive' : member.role === 'treasurer' ? 'default' : 'outline'}>
                {member.role === 'admin' ? 'Admin' : member.role === 'treasurer' ? 'Treasurer' : 'Member'}
              </Badge>
              <Badge variant="outline">{member.group_name}</Badge>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-wrap justify-center gap-2 pb-4">
            {isAdmin && onEditMember && (
              <Button variant="outline" size="sm" onClick={() => onEditMember(member)} className="flex items-center gap-1">
                <UserCog className="h-4 w-4" />
                Edit
              </Button>
            )}
            
            {isAdmin && onDeleteMember && (
              <Button variant="outline" size="sm" onClick={() => onDeleteMember(member)} className="flex items-center gap-1 text-red-500 hover:text-red-600">
                <UserX className="h-4 w-4" />
                Delete
              </Button>
            )}
            
            {isAdmin && onCreateCredentials && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onCreateCredentials({
                  id: member.user_id,
                  full_name: member.full_name,
                  phone_number: member.phone_number
                })}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
              >
                <KeyRound className="h-4 w-4" />
                Create Login
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MembersGrid;
