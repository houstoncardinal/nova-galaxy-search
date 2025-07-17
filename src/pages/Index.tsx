import { NovaHeader } from "@/components/NovaHeader"
import { NovaHero } from "@/components/NovaHero"
import { NovaFeatures } from "@/components/NovaFeatures"
import { NovaMarketplace } from "@/components/NovaMarketplace"
import { NovaFooter } from "@/components/NovaFooter"
import { ThemeProvider } from "@/contexts/ThemeContext"

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-cosmic transition-all duration-500">
        <NovaHeader />
        <NovaHero />
        <NovaFeatures />
        <NovaMarketplace />
        <NovaFooter />
      </div>
    </ThemeProvider>
  );
};

export default Index;
