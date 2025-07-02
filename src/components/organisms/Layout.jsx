import React, { useState, useContext } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import { AuthContext } from '@/App';
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authContext = useContext(AuthContext);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuToggle={() => setSidebarOpen(true)}
          onLogout={authContext?.logout}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;