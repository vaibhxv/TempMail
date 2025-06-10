'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Mail,
    title: 'Temporary Email',
    description: 'Generate disposable email addresses with real inbox functionality',
    href: '/email',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
  },
  {
    icon: Phone,
    title: 'Temporary Phone',
    description: 'Get temporary phone numbers for SMS verification',
    href: '/phone',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'from-green-50 to-green-100',
  },
  {
    icon: MapPin,
    title: 'Temporary Address',
    description: 'Generate realistic addresses based on your location',
    href: '/address',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
  },
  {
    icon: CreditCard,
    title: 'Test Credit Cards',
    description: 'Generate valid test credit card numbers for development',
    href: '/credit-card',
    gradient: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-50 to-orange-100',
  },
];

export function ServiceGrid() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Privacy Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive suite of temporary services designed to protect your privacy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href={service.href}>
                <div className={`p-8 rounded-3xl bg-gradient-to-br ${service.bgGradient} border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-white group-hover:shadow-md transition-all duration-300"
                  >
                    Try Now
                  </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}