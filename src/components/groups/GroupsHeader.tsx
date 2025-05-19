
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface GroupsHeaderProps {
  onCreateGroup: () => void;
}

const GroupsHeader: React.FC<GroupsHeaderProps> = ({ onCreateGroup }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Chama Groups</h1>
      <Button 
        className="flex items-center gap-2"
        onClick={onCreateGroup}
      >
        <PlusCircle className="h-4 w-4" />
        Create Group
      </Button>
    </div>
  );
};

export default GroupsHeader;
