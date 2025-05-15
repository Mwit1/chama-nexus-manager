
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const NavbarUserMenu = () => {
  const { user, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.storage
          .from('profile_pictures')
          .download(`${user.id}/profile.jpg`);
          
        if (error) {
          console.log('Error downloading profile picture:', error);
          return;
        }
        
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log('Error fetching profile picture:', error);
      }
    };
    
    fetchProfilePicture();
    
    return () => {
      // Clean up created URL
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [user]);
  
  // Get first letter of email for fallback
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Profile picture" />
            ) : (
              <AvatarFallback>{getInitials()}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-semibold">
          {user?.email}
        </DropdownMenuItem>
        <Link to="/profile">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserMenu;
