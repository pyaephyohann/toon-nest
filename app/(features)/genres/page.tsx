import { genres } from "./components/data";
import GenreGrid from "./components/GenreGrid";
import GenreSearch from "./components/GenreSearch";
import GenresHeader from "./components/GenresHeader";
import GenreSidebar from "./components/GenreSidebar";
import GenreStats from "./components/GenreStats";
import GenreTags from "./components/GenreTag";
import PopularSeries from "./components/PopularSeries";
import TopGenreCard from "./components/TopGenreCard";
import ViewAllGenres from "./components/ViewAllGenres";

export default function GenresPage() {
  return (
    <div className="space-y-10">
      <GenresHeader />

      <GenreSearch />

      <TopGenreCard
        title="Action"
        image="/banners/the-beginning-after-the-end.jpeg"
        description="Explore thrilling battles, powerful heroes, epic adventures, and unforgettable journeys."
        series={2358}
      />

      <section className="grid gap-8 xl:grid-cols-[1fr_340px]">
        {/* Left */}
        <div className="space-y-8">
          <GenreGrid genres={genres} />

          <ViewAllGenres />
        </div>

        {/* Right */}
        <div className="space-y-8">
          <GenreSidebar />

          <GenreStats />

          <PopularSeries />

          <GenreTags />
        </div>
      </section>
    </div>
  );
}
