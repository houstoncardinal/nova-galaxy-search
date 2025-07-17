import { NovaHeader } from "@/components/NovaHeader"
import { NovaHero } from "@/components/NovaHero"
import { NovaFeatures } from "@/components/NovaFeatures"
import { NovaMarketplace } from "@/components/NovaMarketplace"
import { NovaFooter } from "@/components/NovaFooter"

const Index = () => {
  return (
    <div className="min-h-screen bg-cosmic">
      <NovaHeader />
      <NovaHero />
      <NovaFeatures />
      <NovaMarketplace />
      <NovaFooter />
    </div>
  );
};

export default Index;
