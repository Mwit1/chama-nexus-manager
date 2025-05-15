
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePictureUploadProps {
  userId: string;
  existingUrl: string | null;
  onUploadComplete: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  userId,
  existingUrl,
  onUploadComplete
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be less than 5MB",
      });
      return;
    }

    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload the file
    setIsUploading(true);

    try {
      const filePath = `${userId}/profile.jpg`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = await supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);

      onUploadComplete(data.publicUrl);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture",
      });
    } finally {
      setIsUploading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!userId || !previewUrl) return;
    
    try {
      const { error } = await supabase.storage
        .from('profile_pictures')
        .remove([`${userId}/profile.jpg`]);
        
      if (error) {
        throw error;
      }
      
      // Clean up the preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setPreviewUrl(null);
      onUploadComplete('');
      
      toast({
        title: "Profile picture removed",
        description: "Your profile picture has been removed",
      });
    } catch (error: any) {
      console.error('Error deleting profile picture:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: error.message || "Failed to delete profile picture",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    return userId.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Profile picture" />
          ) : (
            <AvatarFallback className="text-4xl">{getInitials()}</AvatarFallback>
          )}
        </Avatar>
        <div 
          className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer"
          onClick={triggerFileInput}
        >
          <Camera className="h-5 w-5 text-white" />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
        
        {previewUrl && (
          <Button 
            type="button" 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteImage}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <p className="text-xs text-gray-500 text-center">
        Recommended: Square image, max 5MB
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
