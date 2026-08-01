import HeroCarousel from "./components/HeroCarousel";
import { genres } from "./(genres)/data";
import GenreSection from "./(genres)/GenreSection";
import ContinueReadingContainer from "./(series)/continue-reading/ContinueReadingContainer";
import RankingContainer from "./(series)/ranking/RankingContainer";

const Home = () => {
  return (
    <div className="space-y-10">
      <HeroCarousel />
      <ContinueReadingContainer />
      <RankingContainer title="Popular This Week" />
      <GenreSection title="Genres" items={genres} />
    </div>
  );
};

export default Home;
