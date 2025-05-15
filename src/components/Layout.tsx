import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, MessageSquare, FileText, BookOpen, LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">
          <h1>LegalConnect</h1>
        </div>
        
        {/* User info */}
        <div className="p-4 flex items-center space-x-3 border-b border-blue-600">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <p className="text-lg">{user?.name}</p>
            <p className="text-sm text-blue-200 capitalize">{user?.role}</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-800' : 'hover:bg-blue-600'}`
                }
              >
                <Home size={20} className="mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/chat" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-800' : 'hover:bg-blue-600'}`
                }
              >
                <MessageSquare size={20} className="mr-3" />
                Chat
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/documents" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-800' : 'hover:bg-blue-600'}`
                }
              >
                <FileText size={20} className="mr-3" />
                Documents
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/ipc-library" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-800' : 'hover:bg-blue-600'}`
                }
              >
                <BookOpen size={20} className="mr-3" />
                IPC Library
              </NavLink>
            </li>
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center p-3 w-full text-left rounded-lg hover:bg-blue-600"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Layout;