'use client';

import Link from 'next/link';
import { Shield, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TempGen</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Protecting your privacy with secure, temporary services. Generate temporary email addresses, 
              phone numbers, and addresses instantly.
            </p>
            <div className="text-sm text-gray-500">
              © 2024 TempGen. All rights reserved.
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/email" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Temporary Email
                </Link>
              </li>
              <li>
                <Link href="/phone" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Temporary Phone
                </Link>
              </li>
              <li>
                <Link href="/address" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Temporary Address
                </Link>
              </li>
              <li>
                <Link href="/credit-card" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Test Credit Cards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}