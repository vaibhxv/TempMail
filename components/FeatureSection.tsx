'use client';

import { motion } from 'framer-motion';
import { Check, Shield, Zap, Globe, Clock, Lock, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your real information never touches our servers',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate temporary services in milliseconds',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Services available worldwide with local data',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Always accessible whenever you need protection',
  },
  {
    icon: Lock,
    title: 'Secure by Design',
    description: 'Built with security and privacy at the core',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Perfect experience on any device or screen size',
  },
];

export function FeatureSection() {
  return (
    <section className="py-20 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose TempGen?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've built the most comprehensive and secure temporary services platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start space-x-4 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <Check className="w-5 h-5" />
            <span className="font-medium">100% Free • No Registration Required</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}