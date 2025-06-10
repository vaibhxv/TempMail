import { Metadata } from 'next';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogGrid } from '@/components/blog/blog-grid';
import { BlogSidebar } from '@/components/blog/blog-sidebar';

export default function BlogPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <BlogHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BlogGrid />
          </div>
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}