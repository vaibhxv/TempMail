'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TempGen
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/email" className="text-gray-700 hover:text-blue-600 transition-colors">
              Email
            </Link>
            <Link href="/phone" className="text-gray-700 hover:text-blue-600 transition-colors">
              Phone
            </Link>
            <Link href="/address" className="text-gray-700 hover:text-blue-600 transition-colors">
              Address
            </Link>
            <Link href="/credit-card" className="text-gray-700 hover:text-blue-600 transition-colors">
              Credit Card
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blog
            </Link>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-4">
              <Link href="/email" className="text-gray-700 hover:text-blue-600 transition-colors">
                Email
              </Link>
              <Link href="/phone" className="text-gray-700 hover:text-blue-600 transition-colors">
                Phone
              </Link>
              <Link href="/address" className="text-gray-700 hover:text-blue-600 transition-colors">
                Address
              </Link>
              <Link href="/credit-card" className="text-gray-700 hover:text-blue-600 transition-colors">
                Credit Card
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-fit">
                Get Started
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}