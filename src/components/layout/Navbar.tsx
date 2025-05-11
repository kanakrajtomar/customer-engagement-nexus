
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, 
  Search, 
  User
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="z-10 py-4 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center w-full max-w-xl mr-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input 
              type="text" 
              placeholder="Search campaigns, customers..." 
              className="pl-10 w-full" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.picture} />
                  <AvatarFallback className="bg-crm-blue text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name || 'User'}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
