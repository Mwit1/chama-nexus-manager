
import React, { useState } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  UserPlus, 
  Settings 
} from "lucide-react";
import { Group } from '@/hooks/useGroups';
import AddMemberByNameDialog from './AddMemberByNameDialog';
import { useToast } from '@/components/ui/use-toast';

interface GroupsTableProps {
  groups: Group[];
  loading: boolean;
  onRefresh: () => void;
}

const GroupsTable: React.FC<GroupsTableProps> = ({ groups, loading, onRefresh }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);

  const handleAddMember = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowAddMemberDialog(true);
  };

  const handleAddMemberSuccess = () => {
    setShowAddMemberDialog(false);
    setSelectedGroupId(null);
    onRefresh();
    toast({
      title: "Member added",
      description: "New member has been added to the group successfully."
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading groups...</p>
          </div>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No groups yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first chama group to get started with managing members and contributions.
          </p>
          <Button onClick={onRefresh} variant="outline">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="font-medium text-gray-900">{group.name}</div>
              </TableCell>
              <TableCell>
                <div className="text-gray-600 max-w-xs truncate">
                  {group.description || 'No description'}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Users className="h-3 w-3" />
                  {group.member_count} members
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(group.created_at).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddMember(group.id)}
                    className="flex items-center gap-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/group-members/${group.id}`)}
                    className="flex items-center gap-1"
                  >
                    <Settings className="h-4 w-4" />
                    Manage
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedGroupId && (
        <AddMemberByNameDialog
          open={showAddMemberDialog}
          onOpenChange={setShowAddMemberDialog}
          groupId={selectedGroupId}
          onSuccess={handleAddMemberSuccess}
        />
      )}
    </div>
  );
};

export default GroupsTable;
