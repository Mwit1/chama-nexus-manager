
import React, { useState } from 'react';
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import NavbarUserMenu from './NavbarUserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-primary text-white w-64 flex-shrink-0 transition-all duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-ml-64" : ""
        )}
      >
        <div className="p-4 font-bold text-xl">Chama App</div>
        <nav className="mt-8">
          <ul>
            <li>
              <a href="/" className="block py-2 px-4 hover:bg-primary-foreground/10">Dashboard</a>
            </li>
            <li>
              <a href="/members" className="block py-2 px-4 hover:bg-primary-foreground/10">Members</a>
            </li>
            <li>
              <a href="/groups" className="block py-2 px-4 hover:bg-primary-foreground/10">Groups</a>
            </li>
            <li>
              <a href="/contributions" className="block py-2 px-4 hover:bg-primary-foreground/10">Contributions</a>
            </li>
            <li>
              <a href="/loans" className="block py-2 px-4 hover:bg-primary-foreground/10">Loans</a>
            </li>
            <li>
              <a href="/treasury" className="block py-2 px-4 hover:bg-primary-foreground/10">Treasury</a>
            </li>
            <li>
              <a href="/reports" className="block py-2 px-4 hover:bg-primary-foreground/10">Reports</a>
            </li>
            <li>
              <a href="/meetings" className="block py-2 px-4 hover:bg-primary-foreground/10">Meetings</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <NavbarUserMenu />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
