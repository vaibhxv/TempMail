export function BlogHeader() {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          TempGen Blog
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Insights on privacy, security, and best practices for modern web development
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
            Privacy Tips
          </span>
          <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
            Development Tools
          </span>
          <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
            Security Best Practices
          </span>
        </div>
      </div>
    </div>
  );
}