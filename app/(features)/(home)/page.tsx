import HeroCarousel from "./components/HeroCarousel";
import { continueReadingData } from "./series/continue-reading/data";
import ContinueReadingSection from "./series/continue-reading/page";

const Home = () => {
  return (
    <div className="space-y-10">
      <HeroCarousel />
      <ContinueReadingSection items={continueReadingData} />
    </div>
  );
};

export default Home;
