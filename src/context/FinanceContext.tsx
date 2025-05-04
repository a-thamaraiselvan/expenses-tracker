import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Income, Expense, DashboardSummary } from '../types';
import { useAuth } from './AuthContext';

interface FinanceContextType {
  incomes: Income[];
  expenses: Expense[];
  summary: DashboardSummary | null;
  isLoading: boolean;
  addIncome: (data: Omit<Income, 'id'>) => Promise<void>;
  updateIncome: (id: number, data: Partial<Income>) => Promise<void>;
  deleteIncome: (id: number) => Promise<void>;
  addExpense: (data: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: number, data: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  fetchSummary: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/api';

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchIncomes = async () => {
    if (!isAuthenticated || !token) return;
    
    try {
      const res = await axios.get(`${API_URL}/incomes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIncomes(res.data);
    } catch (err) {
      console.error('Error fetching incomes:', err);
    }
  };

  const fetchExpenses = async () => {
    if (!isAuthenticated || !token) return;
    
    try {
      const res = await axios.get(`${API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const fetchSummary = async () => {
    if (!isAuthenticated || !token) return;
    
    try {
      const res = await axios.get(`${API_URL}/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        await Promise.all([fetchIncomes(), fetchExpenses(), fetchSummary()]);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  const addIncome = async (data: Omit<Income, 'id'>) => {
    try {
      await axios.post(`${API_URL}/incomes`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchIncomes();
      await fetchSummary();
    } catch (err) {
      console.error('Error adding income:', err);
      throw err;
    }
  };

  const updateIncome = async (id: number, data: Partial<Income>) => {
    try {
      await axios.put(`${API_URL}/incomes/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchIncomes();
      await fetchSummary();
    } catch (err) {
      console.error('Error updating income:', err);
      throw err;
    }
  };

  const deleteIncome = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/incomes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchIncomes();
      await fetchSummary();
    } catch (err) {
      console.error('Error deleting income:', err);
      throw err;
    }
  };

  const addExpense = async (data: Omit<Expense, 'id'>) => {
    try {
      await axios.post(`${API_URL}/expenses`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchExpenses();
      await fetchSummary();
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  };

  const updateExpense = async (id: number, data: Partial<Expense>) => {
    try {
      await axios.put(`${API_URL}/expenses/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchExpenses();
      await fetchSummary();
    } catch (err) {
      console.error('Error updating expense:', err);
      throw err;
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchExpenses();
      await fetchSummary();
    } catch (err) {
      console.error('Error deleting expense:', err);
      throw err;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        expenses,
        summary,
        isLoading,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        fetchSummary,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};