
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface EmptyGroupsStateProps {
  onCreateGroup: () => void;
}

const EmptyGroupsState: React.FC<EmptyGroupsStateProps> = ({ onCreateGroup }) => {
  return (
    <Card className="mt-8">
      <CardContent className="pt-8 pb-8 text-center">
        <CardDescription>
          You haven't created or joined any groups yet.
          <p className="mt-2">
            <Button 
              variant="outline" 
              onClick={onCreateGroup}
            >
              Create your first group
            </Button>
          </p>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default EmptyGroupsState;
