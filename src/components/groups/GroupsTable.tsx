import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, Users } from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  member_count: number;
}

interface GroupsTableProps {
  groups: Group[];
}

const GroupsTable: React.FC<GroupsTableProps> = ({ groups }) => {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Members</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell className="font-medium">{group.name}</TableCell>
              <TableCell>{group.description || 'No description'}</TableCell>
              <TableCell>{new Date(group.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{group.member_count || 0}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/group-members/${group.id}`)}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GroupsTable;
