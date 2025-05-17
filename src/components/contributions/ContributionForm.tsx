
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContributionFormValues } from "./ContributionFormSchema";
import GroupSelector from "./GroupSelector";
import MemberSelector from "./MemberSelector";
import AmountInput from "./AmountInput";
import PaymentMethodSelector from "./PaymentMethodSelector";
import DescriptionInput from "./DescriptionInput";
import { Group, Member } from "@/types/contribution";

interface ContributionFormProps {
  form: UseFormReturn<ContributionFormValues>;
  groups: Group[];
  members: Member[];
  loading: boolean;
  selectedGroup: string;
  onGroupChange: (groupId: string) => void;
  onOpenChange: (open: boolean) => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({
  form,
  groups,
  members,
  loading,
  selectedGroup,
  onGroupChange,
  onOpenChange,
}) => {
  return (
    <form onSubmit={form.handleSubmit} className="space-y-4 py-2">
      <GroupSelector
        form={form}
        groups={groups}
        onGroupChange={onGroupChange}
        disabled={loading}
      />
      
      <MemberSelector
        form={form}
        members={members}
        disabled={loading}
        selectedGroup={selectedGroup}
      />
      
      <AmountInput form={form} disabled={loading} />
      
      <PaymentMethodSelector form={form} disabled={loading} />
      
      <DescriptionInput form={form} disabled={loading} />
      
      <DialogFooter className="pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting || loading ? "Saving..." : "Record Contribution"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ContributionForm;
