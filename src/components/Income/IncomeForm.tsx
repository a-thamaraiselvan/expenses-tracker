import React from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign, Calendar, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { useFinance } from '../../context/FinanceContext';
import toast from 'react-hot-toast';
import { Income } from '../../types';

interface IncomeFormProps {
  income?: Income;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface IncomeFormValues {
  amount: number;
  date: string;
  note: string;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ income, onSuccess, onCancel }) => {
  const { addIncome, updateIncome } = useFinance();
  const isEditing = !!income;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IncomeFormValues>({
    defaultValues: income
      ? {
        amount: income.amount,
        date: income.date ? income.date.substring(0, 10) : '',
        note: income.note || '',
      }
      : {
        date: new Date().toISOString().substring(0, 10),
      },
  });

  const onSubmit = async (data: IncomeFormValues) => {
    try {
      if (isEditing && income) {
        await updateIncome(income.id, data);
        toast.success('Income updated successfully');
      } else {
        await addIncome(data);
        toast.success('Income added successfully');
        reset();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="amount"
        type="number"
        step="0.01"
        label="Amount"
        placeholder="0.00"
        leftIcon={<span className="text-xl">₹</span>} 
        error={errors.amount?.message}
        {...register('amount', {
          required: 'Amount is required',
          min: { value: 0.01, message: 'Amount must be greater than 0' },
          valueAsNumber: true,
        })}
      />


      <Input
        id="date"
        type="date"
        label="Date"
        leftIcon={<Calendar size={18} />}
        error={errors.date?.message}
        {...register('date', { required: 'Date is required' })}
      />

      <TextArea
        id="note"
        label="Note (Optional)"
        placeholder="Add a note about this income"
        rows={3}
        error={errors.note?.message}
        {...register('note')}
      />

      <div className="flex space-x-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Update' : 'Add'} Income
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};