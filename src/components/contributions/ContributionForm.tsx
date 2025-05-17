
import React from 'react';
import { useForm } from 'react-hook-form';
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

interface ContributionFormProps {
  onSubmit: (values: ContributionFormValues) => void;
  isSubmitting: boolean;
}

const ContributionForm: React.FC<ContributionFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const form = useForm<ContributionFormValues>({
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
        <GroupSelector form={form} />
        <MemberSelector form={form} />
        <AmountInput form={form} />
        <PaymentMethodSelector form={form} />
        <DescriptionInput form={form} />
        
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
