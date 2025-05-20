
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AddMemberFormValues } from './AddMemberFormSchema';

interface UserRoleFieldProps {
  form: UseFormReturn<AddMemberFormValues>;
}

const UserRoleField: React.FC<UserRoleFieldProps> = ({ form }) => {
  return (
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
  );
};

export default UserRoleField;
