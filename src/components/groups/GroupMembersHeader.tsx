
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Group } from "@/types/group";

interface GroupMembersHeaderProps {
  group: Group | null;
  canManageMembers: boolean;
  onBackClick: () => void;
  onAddMemberClick: () => void;
}

const GroupMembersHeader: React.FC<GroupMembersHeaderProps> = ({
  group,
  canManageMembers,
  onBackClick,
  onAddMemberClick
}) => {
  return (
    <div className="mb-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={onBackClick}
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
            onClick={onAddMemberClick}
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        )}
      </div>
    </div>
  );
};

export default GroupMembersHeader;
