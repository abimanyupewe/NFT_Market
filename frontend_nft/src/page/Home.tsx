import UserSpendSection from "../components/UserSpendSection";
import Statistics from "../components/Statistics";
import Exchange from "../components/Exchange";
import Creator from "../components/Creator";
import FeatureSection from "../components/FeatureSection";
import HowItWorks from "../components/HowItWorks";
import Benefits from "../components/Benefits";
import CallToAction from "../components/CallToAction";
import { HeroSection } from "../components/HeroSection";

const Home = () => {
  return (
    <div className="px-10">
      <HeroSection />
      <Statistics />
      <Exchange />
      <Creator />
      <FeatureSection />
      <UserSpendSection />
      <HowItWorks />
      <Benefits />
      <CallToAction />
    </div>
  );
};

export default Home;
