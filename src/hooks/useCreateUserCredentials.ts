
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export type MemberForCredentials = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
};

export function useCreateUserCredentials() {
  const [selectedMember, setSelectedMember] = useState<MemberForCredentials | null>(null);
  const [showCreateCredentialsDialog, setShowCreateCredentialsDialog] = useState(false);
  const { toast } = useToast();

  const openCreateCredentialsDialog = (member: MemberForCredentials) => {
    setSelectedMember(member);
    setShowCreateCredentialsDialog(true);
  };

  const closeCreateCredentialsDialog = () => {
    setShowCreateCredentialsDialog(false);
    setSelectedMember(null);
  };

  const handleCreateCredentialsSuccess = () => {
    closeCreateCredentialsDialog();
    toast({
      title: "Credentials created",
      description: "Login credentials have been created successfully.",
    });
  };

  return {
    selectedMember,
    showCreateCredentialsDialog,
    setShowCreateCredentialsDialog,
    openCreateCredentialsDialog,
    closeCreateCredentialsDialog,
    handleCreateCredentialsSuccess
  };
}
