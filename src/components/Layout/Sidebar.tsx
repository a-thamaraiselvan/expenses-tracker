import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  DollarSign, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, toggleMobile }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <DollarSign size={20} />, label: 'Income', path: '/income' },
    { icon: <CreditCard size={20} />, label: 'Expenses', path: '/expenses' },
    { icon: <BarChart3 size={20} />, label: 'Reports', path: '/reports' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const overlayVariants = {
    open: { opacity: 1, display: 'block' },
    closed: { opacity: 0, transitionEnd: { display: 'none' } },
  };

  const activeClass = 'bg-primary-50 text-primary-700 border-r-4 border-primary-700';
  const inactiveClass = 'text-gray-600 hover:bg-gray-100';

  const sidebarContent = (
    <>
      <div className="p-4 flex flex-col h-full">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-800">Expense Tracker</h1>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700" 
            onClick={toggleMobile}
          >
            <X size={24} />
          </button>
        </div>
        
        {user && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700">Welcome,</p>
            <p className="text-lg font-bold text-primary-700">{user.username}</p>
          </div>
        )}
        
        <nav className="space-y-1 mb-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive ? activeClass : inactiveClass
                }`
              }
              onClick={() => isMobileOpen && toggleMobile()}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-auto">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          >
            <LogOut size={20} className="mr-3" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-md shadow-md text-gray-700"
        onClick={toggleMobile}
      >
        <Menu size={24} />
      </button>
      
      {/* Mobile overlay */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        initial="closed"
        animate={isMobileOpen ? 'open' : 'closed'}
        variants={overlayVariants}
        onClick={toggleMobile}
      />
      
      {/* Mobile sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 md:hidden overflow-y-auto"
        initial="closed"
        animate={isMobileOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        {sidebarContent}
      </motion.aside>
      
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
};