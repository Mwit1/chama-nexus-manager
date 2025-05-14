
import React from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { 
  Users, 
  PiggyBank, 
  Wallet, 
  CreditCard, 
  Calendar, 
  ChartBar
} from "lucide-react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <PiggyBank className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold text-gray-900">Chama Nexus</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link to="/members" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Members
                </Link>
                <Link to="/contributions" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Contributions
                </Link>
                <Link to="/loans" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Loans
                </Link>
                <Link to="/treasury" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Treasury
                </Link>
                <Link to="/reports" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Reports
                </Link>
                <Link to="/meetings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Meetings
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Sign in
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Chama Nexus. All rights reserved.</p>
            </div>
            <div className="mt-4 flex justify-center md:mt-0">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Terms</span>
                  Terms
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Privacy</span>
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Support</span>
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;
