
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ContributionFormValues } from "@/types/contribution";

interface AmountInputProps {
  form: UseFormReturn<ContributionFormValues>;
  disabled: boolean;
}

const AmountInput: React.FC<AmountInputProps> = ({ form, disabled }) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount (KES)</FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                KES
              </span>
              <Input 
                type="number"
                step="0.01"
                placeholder="0.00" 
                className="pl-12"
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                  field.onChange(value);
                }}
                value={field.value || ''}
                disabled={disabled}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AmountInput;
