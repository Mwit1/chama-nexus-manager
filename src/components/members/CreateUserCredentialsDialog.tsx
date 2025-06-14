
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface CreateUserCredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  member: {
    id: string;
    full_name: string | null;
    phone_number: string | null;
  } | null;
}

const CreateUserCredentialsDialog: React.FC<CreateUserCredentialsDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  member
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (open && member) {
      // Suggest an email based on the member's name if available
      if (member.full_name) {
        const suggestedEmail = `${member.full_name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
        form.setValue('email', suggestedEmail);
      }
    }
  }, [open, member, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!member) {
        toast({
          title: "Error",
          description: "Member information is missing",
          variant: "destructive",
        });
        return;
      }

      // Admin creates the user account directly through the admin API
      // In a real application, this would be done through a secure admin API
      // For this demo, we'll use the Supabase admin functions
      const { data, error } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true, // Auto-confirm the email so the user can login right away
        user_metadata: {
          full_name: member.full_name
        }
      });

      if (error) {
        // If we get an error about admin functions not being available, show a specific message
        if (error.message.includes("admin")) {
          toast({
            title: "Admin API not available",
            description: "This feature requires Supabase admin functions which are not available in the client. In a real application, this would be handled by a secure server-side function.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      // Update the profile to link it to the new auth user
      if (data.user) {
        // Link the existing profile to the new auth user if needed
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ id: data.user.id })
          .eq('id', member.id);
          
        if (updateError) {
          console.error('Error updating profile:', updateError);
        }
      }

      form.reset();
      toast({
        title: "Account created",
        description: `Login credentials have been created for ${member.full_name}`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error creating user credentials:', error);
      toast({
        title: "Error creating credentials",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Login Credentials</DialogTitle>
          <DialogDescription>
            {member && (
              <>Create login credentials for <strong>{member.full_name}</strong></>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm password" {...field} />
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
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserCredentialsDialog;
