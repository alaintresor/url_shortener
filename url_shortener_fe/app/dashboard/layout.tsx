"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Link2, LayoutDashboard, Link, BarChart3, LogOut, Menu, X } from "lucide-react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/store/slices/userSlice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <NextLink href="/" className="flex items-center">
                <Link2 className="h-8 w-8 text-[#2a5bd7]" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Bitly</span>
              </NextLink>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:inline">{user?.username}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden sm:inline-flex"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "block" : "hidden"
            } sm:block fixed sm:relative w-64 bg-white border-r min-h-[calc(100vh-4rem)] p-4 z-50`}
        >
          <nav className="space-y-2">
            <NextLink href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </NextLink>
            <NextLink href="/dashboard/shorten">
              <Button
                variant={isActive("/dashboard/shorten") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link className="mr-2 h-5 w-5" />
                Shorten URL
              </Button>
            </NextLink>
            <NextLink href="/dashboard/analytics">
              <Button
                variant={isActive("/dashboard/analytics") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Analytics
              </Button>
            </NextLink>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-8 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}