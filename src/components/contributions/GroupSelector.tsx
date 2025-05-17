
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ContributionFormValues, Group } from "@/types/contribution";

interface GroupSelectorProps {
  form: UseFormReturn<ContributionFormValues>;
  groups: Group[];
  onGroupChange: (value: string) => void;
  disabled: boolean;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  form,
  groups,
  onGroupChange,
  disabled,
}) => {
  return (
    <FormField
      control={form.control}
      name="group_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Group</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onGroupChange(value);
            }}
            value={field.value}
            disabled={disabled || groups.length === 0}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GroupSelector;
