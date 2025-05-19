
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import GroupsHeader from '@/components/groups/GroupsHeader';
import GroupsTable from '@/components/groups/GroupsTable';
import EmptyGroupsState from '@/components/groups/EmptyGroupsState';
import CreateGroupDialog from '@/components/groups/CreateGroupDialog';
import { useGroups } from '@/hooks/useGroups';

const Groups: React.FC = () => {
  const { toast } = useToast();
  const { groups, loading, fetchGroups } = useGroups();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateGroup = () => {
    setShowCreateDialog(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    fetchGroups();
    toast({
      title: "Group created",
      description: "Your new group has been created successfully."
    });
  };

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-8">
        <GroupsHeader onCreateGroup={handleCreateGroup} />

        {loading ? (
          <div className="flex justify-center my-8">
            <p>Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <EmptyGroupsState onCreateGroup={handleCreateGroup} />
        ) : (
          <GroupsTable groups={groups} />
        )}

        <CreateGroupDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </Layout>
  );
};

export default Groups;
