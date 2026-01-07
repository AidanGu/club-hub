import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Shield, 
  Building2,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Directory')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-amber-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900 hidden sm:block">UCSC Clubs</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to={createPageUrl('Directory')}
                className={`text-sm font-medium transition-colors ${
                  currentPageName === 'Directory' 
                    ? 'text-blue-600' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Directory
              </Link>

              {isAuthenticated && (
                <Link 
                  to={createPageUrl('Portal')}
                  className={`text-sm font-medium transition-colors ${
                    currentPageName === 'Portal' 
                      ? 'text-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Club
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link 
                  to={createPageUrl('Admin')}
                  className={`text-sm font-medium transition-colors ${
                    currentPageName === 'Admin' 
                      ? 'text-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-slate-700">
                        {user?.full_name || user?.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-slate-900">{user?.full_name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Portal')} className="flex items-center gap-2 cursor-pointer">
                        <Building2 className="w-4 h-4" />
                        My Club
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('Admin')} className="flex items-center gap-2 cursor-pointer">
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
              )}

              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-100 py-4">
              <div className="flex flex-col gap-2">
                <Link 
                  to={createPageUrl('Directory')}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Directory
                </Link>
                {isAuthenticated && (
                  <Link 
                    to={createPageUrl('Portal')}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Club
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link 
                    to={createPageUrl('Admin')}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
