
import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contributionFormSchema } from './ContributionFormSchema';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ContributionFormValues } from "@/types/contribution";
import GroupSelector from './GroupSelector';
import MemberSelector from './MemberSelector';
import AmountInput from './AmountInput';
import PaymentMethodSelector from './PaymentMethodSelector';
import DescriptionInput from './DescriptionInput';
import { Group, Member } from "@/types/contribution";

interface ContributionFormProps {
  onSubmit: (values: ContributionFormValues) => void;
  isSubmitting?: boolean;
  form?: UseFormReturn<ContributionFormValues>;
  groups?: Group[];
  members?: Member[];
  loading?: boolean;
  selectedGroup?: string;
  onGroupChange?: (groupId: string) => void;
  onOpenChange?: (open: boolean) => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({
  onSubmit,
  isSubmitting = false,
  form: externalForm,
  groups = [],
  members = [],
  loading = false,
  selectedGroup = '',
  onGroupChange,
  onOpenChange
}) => {
  // Use provided form or create a local one if not provided
  const form = externalForm || useForm<ContributionFormValues>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      group_id: '',
      user_id: '',
      amount: 0,
      payment_method: 'M-Pesa',
      description: ''
    }
  });

  const handleSubmit = (data: ContributionFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <GroupSelector 
          form={form} 
          groups={groups} 
          onGroupChange={onGroupChange || (() => {})} 
          disabled={loading || isSubmitting} 
        />
        
        <MemberSelector 
          form={form} 
          members={members} 
          disabled={loading || isSubmitting} 
          selectedGroup={selectedGroup}
        />
        
        <AmountInput 
          form={form} 
          disabled={loading || isSubmitting} 
        />
        
        <PaymentMethodSelector 
          form={form} 
          disabled={loading || isSubmitting} 
        />
        
        <DescriptionInput 
          form={form} 
          disabled={loading || isSubmitting} 
        />
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Recording..." : "Record Contribution"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContributionForm;
