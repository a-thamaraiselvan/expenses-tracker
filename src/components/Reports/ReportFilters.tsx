import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';

interface ReportFiltersProps {
  onApplyFilters: (filters: ReportFilterValues) => void;
}

export interface ReportFilterValues {
  startDate: string;
  endDate: string;
  groupBy: 'day' | 'week' | 'month' | 'category';
  type: 'all' | 'income' | 'expense';
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ onApplyFilters }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFilterValues>({
    defaultValues: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 10),
      endDate: new Date().toISOString().substring(0, 10),
      groupBy: 'month',
      type: 'all',
    },
  });

  const onSubmit = (data: ReportFilterValues) => {
    onApplyFilters(data);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <Input
              id="startDate"
              type="date"
              label="Start Date"
              error={errors.startDate?.message}
              {...register('startDate', { required: 'Required' })}
            />
          </div>
          <div>
            <Input
              id="endDate"
              type="date"
              label="End Date"
              error={errors.endDate?.message}
              {...register('endDate', { required: 'Required' })}
            />
          </div>
          <div>
            <Select
              id="groupBy"
              label="Group By"
              error={errors.groupBy?.message}
              {...register('groupBy', { required: 'Required' })}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="category">Category</option>
            </Select>
          </div>
          <div>
            <Select
              id="type"
              label="Type"
              error={errors.type?.message}
              {...register('type', { required: 'Required' })}
            >
              <option value="all">All</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </Select>
          </div>
          <div>
            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};