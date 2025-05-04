import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoginForm } from '../components/Auth/LoginForm';
import { LineChart, PiggyBank, DollarSign } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        <motion.div 
          className="p-10 lg:p-12 flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Sign in to your account to continue</p>
          
          <LoginForm />
          
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
        
        <motion.div 
          className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-primary-600 to-primary-800 text-white"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Manage Your Finances</h2>
            
            <div className="space-y-6">
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-3 bg-white/10 rounded-full">
                  <DollarSign size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Track Your Income & Expenses</h3>
                  <p className="text-white/80 text-sm">Keep track of all your financial transactions in one place</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-3 bg-white/10 rounded-full">
                  <LineChart size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Visualize Your Spending</h3>
                  <p className="text-white/80 text-sm">See where your money goes with interactive charts and reports</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="p-3 bg-white/10 rounded-full">
                  <PiggyBank size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Plan For Your Future</h3>
                  <p className="text-white/80 text-sm">Make informed financial decisions and save more</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;