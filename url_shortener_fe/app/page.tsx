"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BarChart3, Globe2, Link2, Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link2 className="h-8 w-8 text-[#2a5bd7]" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Bitly</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost">Products</Button>
              <Button variant="ghost">Solutions</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="ghost">Resources</Button>
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#2a5bd7] hover:bg-[#2346a6] text-white">Sign up free</Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-white border-b shadow-lg z-50">
            <div className="px-4 py-2 space-y-2">
              <Button variant="ghost" className="w-full justify-start">Products</Button>
              <Button variant="ghost" className="w-full justify-start">Solutions</Button>
              <Button variant="ghost" className="w-full justify-start">Pricing</Button>
              <Button variant="ghost" className="w-full justify-start">Resources</Button>
              <div className="pt-2 border-t">
                <Link href="/login" className="block mb-2">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full bg-[#2a5bd7] hover:bg-[#2346a6] text-white">Sign up free</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#eef4ff] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-8 px-4">
              Short links, big results
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
              A URL shortener built with powerful tools to help you grow and protect your brand.
            </p>
            <div className="max-w-3xl mx-auto px-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="url"
                  placeholder="Shorten your URL"
                  className="flex-grow text-base sm:text-lg py-6"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-[#2a5bd7] hover:bg-[#2346a6] text-white">
                    Get Started for Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="bg-[#eef4ff] rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Globe2 className="h-8 w-8 text-[#2a5bd7]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">URL Shortening</h3>
              <p className="text-gray-600">
                Turn long, unwieldy links into clean, memorable, and trackable short URLs.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#eef4ff] rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-[#2a5bd7]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Link Analytics</h3>
              <p className="text-gray-600">
                Get powerful insights into who is clicking your links and where they're coming from.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#eef4ff] rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-[#2a5bd7]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Link Management</h3>
              <p className="text-gray-600">
                Organize, track, and manage all of your links from one simple dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#2a5bd7] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 px-4">
              More than a free URL shortener
            </h2>
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#2a5bd7] hover:bg-gray-100">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Why Bitly</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><a href="#" className="text-gray-400 hover:text-white">Bitly 101</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Enterprise Class</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><a href="#" className="text-gray-400 hover:text-white">Social Media</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Digital Marketing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Customer Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><a href="#" className="text-gray-400 hover:text-white">Link Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Branded Links</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Mobile Links</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><a href="#" className="text-gray-400 hover:text-white">About Bitly</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2024 Bitly Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}