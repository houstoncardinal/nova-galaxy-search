import { Sparkles, Github, Twitter, MessageCircle } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Search", href: "#search" },
    { name: "AI Tools", href: "#tools" },
    { name: "Marketplace", href: "#marketplace" },
    { name: "API", href: "#api" }
  ],
  community: [
    { name: "Discord", href: "#discord" },
    { name: "GitHub", href: "#github" },
    { name: "Creators", href: "#creators" },
    { name: "Blog", href: "#blog" }
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Privacy", href: "#privacy" },
    { name: "Terms", href: "#terms" },
    { name: "Contact", href: "#contact" }
  ]
}

export const NovaFooter = () => {
  return (
    <footer className="bg-nova-deep border-t border-border">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-8 h-8 bg-nova-gradient rounded-lg shadow-nova animate-nova-pulse" />
                <Sparkles className="absolute top-1 left-1 w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-space bg-nova-gradient bg-clip-text text-transparent">
                Nova Search
              </span>
            </div>
            
            <p className="text-muted-foreground font-manrope mb-6 max-w-md">
              The future of search and AI-powered discovery. 
              Join thousands of users exploring the cosmos of knowledge.
            </p>
            
            <div className="flex items-center space-x-4">
              <a 
                href="#github" 
                className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#twitter" 
                className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#discord" 
                className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold font-space text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-manrope"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold font-space text-foreground mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-manrope"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold font-space text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-manrope"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground font-manrope text-sm">
            © 2024 Nova Search. All rights reserved.
          </p>
          <p className="text-muted-foreground font-manrope text-sm mt-4 md:mt-0">
            Built for the future of search and discovery
          </p>
        </div>
      </div>
    </footer>
  )
}