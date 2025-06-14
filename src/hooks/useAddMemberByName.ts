
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
      // First, create or find a user profile with the given name and phone
      const { data: existingProfile, error: profileSearchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', values.fullName)
        .eq('phone_number', values.phoneNumber)
        .single();

      let userId: string;

      if (!existingProfile) {
        // Create a new profile with a generated UUID
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: crypto.randomUUID(),
            full_name: values.fullName,
            phone_number: values.phoneNumber
          })
          .select('id')
          .single();

        if (createProfileError) throw createProfileError;
        userId = newProfile.id;
      } else {
        userId = existingProfile.id;
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
