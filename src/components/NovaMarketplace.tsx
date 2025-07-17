import { Star, Download, Zap, Code, FileText, Image } from "lucide-react"
import { NovaButton } from "./ui/nova-button"
import { Badge } from "./ui/badge"

const tools = [
  {
    name: "PDF Analyzer Pro",
    creator: "AI Labs",
    description: "Extract insights, summaries, and key data from any PDF document with advanced AI analysis.",
    rating: 4.9,
    downloads: "12.5k",
    price: "Free",
    icon: FileText,
    category: "Document",
    featured: true
  },
  {
    name: "Code Search Engine",
    creator: "DevTools Inc",
    description: "Search through millions of code repositories with semantic understanding and context.",
    rating: 4.7,
    downloads: "8.2k",
    price: "$9.99",
    icon: Code,
    category: "Development",
    featured: false
  },
  {
    name: "Visual AI Caption",
    creator: "VisionCore",
    description: "Generate detailed captions and analyze images with state-of-the-art computer vision.",
    rating: 4.8,
    downloads: "15.1k",
    price: "Free",
    icon: Image,
    category: "Vision",
    featured: true
  }
]

export const NovaMarketplace = () => {
  return (
    <section className="py-24 bg-nova-surface/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-muted/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border mb-6">
            <Zap className="w-4 h-4 text-accent animate-glow-pulse" />
            <span className="text-sm font-manrope text-muted-foreground">
              Creator Marketplace
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
            Expand Your <span className="bg-nova-gradient bg-clip-text text-transparent">Capabilities</span>
          </h2>
          
          <p className="text-xl text-muted-foreground font-manrope">
            Discover, install, and create AI-powered tools that enhance your search experience.
            Join thousands of creators building the future of search.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className={`relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 hover:shadow-cosmic transition-all duration-300 group ${
                tool.featured ? 'ring-1 ring-primary/20' : ''
              }`}
            >
              {/* Featured Badge */}
              {tool.featured && (
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-nova-gradient text-primary-foreground shadow-nova">
                    Featured
                  </Badge>
                </div>
              )}

              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-space text-foreground">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground font-manrope">by {tool.creator}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {tool.category}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-muted-foreground font-manrope text-sm mb-6 leading-relaxed">
                {tool.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-manrope">{tool.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span className="font-manrope">{tool.downloads}</span>
                  </div>
                </div>
                <div className="text-lg font-semibold font-space text-primary">
                  {tool.price}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <NovaButton 
                  variant={tool.price === "Free" ? "nova" : "cosmic"} 
                  size="sm" 
                  className="flex-1"
                >
                  {tool.price === "Free" ? "Install" : "Buy Now"}
                </NovaButton>
                <NovaButton variant="ghost" size="sm">
                  Preview
                </NovaButton>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <NovaButton size="lg">
            Explore All Tools
          </NovaButton>
          <NovaButton variant="cosmic" size="lg" className="ml-4">
            Become a Creator
          </NovaButton>
        </div>
      </div>
    </section>
  )
}