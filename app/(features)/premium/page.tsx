import {
  PremiumHeader,
  HeroBanner,
  PlanToggle,
  PricingSection,
  PremiumBenefits,
  MembersCard,
  FAQCard,
  LoyaltyBanner,
  SecurityFeatures,
} from "./components";

export default function PremiumPage() {
  return (
    <div className="space-y-8">
      <PremiumHeader />

      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        {/* LEFT */}
        <div className="space-y-8">
          <HeroBanner />

          <PlanToggle />

          <PricingSection />

          <LoyaltyBanner />

          <SecurityFeatures />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <PremiumBenefits />

          <MembersCard />

          <FAQCard />
        </div>
      </div>
    </div>
  );
}
