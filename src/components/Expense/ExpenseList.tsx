import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../ui/Modal';
import { ExpenseForm } from './ExpenseForm';
import { Expense } from '../../types';
import toast from 'react-hot-toast';

export const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense } = useFinance();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [visibleExpenses, setVisibleExpenses] = useState<Expense[]>([]);
  const [loadMore, setLoadMore] = useState(5); // Set initial data to 5

  // Load more expenses when the user scrolls
  const loadMoreExpenses = () => {
    if (expenses.length > visibleExpenses.length) {
      setVisibleExpenses(expenses.slice(0, loadMore + 5)); // Show 5 more
      setLoadMore(loadMore + 5); // Update loadMore counter
    }
  };

  // Handle scroll event to trigger loading more expenses
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom) {
      loadMoreExpenses();
    }
  };

  useEffect(() => {
    setVisibleExpenses(expenses.slice(0, loadMore)); // Initially show 5
  }, [expenses]);

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedExpense) {
      try {
        await deleteExpense(selectedExpense.id);
        toast.success('Expense deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No expense records found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: '400px' }} // Fixed height and scrollable
            onScroll={handleScroll}
          >
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Note</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleExpenses.map((expense) => (
                  <tr key={expense.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-red-600">
                      <div className="flex items-center">
                        <ArrowDownRight className="mr-1" size={16} />
                        ₹{Number(expense.amount).toFixed(2)} {/* Change from $ to ₹ */}
                      </div>
                    </td>

                    <td className="px-6 py-4">{expense.note || '-'}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(expense)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Expense"
        size="md"
      >
        {selectedExpense && (
          <ExpenseForm
            expense={selectedExpense}
            onSuccess={() => setIsEditModalOpen(false)}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this expense record?</p>
          <p>
            <strong>Amount:</strong> ₹{selectedExpense ? Number(selectedExpense.amount ?? 0).toFixed(2) : '0.00'}
            <br />
            <strong>Category:</strong> {selectedExpense?.category}
            <br />
            <strong>Date:</strong> {selectedExpense ? format(new Date(selectedExpense.date), 'MMM dd, yyyy') : ''}
          </p>
          <div className="flex space-x-3">
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
