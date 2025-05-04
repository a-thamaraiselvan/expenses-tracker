import React from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Tag, FileText, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, TextArea } from '../ui/Input';
import { useFinance } from '../../context/FinanceContext';
import toast from 'react-hot-toast';
import { Expense } from '../../types';

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ExpenseFormValues {
  amount: number;
  category: string;
  date: string;
  note: string;
}

// Predefined expense categories
const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Personal Care',
  'Education',
  'Travel',
  'Gifts & Donations',
  'Other',
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSuccess, onCancel }) => {
  const { addExpense, updateExpense } = useFinance();
  const isEditing = !!expense;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormValues>({
    defaultValues: expense
      ? {
        amount: expense.amount,
        category: expense.category,
        date: expense.date ? expense.date.substring(0, 10) : '',
        note: expense.note || '',
      }
      : {
        date: new Date().toISOString().substring(0, 10),
        category: 'Food & Dining',
      },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      if (isEditing && expense) {
        await updateExpense(expense.id, data);
        toast.success('Expense updated successfully');
      } else {
        await addExpense(data);
        toast.success('Expense added successfully');
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
        label="Amount (₹)"
        placeholder="0.00"
        leftIcon={<span style={{ fontSize: '18px', marginRight: '8px' }}>₹</span>} // Use ₹ symbol here
        error={errors.amount?.message}
        {...register('amount', {
          required: 'Amount is required',
          min: { value: 0.01, message: 'Amount must be greater than 0' },
          valueAsNumber: true,
        })}
      />


      <Select
        id="category"
        label="Category"
        error={errors.category?.message}
        {...register('category', { required: 'Category is required' })}
      >
        {EXPENSE_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>

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
        placeholder="Add a note about this expense"
        rows={3}
        error={errors.note?.message}
        {...register('note')}
      />

      <div className="flex space-x-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Update' : 'Add'} Expense
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
