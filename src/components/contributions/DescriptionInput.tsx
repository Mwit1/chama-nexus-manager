
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ContributionFormValues } from "@/types/contribution";

interface DescriptionInputProps {
  form: UseFormReturn<ContributionFormValues>;
  disabled: boolean;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ form, disabled }) => {
  return (
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
              disabled={disabled}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionInput;
