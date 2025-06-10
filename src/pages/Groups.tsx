
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import GroupsList from '@/components/groups/GroupsList';
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
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
              <p className="text-gray-600 mt-1">Manage your chama groups and members</p>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={handleCreateGroup}
            >
              <PlusCircle className="h-4 w-4" />
              Create Group
            </Button>
          </div>
        </div>

        <GroupsList 
          groups={groups} 
          loading={loading}
          onRefresh={fetchGroups}
        />

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
