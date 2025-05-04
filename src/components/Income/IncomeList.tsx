import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../ui/Modal';
import { IncomeForm } from './IncomeForm';
import { Income } from '../../types';
import toast from 'react-hot-toast';

export const IncomeList: React.FC = () => {
  const { incomes, deleteIncome } = useFinance();
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (income: Income) => {
    setSelectedIncome(income);
    setIsEditModalOpen(true);
  };

  const handleDelete = (income: Income) => {
    setSelectedIncome(income);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedIncome) {
      try {
        await deleteIncome(selectedIncome.id);
        toast.success('Income deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        toast.error('Failed to delete income');
      }
    }
  };

  if (!incomes || incomes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No income records found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Income History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Note</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{format(new Date(income.date), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 font-medium text-green-600">
                      <div className="flex items-center">
                        <ArrowUpRight className="mr-1" size={16} />
                        ₹{Number(income.amount ?? 0).toFixed(2)} {/* Change to ₹ */}
                      </div>
                    </td>
                    <td className="px-6 py-4">{income.note || '-'}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        onClick={() => handleEdit(income)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(income)}
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
        title="Edit Income"
        size="md"
      >
        {selectedIncome && (
          <IncomeForm
            income={selectedIncome}
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
          <p>Are you sure you want to delete this income record?</p>
          <p>
            <strong>Amount:</strong> ₹{isNaN(Number(selectedIncome?.amount)) ? '0.00' : Number(selectedIncome.amount).toFixed(2)} {/* Change to ₹ */}
            <br />
            <strong>Date:</strong> {selectedIncome ? format(new Date(selectedIncome.date), 'MMM dd, yyyy') : ''}
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
