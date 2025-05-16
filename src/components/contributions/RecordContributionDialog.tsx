
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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  group_id: z.string({
    required_error: "Please select a group.",
  }),
  user_id: z.string({
    required_error: "Please select a member.",
  }),
  amount: z.coerce.number({
    required_error: "Please enter an amount.",
    invalid_type_error: "Amount must be a number.",
  }).positive({
    message: "Amount must be positive.",
  }),
  payment_method: z.enum(['M-Pesa', 'Bank Transfer', 'Cash'], {
    required_error: "Please select a payment method.",
  }),
  description: z.string().optional(),
});

interface RecordContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Group = {
  id: string;
  name: string;
};

type Member = {
  id: string;
  full_name: string | null;
};

const RecordContributionDialog: React.FC<RecordContributionDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_id: "",
      user_id: "",
      amount: undefined,
      payment_method: "M-Pesa",
      description: "",
    },
  });

  // Fetch groups when dialog opens
  useEffect(() => {
    if (open) {
      fetchGroups();
    }
  }, [open]);

  // Fetch members when a group is selected
  useEffect(() => {
    if (selectedGroup) {
      fetchGroupMembers(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      // Type assertion for groups table
      const { data, error } = await supabase
        .from('groups' as any)
        .select('id, name');
      
      if (error) throw error;
      
      setGroups(data || []);
      
      if (data?.length > 0) {
        form.setValue('group_id', data[0].id);
        setSelectedGroup(data[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error fetching groups",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMembers = async (groupId: string) => {
    try {
      setLoading(true);
      form.setValue('user_id', '');
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          user_id,
          profiles:user_id (
            id,
            full_name
          )
        `)
        .eq('group_id', groupId);
      
      if (error) throw error;
      
      // Format members data
      const formattedMembers = data
        .map(item => ({
          id: item.user_id,
          full_name: item.profiles?.full_name
        }))
        .filter(member => member.id); // Filter out any null values
      
      setMembers(formattedMembers);
      
      if (formattedMembers.length > 0) {
        form.setValue('user_id', formattedMembers[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching group members:', error);
      toast({
        title: "Error fetching members",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to record contributions.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Insert contribution record
      const { error } = await supabase
        .from('contributions')
        .insert({
          group_id: values.group_id,
          user_id: values.user_id,
          amount: values.amount,
          payment_method: values.payment_method,
          description: values.description || null,
          recorded_by: user.id,
          contribution_date: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error('Error recording contribution:', error);
      toast({
        title: "Error recording contribution",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Contribution</DialogTitle>
          <DialogDescription>
            Record a new contribution from a group member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedGroup(value);
                    }}
                    value={field.value}
                    disabled={loading || groups.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading || members.length === 0 || !selectedGroup}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.full_name || 'Unknown'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="0.00" 
                      {...field} 
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes..." 
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting || loading ? "Saving..." : "Record Contribution"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordContributionDialog;
