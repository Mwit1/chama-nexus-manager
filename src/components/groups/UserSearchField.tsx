
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AddMemberFormValues } from './AddMemberFormSchema';

interface UserSearchFieldProps {
  form: UseFormReturn<AddMemberFormValues>;
  userFound: { id: string, email: string } | null;
  searchingUser: boolean;
  onSearch: (email: string) => Promise<void>;
}

const UserSearchField: React.FC<UserSearchFieldProps> = ({
  form,
  userFound,
  searchingUser,
  onSearch
}) => {
  return (
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
                onClick={() => onSearch(form.getValues('email'))}
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
  );
};

export default UserSearchField;
