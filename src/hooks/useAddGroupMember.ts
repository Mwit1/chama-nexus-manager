
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { addMemberFormSchema, AddMemberFormValues } from '@/components/groups/AddMemberFormSchema';

export function useAddGroupMember(groupId: string, onSuccess: () => void) {
  const { toast } = useToast();
  const [searchingUser, setSearchingUser] = useState(false);
  const [userFound, setUserFound] = useState<{ id: string, email: string } | null>(null);

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const handleEmailSearch = async (email: string) => {
    try {
      setSearchingUser(true);
      
      // Search for user profile by email/id
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', email)
        .single();

      if (error || !data) {
        // For demo purposes, we'll accept any email
        if (email.includes('@')) {
          setUserFound({ id: email, email });
          return;
        }
        
        form.setError('email', { 
          type: "manual", 
          message: "User not found with this email address." 
        });
        setUserFound(null);
        return;
      }
      
      setUserFound({ id: data.id, email });
    } catch (error) {
      console.error('Error searching for user:', error);
    } finally {
      setSearchingUser(false);
    }
  };

  const onSubmit = async (values: AddMemberFormValues) => {
    if (!userFound) {
      // Search for the user first
      await handleEmailSearch(values.email);
      return;
    }

    try {
      // Check if user is already a member of this group
      const { data: existingMember, error: checkError } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userFound.id)
        .single();

      if (!checkError && existingMember) {
        toast({
          title: "User already a member",
          description: "This user is already a member of this group.",
          variant: "destructive",
        });
        return;
      }

      // Add user to group
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userFound.id,
          role: values.role,
        });

      if (error) throw error;

      form.reset();
      setUserFound(null);
      onSuccess();
    } catch (error: any) {
      console.error('Error adding group member:', error);
      toast({
        title: "Error adding member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    form.reset();
    setUserFound(null);
  };

  return {
    form,
    searchingUser,
    userFound,
    handleEmailSearch,
    onSubmit,
    resetForm
  };
}
