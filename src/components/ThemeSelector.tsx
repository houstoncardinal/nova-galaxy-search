import { Palette, Monitor } from "lucide-react"
import { NovaButton } from "./ui/nova-button"
import { useTheme } from "@/contexts/ThemeContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = [
  { 
    id: 'cosmic' as const, 
    name: 'Cosmic Blue', 
    preview: 'bg-gradient-to-r from-blue-500 to-purple-600',
    description: 'Deep space with electric blues'
  },
  { 
    id: 'matrix' as const, 
    name: 'Matrix Green', 
    preview: 'bg-gradient-to-r from-green-400 to-emerald-600',
    description: 'Digital rain aesthetic'
  },
  { 
    id: 'neon' as const, 
    name: 'Neon Violet', 
    preview: 'bg-gradient-to-r from-purple-500 to-pink-600',
    description: 'Cyberpunk neon glow'
  },
  { 
    id: 'solar' as const, 
    name: 'Solar Flare', 
    preview: 'bg-gradient-to-r from-orange-400 to-red-600',
    description: 'Burning star energy'
  }
]

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NovaButton variant="ghost" size="icon" className="relative overflow-hidden group">
          <Palette className="w-4 h-4 transition-transform group-hover:scale-110" />
          <div className="absolute inset-0 bg-nova-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
        </NovaButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-card/95 backdrop-blur-xl border-border shadow-cosmic"
      >
        <div className="p-3">
          <div className="flex items-center space-x-2 mb-3">
            <Monitor className="w-4 h-4 text-primary" />
            <span className="font-semibold font-space text-foreground">Theme Selection</span>
          </div>
          
          <div className="space-y-2">
            {themes.map((themeOption) => (
              <DropdownMenuItem
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className={`w-full p-3 rounded-xl cursor-pointer transition-all hover:bg-muted/50 ${
                  theme === themeOption.id ? 'bg-muted border border-primary/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`w-8 h-8 rounded-lg ${themeOption.preview} shadow-lg`} />
                  <div className="flex-1">
                    <div className="font-medium font-space text-foreground">
                      {themeOption.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-manrope">
                      {themeOption.description}
                    </div>
                  </div>
                  {theme === themeOption.id && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-nova-pulse" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}