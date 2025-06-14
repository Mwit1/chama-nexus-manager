
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AddMemberByNameFormValues } from './AddMemberByNameFormSchema';

interface MemberPhoneFieldProps {
  form: UseFormReturn<AddMemberByNameFormValues>;
}

const MemberPhoneField: React.FC<MemberPhoneFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter phone number" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MemberPhoneField;
