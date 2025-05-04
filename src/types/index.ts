export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Income {
  id: number;
  amount: number;
  date: string;
  note: string;
}

export interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
  note: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentIncomes: Income[];
  recentExpenses: Expense[];
  categoryTotals: { category: string; amount: number }[];
}