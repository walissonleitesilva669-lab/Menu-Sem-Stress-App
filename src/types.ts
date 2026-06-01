export interface UserProfile {
  name: string;
  dietRestrictions: string[]; // 'gluten-free' | 'lactose-free' | 'vegetarian' | 'vegan' | 'low-carb' | 'economical'
  familySize: number;
  weeklyBudget: string;
  prefNotes: string;
  email?: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  baseAmountPerPerson: number; // For scaling
  unit: string;
  category: 'Hortifruti' | 'Carnes' | 'Laticínios' | 'Grãos' | 'Temperos' | 'Congelados' | 'Outros';
  substitutes: string[]; // Exactly 3 alternatives
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number; // in minutes
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: string;
  tags: string[]; // 'Vegetariano', 'Vegano', 'Sem Glúten', 'Sem Lactose', 'Low Carb', 'Econômico'
  ingredients: Ingredient[];
  instructions: string[];
  tips: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  image: string;
}

export interface MealPlanDay {
  dayName: string;
  lunch: Recipe;
  dinner: Recipe;
}

export interface WeeklyMenu {
  weekNumber: number;
  title: string;
  days: MealPlanDay[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetCount: number;
  metric: 'weeks_completed' | 'recipes_cooked' | 'favorites_added' | 'profile_filled' | 'saved_budget';
  unlocked: boolean;
}

export interface EmbalagemGuide {
  id: string;
  name: string;
  category: 'congelador' | 'microondas' | 'forno' | 'banhomaria' | 'vidro';
  description: string;
  pros: string[];
  cons: string[];
  buyLink: string;
  image: string;
  rating: number;
}

export interface PlanOption {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  highlight: boolean;
  savings?: string;
}
