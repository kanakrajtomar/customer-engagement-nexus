
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Users, 
  MessageSquare,
  ListCheck,
  Search
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center px-6 py-3 text-sm font-medium transition-colors duration-150 rounded-md",
        isActive 
          ? "bg-crm-blue text-white" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      )}
    >
      {icon}
      <span className="ml-4">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "z-20 bg-white shadow-md fixed inset-y-0 left-0 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn(
        "py-6 px-6 flex items-center justify-between border-b border-gray-200",
        isCollapsed && "justify-center"
      )}>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-crm-blue flex items-center justify-center text-white font-bold">
            X
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-xl font-bold text-gray-900">XenoCRM</span>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="h-6 w-6"
          >
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <SidebarLink
              to="/dashboard"
              icon={<Search className="w-5 h-5" />}
              label={isCollapsed ? "" : "Dashboard"}
            />
          </li>
          <li>
            <SidebarLink
              to="/customers"
              icon={<Users className="w-5 h-5" />}
              label={isCollapsed ? "" : "Customers"}
            />
          </li>
          <li>
            <SidebarLink
              to="/campaigns"
              icon={<MessageSquare className="w-5 h-5" />}
              label={isCollapsed ? "" : "Campaigns"}
            />
          </li>
          <li>
            <SidebarLink
              to="/segments"
              icon={<ListCheck className="w-5 h-5" />}
              label={isCollapsed ? "" : "Segments"}
            />
          </li>
        </ul>
      </nav>
      <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-500 text-center">
        {!isCollapsed && <span>Xeno CRM Platform v1.0</span>}
      </div>
    </aside>
  );
};

export default Sidebar;
