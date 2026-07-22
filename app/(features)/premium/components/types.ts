export interface PremiumPlan {
  id: string;
  title: string;
  price: string;
  duration: string;
  popular?: boolean;
  badge?: string;
  features: string[];
}

export interface PremiumBenefit {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
