import { SearchEngine } from "@/components/SearchEngine"
import { NovaFeatures } from "@/components/NovaFeatures"
import { Toaster } from "@/components/ui/toaster"
import heroImage from "@/assets/nova-hero.jpg"

export default function Index() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
      {/* Hero Section with Search */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
          <img 
            src={heroImage} 
            alt="Nova Search Background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
          
          {/* Dreamy Color Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Headline */}
            <div className="space-y-4 mb-12">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200/50 shadow-sm">
                <div className="w-4 h-4 text-blue-600 animate-pulse">⚡</div>
                <span className="text-sm font-medium text-gray-600">
                  Free AI-Powered Web Search Engine
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Nova
                </span>
                <br />
                <span className="text-gray-800">Search</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Search the entire web with advanced AI. Get results from Wikipedia, GitHub, Stack Overflow, 
                Reddit, Hacker News and more - all completely free.
              </p>
            </div>

            {/* Search Engine */}
            <SearchEngine />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto pt-12">
              <div className="text-center group">
                <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">5+</div>
                <div className="text-sm text-gray-600">Search Sources</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform">Free</div>
                <div className="text-sm text-gray-600">Forever</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-cyan-600 group-hover:scale-110 transition-transform">Fast</div>
                <div className="text-sm text-gray-600">Real-time</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">Smart</div>
                <div className="text-sm text-gray-600">AI-Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <NovaFeatures />
      
      {/* Toast Notifications */}
      <Toaster />
    </main>
  );
}
