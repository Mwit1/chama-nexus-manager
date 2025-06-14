
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AddMemberByNameFormValues } from './AddMemberByNameFormSchema';

interface MemberNameFieldProps {
  form: UseFormReturn<AddMemberByNameFormValues>;
}

const MemberNameField: React.FC<MemberNameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter member's full name" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MemberNameField;
