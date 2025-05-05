import React, { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  // Pagination logic: slice the expenses based on current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = expenses.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(expenses.length / itemsPerPage);

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
    <div className="overflow-x-auto" style={{ maxHeight: '400px' }}> {/* Set max height here */}
      <table className="min-w-[800px] w-full text-sm text-left">
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
          {currentExpenses.map((expense) => (
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
                  ₹{Number(expense.amount).toFixed(2)}
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


      {/* Pagination */}
      <div className="flex justify-center py-4">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

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
