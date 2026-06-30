import HeroCarousel from "./components/HeroCarousel";
import { genres } from "./(genres)/data";
import GenreSection from "./(genres)/page";
import { continueReadingData } from "./(series)/continue-reading/data";
import ContinueReadingSection from "./(series)/continue-reading/page";
import { popularWeek } from "./(series)/ranking/data";
import RankingSection from "./(series)/ranking/page";

const Home = () => {
  return (
    <div className="space-y-10">
      <HeroCarousel />
      <ContinueReadingSection items={continueReadingData} />
      <RankingSection title="Popular This Week" items={popularWeek} />
      <GenreSection title="Genres" items={genres} />
    </div>
  );
};

export default Home;
