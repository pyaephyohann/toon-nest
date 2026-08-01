import HeroCarouselContainer from "./components/HeroCarouselContainer";
import { genres } from "./(genres)/data";
import GenreSection from "./(genres)/GenreSection";
import ContinueReadingContainer from "./(series)/continue-reading/ContinueReadingContainer";
import RankingContainer from "./(series)/ranking/RankingContainer";
import TrendingSectionContainer from "./components/TrendingSectionContainer";
import LatestUpdatesContainer from "./components/LatestUpdatesContainer";
import CompletedContainer from "./components/CompletedContainer";
import RecommendedContainer from "./components/RecommendedContainer";

const Home = () => {
  return (
    <div className="space-y-10">
      <HeroCarouselContainer />
      <ContinueReadingContainer />
      <TrendingSectionContainer />
      <LatestUpdatesContainer />
      <RankingContainer title="Popular This Week" />
      <CompletedContainer />
      <RecommendedContainer />
      <GenreSection title="Genres" items={genres} />
    </div>
  );
};

export default Home;
