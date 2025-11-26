import Benefits from "../components/Benefits";
import CallToAction from "../components/CallToAction";
import Creator from "../components/Creator";
import Exchange from "../components/Exchange";
import FeatureSection from "../components/FeatureSection";
import { HeroSection } from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Statistics from "../components/Statistics";

const Home = () => {
  return (
    <div className="px-10">
      <HeroSection />
      <Statistics />
      <Exchange />
      <Creator />
      <FeatureSection />
      <HowItWorks />
      <Benefits />
      <CallToAction />
    </div>
  );
};

export default Home;
