
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone_number')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          form.setValue('fullName', data.full_name || '');
          form.setValue('phoneNumber', data.phone_number || '');
        }

        // Fetch profile picture URL
        try {
          const { data: fileData } = await supabase.storage
            .from('profile_pictures')
            .getPublicUrl(`${user.id}/profile.jpg`);

          if (fileData) {
            // Check if the file exists by making a HEAD request
            const response = await fetch(fileData.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              setProfilePictureUrl(fileData.publicUrl);
            }
          }
        } catch (imgError) {
          console.error('Error fetching profile image:', imgError);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, form, toast]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          phone_number: values.phoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpdate = (url: string) => {
    setProfilePictureUrl(url);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a profile picture to personalize your account</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <ProfilePictureUpload 
                userId={user.id} 
                existingUrl={profilePictureUrl} 
                onUploadComplete={handleProfilePictureUpdate} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Email: </span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium">Account Created: </span>
                  <span className="text-gray-600">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
