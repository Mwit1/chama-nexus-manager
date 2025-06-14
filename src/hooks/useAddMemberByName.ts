
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { addMemberByNameFormSchema, AddMemberByNameFormValues } from '@/components/groups/AddMemberByNameFormSchema';

export function useAddMemberByName(groupId: string, onSuccess: () => void) {
  const { toast } = useToast();

  const form = useForm<AddMemberByNameFormValues>({
    resolver: zodResolver(addMemberByNameFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      role: "member",
    },
  });

  const onSubmit = async (values: AddMemberByNameFormValues) => {
    try {
      // First, search for an existing profile with the given name and phone
      const { data: existingProfile, error: profileSearchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', values.fullName)
        .eq('phone_number', values.phoneNumber)
        .single();

      let userId: string;

      if (existingProfile) {
        // User profile exists, use that user ID
        userId = existingProfile.id;
      } else {
        // No existing profile found - we need to create a placeholder profile
        // Since profiles must reference auth.users, we'll create a group member record
        // without a profile for now, indicating this is a "pending" member
        toast({
          title: "Member not found",
          description: "This person doesn't have an account yet. Please ask them to sign up first, or use the regular member invitation feature.",
          variant: "destructive",
        });
        return;
      }

      // Check if user is already a member of this group
      const { data: existingMember, error: checkError } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userId)
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
          user_id: userId,
          role: values.role,
        });

      if (error) throw error;

      form.reset();
      onSuccess();
      toast({
        title: "Member added",
        description: "The member has been successfully added to the group.",
      });
    } catch (error: any) {
      console.error('Error adding group member:', error);
      toast({
        title: "Error adding member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit
  };
}
