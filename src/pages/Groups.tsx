
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGroups } from '@/hooks/useGroups';
import { useAuth } from '@/contexts/AuthContext';
import GroupsTable from '@/components/groups/GroupsTable';
import CreateGroupDialog from '@/components/groups/CreateGroupDialog';

const Groups: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
              <h1 className="text-3xl font-bold text-gray-900">Groups Management</h1>
              <p className="text-gray-600 mt-1">Create and manage your chama groups</p>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={handleCreateGroup}
            >
              <PlusCircle className="h-4 w-4" />
              Create New Group
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border">
          <GroupsTable 
            groups={groups} 
            loading={loading}
            onRefresh={fetchGroups}
          />
        </div>

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
