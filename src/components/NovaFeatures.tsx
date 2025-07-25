import { Search, Brain, Store, Shield, Zap, Users, ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"

const features = [
  {
    icon: Search,
    title: "Semantic Search",
    description: "AI-powered search that understands context, intent, and meaning beyond keywords.",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
    details: "Advanced NLP algorithms analyze your query's intent and context, providing results that match what you're actually looking for, not just keyword matches."
  },
  {
    icon: Brain,
    title: "AI Assistant",
    description: "Integrated chatbot with powerful tools for analysis, summarization, and creation.",
    color: "text-secondary",
    gradient: "from-secondary/20 to-secondary/5",
    details: "Your personal AI companion that can analyze documents, create summaries, generate content, and answer complex questions in real-time."
  },
  {
    icon: Store,
    title: "Creator Marketplace",
    description: "Build, share, and monetize AI tools and search extensions with the community.",
    color: "text-accent",
    gradient: "from-accent/20 to-accent/5",
    details: "Join thousands of creators building the future of search. Create custom AI tools, share them with the community, and earn from your innovations."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Encrypted searches, private browsing modes, and secure tool sandboxing.",
    color: "text-nova-cyan",
    gradient: "from-nova-cyan/20 to-nova-cyan/5",
    details: "Your privacy is our priority. All searches are encrypted, and you have full control over your data with advanced privacy settings."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Real-time crawling with smart indexing for instant, relevant results.",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
    details: "Powered by distributed computing and intelligent caching, Nova delivers results in milliseconds while maintaining accuracy and relevance."
  },
  {
    icon: Users,
    title: "Open Source",
    description: "Modular architecture with community-driven development and transparency.",
    color: "text-nova-violet",
    gradient: "from-nova-violet/20 to-nova-violet/5",
    details: "Built on open-source principles, Nova's modular architecture allows for community contributions and complete transparency in how your data is processed."
  }
]

export const NovaFeatures = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Clean Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(220,100%,60%,0.05),transparent_50%)]" />
      
      {/* Dreamy Edge Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200/50 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 animate-glow-pulse" />
            <span className="text-sm font-manrope text-gray-600">
              Advanced AI Technology
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6 text-gray-800">
            Search Beyond <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Limits</span>
          </h2>
          <p className="text-xl text-gray-600 font-manrope">
            Nova Search combines cutting-edge AI, powerful tools, and community creativity 
            to redefine how we discover and interact with information.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:bg-white transition-all duration-500 hover:shadow-lg hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Animated Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              
              {/* Neural Network Connection Lines */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full animate-neural-connect" 
                     style={{ animationDelay: `${index * 0.5}s` }} />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-500 rounded-full animate-float" 
                     style={{ animationDelay: `${index * 0.3}s` }} />
              </div>
              
              <div className="relative">
                {/* Icon with enhanced animation */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 ${feature.color} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden`}>
                  <feature.icon className="w-8 h-8 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Title with typing effect */}
                <h3 className="text-2xl font-semibold font-space mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 font-manrope leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Detailed explanation (shown on hover) */}
                <div className={`overflow-hidden transition-all duration-500 ${
                  hoveredFeature === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p className="text-sm text-gray-500 font-manrope leading-relaxed">
                    {feature.details}
                  </p>
                </div>

                {/* Learn More Button */}
                <div className={`flex items-center space-x-2 text-blue-600 font-manrope text-sm transition-all duration-300 ${
                  hoveredFeature === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}>
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-500" />
            </div>
          ))}
        </div>

        {/* Interactive Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="text-3xl font-bold font-space text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              99.9%
            </div>
            <div className="text-sm text-gray-600 font-manrope">Accuracy Rate</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-bold font-space text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              &lt;100ms
            </div>
            <div className="text-sm text-gray-600 font-manrope">Response Time</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-bold font-space text-cyan-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              50M+
            </div>
            <div className="text-sm text-gray-600 font-manrope">Documents Indexed</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-bold font-space text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              24/7
            </div>
            <div className="text-sm text-gray-600 font-manrope">AI Availability</div>
          </div>
        </div>
      </div>
    </section>
  )
}