import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RegisterForm } from '../components/Auth/RegisterForm';
import { Wallet, BarChart3, TrendingUp } from 'lucide-react';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        <motion.div 
          className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-accent-600 to-accent-800 text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Financial Journey</h2>
            
            <div className="space-y-6">
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-3 bg-white/10 rounded-full">
                  <Wallet size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Personal Finance Management</h3>
                  <p className="text-white/80 text-sm">Take control of your finances with our easy-to-use tracking tools</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-3 bg-white/10 rounded-full">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Insightful Reports</h3>
                  <p className="text-white/80 text-sm">Gain insights from detailed charts and personalized analytics</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="p-3 bg-white/10 rounded-full">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Financial Growth</h3>
                  <p className="text-white/80 text-sm">Make better decisions to achieve your financial goals</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="p-10 lg:p-12 flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-600 mb-8">Join us and start tracking your finances today</p>
          
          <RegisterForm />
          
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;