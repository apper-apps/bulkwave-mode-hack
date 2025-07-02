import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusPill from '@/components/molecules/StatusPill';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { path: '/send', icon: 'Send', label: 'Send Message' },
    { path: '/recipients', icon: 'Users', label: 'Recipients' },
    { path: '/categories', icon: 'FolderOpen', label: 'Categories' },
    { path: '/history', icon: 'History', label: 'History' },
    { path: '/settings', icon: 'Settings', label: 'Settings' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-lg"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-whatsapp-500 to-whatsapp-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="MessageSquare" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">BulkWave</h1>
                  <p className="text-xs text-gray-500">WhatsApp Bulk Messaging</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            
            {/* Connection Status */}
            <div className="mt-4">
              <StatusPill status="connected" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-whatsapp-50 to-whatsapp-100 text-whatsapp-700 border-l-4 border-whatsapp-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      className={`w-5 h-5 ${isActive ? 'text-whatsapp-600' : ''}`} 
                    />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2024 BulkWave. All rights reserved.
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;