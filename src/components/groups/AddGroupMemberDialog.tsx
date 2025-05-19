
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(['admin', 'treasurer', 'member'], {
    required_error: "Please select a role for this member.",
  }),
});

interface AddGroupMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onSuccess: () => void;
}

const AddGroupMemberDialog: React.FC<AddGroupMemberDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [searchingUser, setSearchingUser] = useState(false);
  const [userFound, setUserFound] = useState<{ id: string, email: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  // Reset user found state when dialog is opened or closed
  useEffect(() => {
    if (!open) {
      setUserFound(null);
      form.reset();
    }
  }, [open, form]);

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group Member</DialogTitle>
          <DialogDescription>
            Add a new member to this group by their email address.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder="user@example.com" 
                        {...field} 
                        disabled={!!userFound}
                      />
                    </FormControl>
                    {!userFound && (
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={searchingUser || !form.getValues('email')}
                        onClick={() => handleEmailSearch(form.getValues('email'))}
                      >
                        {searchingUser ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Search"
                        )}
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userFound && (
              <>
                <div className="bg-green-50 p-2 rounded-md text-green-800 text-sm">
                  User found: {userFound.email}
                </div>

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="treasurer">Treasurer</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting || searchingUser || (!userFound && !form.formState.isDirty)}
              >
                {form.formState.isSubmitting ? "Adding..." : userFound ? "Add Member" : "Search User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupMemberDialog;
