import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from 'lucide-react';
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
  subcategory?: string;
  date: string;
  note?: string;
}

// Main categories
const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Petrol',
  'Investment',
  'Tea',
  'Snacks',
  'Housing Rent',
  'Entertainment',
  'Health',
  'Shopping',
  'Personal Care',
  'Education',
  'Travel',
  'Gifts',
  'Other',
];

// Subcategories by category
const SUB_CATEGORIES: Record<string, string[]> = {
  'Food & Dining': ['Breakfast', 'Lunch', 'Dinner'],
  Investment: ['Stocks', 'Mutual Fund SIP', 'Mutual Fund Bulk', 'Trading', 'Others'],
  Transportation: ['Bus', 'Train', 'Cab', 'Bike'],
  Health: ['Doctor', 'Medicine', 'Insurance'],
  Shopping: ['Clothes', 'Electronics', 'Groceries'],
  Travel: ['Flight', 'Train', 'Hotel', 'Local Travel'],
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  onSuccess,
  onCancel,
}) => {
  const { addExpense, updateExpense } = useFinance();
  const isEditing = !!expense;

  const [selectedCategory, setSelectedCategory] = useState<string>(
    expense?.category || 'Food & Dining'
  );

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
          subcategory: expense.subcategory || '',
          date: expense.date ? expense.date.substring(0, 10) : '',
          note: expense.note || '',
        }
      : {
          amount: 0,
          category: 'Food & Dining',
          subcategory: '',
          date: new Date().toISOString().substring(0, 10),
        },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    console.log("Form Data: ", data); // Log form data to verify it includes subcategory
    try {
      if (isEditing && expense) {
        await updateExpense(expense.id, data); // Make sure `data` includes subcategory
        toast.success('Expense updated successfully');
      } else {
        await addExpense(data); // Make sure `data` includes subcategory
        toast.success('Expense added successfully');
        reset();
      }

      if (onSuccess) onSuccess();
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
        leftIcon={<span style={{ fontSize: '18px', marginRight: '8px' }}>₹</span>}
        error={errors.amount?.message}
        {...register('amount', {
          required: 'Amount is required',
          min: { value: 0.01, message: 'Amount must be greater than 0' },
          valueAsNumber: true,
        })}
      />

      {/* Main Category */}
      <Select
        id="category"
        label="Category"
        error={errors.category?.message}
        {...register('category', {
          required: 'Category is required',
          onChange: (e) => setSelectedCategory(e.target.value),
        })}
      >
        {EXPENSE_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>

      {/* Subcategory */}
      {SUB_CATEGORIES[selectedCategory] && (
        <Select
          id="subcategory"
          label="Subcategory"
          error={errors.subcategory?.message}
          {...register('subcategory')}
        >
          <option value="">Select subcategory</option>
          {SUB_CATEGORIES[selectedCategory].map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </Select>
      )}

      {/* Date */}
      <Input
        id="date"
        type="date"
        label="Date"
        leftIcon={<Calendar size={18} />}
        error={errors.date?.message}
        {...register('date', { required: 'Date is required' })}
      />

      {/* Note */}
      <TextArea
        id="note"
        label="Note (Optional)"
        placeholder="Add a note about this expense"
        rows={3}
        error={errors.note?.message}
        {...register('note')}
      />

      {/* Buttons */}
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
