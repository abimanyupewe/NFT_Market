import Benefits from "../components/Benefits";
import CallToAction from "../components/CallToAction";
import Creator from "../components/Creator";
import FeatureSection from "../components/FeatureSection";
import { HeroSection } from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Statistics from "../components/Statistics";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Statistics />
      <Creator />
      <FeatureSection />
      <HowItWorks/>
      <Benefits/>
      <CallToAction/>
    </div>
  );
};

export default Home;
