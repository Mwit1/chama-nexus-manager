
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
import { ContributionFormValues, Member } from "@/types/contribution";

interface MemberSelectorProps {
  form: UseFormReturn<ContributionFormValues>;
  members: Member[];
  disabled: boolean;
  selectedGroup: string;
}

const MemberSelector: React.FC<MemberSelectorProps> = ({
  form,
  members,
  disabled,
  selectedGroup,
}) => {
  return (
    <FormField
      control={form.control}
      name="user_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Member</FormLabel>
          <Select 
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled || members.length === 0 || !selectedGroup}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.full_name || 'Unknown'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MemberSelector;
