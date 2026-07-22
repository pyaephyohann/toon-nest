export interface PremiumPlan {
  id: string;
  title: string;
  price: string;
  duration: string;
  badge?: string;
  popular?: boolean;

  features: string[];
}

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}
