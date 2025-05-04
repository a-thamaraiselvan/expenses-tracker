import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ReportFilters, ReportFilterValues } from '../components/Reports/ReportFilters';
import { ReportCharts } from '../components/Reports/ReportCharts';
import { useFinance } from '../context/FinanceContext';

const ReportsPage: React.FC = () => {
  const { isLoading } = useFinance();
  const [filters, setFilters] = useState<ReportFilterValues>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    groupBy: 'month',
    type: 'all',
  });

  const handleApplyFilters = (newFilters: ReportFilterValues) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
        <p className="text-gray-600">Visualize and analyze your financial data</p>
      </motion.div>

      <ReportFilters onApplyFilters={handleApplyFilters} />
      <ReportCharts filters={filters} />
    </div>
  );
};

export default ReportsPage;