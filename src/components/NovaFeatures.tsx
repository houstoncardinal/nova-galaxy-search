import { Search, Brain, Store, Shield, Zap, Users } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Semantic Search",
    description: "AI-powered search that understands context, intent, and meaning beyond keywords.",
    color: "text-primary"
  },
  {
    icon: Brain,
    title: "AI Assistant",
    description: "Integrated chatbot with powerful tools for analysis, summarization, and creation.",
    color: "text-secondary"
  },
  {
    icon: Store,
    title: "Creator Marketplace",
    description: "Build, share, and monetize AI tools and search extensions with the community.",
    color: "text-accent"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Encrypted searches, private browsing modes, and secure tool sandboxing.",
    color: "text-nova-cyan"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Real-time crawling with smart indexing for instant, relevant results.",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Open Source",
    description: "Modular architecture with community-driven development and transparency.",
    color: "text-nova-violet"
  }
]

export const NovaFeatures = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
            Search Beyond <span className="bg-nova-gradient bg-clip-text text-transparent">Limits</span>
          </h2>
          <p className="text-xl text-muted-foreground font-manrope">
            Nova Search combines cutting-edge AI, powerful tools, and community creativity 
            to redefine how we discover and interact with information.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:bg-card transition-all duration-300 hover:shadow-cosmic"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-nova-gradient rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted/50 ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-semibold font-space mb-4 text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground font-manrope leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}