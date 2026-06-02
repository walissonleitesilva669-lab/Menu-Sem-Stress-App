import Logo from './components/Logo';
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  ShoppingBag, 
  Layers, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  UtensilsCrossed, 
  Heart, 
  Undo2, 
  Lock, 
  ThumbsUp, 
  Check, 
  Copy,
  Plus, 
  Trash2, 
  User, 
  Award, 
  Download, 
  Printer, 
  Search, 
  Share2, 
  MessageSquare, 
  Settings, 
  SlidersHorizontal, 
  Bookmark, 
  ChevronRight,
  PrinterCheck,
  ChevronLeft,
  RefreshCw,
  TrendingDown,
  Percent,
  CheckSquare,
  Gift,
  HelpCircle as HelpIcon,
  BookOpen
} from 'lucide-react';

import { 
  UserProfile, 
  Recipe, 
  Ingredient, 
  MealPlanDay, 
  WeeklyMenu, 
  Achievement, 
  EmbalagemGuide, 
  PlanOption 
} from './types';

import { 
  RECIPE_BANK, 
  EMBALAGEM_GUIDES, 
  ACHIEVEMENTS, 
  SUBSCRIPTION_PLANS, 
  MANUAL_MARMITA, 
  FAQ_LIST, 
  generateWeeklyMenuForWeek 
} from './data';

import LandingPage from './components/LandingPage';
import { supabase, USING_MOCK_SUPABASE } from './lib/supabase';
import AuthPage from './components/AuthPage';


export default function App() {
  const [showApp, setShowApp] = useState<boolean>(false);
  
  // Core Authentication and access control states
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [showAuthPage, setShowAuthPage] = useState<boolean>(false);
  const [authPreloadEmail, setAuthPreloadEmail] = useState<string>('');
  const [authScreenMode, setAuthScreenMode] = useState<'login' | 'register'>('login');
  
  // Custom toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Profile "Minha Conta" update states
  const [updateNameLoading, setUpdateNameLoading] = useState(false);
  const [updatePwLoading, setUpdatePwLoading] = useState(false);
  const [profileNewName, setProfileNewName] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');

  // Helper date formatter for account registry display
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Não disponível';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  const [selectedPlanId, setSelectedPlanId] = useState<string>('lifetime_access'); // Default chosen plan in tier list

  // Core User Config State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Vitória',
    dietRestrictions: [], // 'gluten-free', 'lactose-free', 'vegetarian', 'vegan', 'low-carb', 'economical'
    familySize: 3, // Multiplier for quantities
    weeklyBudget: '180',
    prefNotes: 'Prefiro jantares mais leves e rápidos nos dias de semana.'
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0); // Selected day in dashboard view

  // Interactive substitution map state
  // Mapping of { [recipeId]: { [originalIngredientName]: substitutedAlternativeName } }
  const [substitutions, setSubstitutions] = useState<Record<string, Record<string, string>>>({});
  
  // Real-time custom ingredient inputs typed by client
  const [customTypedIngredients, setCustomTypedIngredients] = useState<Record<string, string>>({});
  
  // Custom collection of recipes and menus in memory
  const [favorites, setFavorites] = useState<string[]>(['rec2', 'rec5']); // Seeded with ids
  const [favoriteWeeks, setFavoriteWeeks] = useState<number[]>([1]);

  // Gamification states
  const [boughtItems, setBoughtItems] = useState<Record<string, boolean>>({});
  const [cookedMeals, setCookedMeals] = useState<string[]>(['1-Segunda-feira-lunch']); // List of "week-day-lunch/dinner"
  const [activeAchievements, setActiveAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  // AI-chef states
  const [fridgeIngredients, setFridgeIngredients] = useState<string>('Ovos, espinafre, queijo, cebola, tomate');
  const [aiTime, setAiTime] = useState<number>(20);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Active cooking guide state
  const [selectedRecipeForDetails, setSelectedRecipeForDetails] = useState<Recipe | null>(null);
  const [activeCookingStepIndex, setActiveCookingStepIndex] = useState<number | null>(null);

  // Temporary local state for premium subscription paywall alerts
  const [premiumAlert, setPremiumAlert] = useState<string | null>(null);

  // Tracks active ingredient substitution dropdown state on click
  const [activeDropdown, setActiveDropdown] = useState<{ recipeId: string; ingredientName: string } | null>(null);

  // Tracks active printable section content if any for direct print:block rendering
  const [printData, setPrintData] = useState<{ type: 'menu' | 'shopping' | 'recipe' | 'manual'; recipe?: Recipe } | null>(null);

  // Tracks copy action success indicator
  const [copied, setCopied] = useState<boolean>(false);

  // Sync menu based on active filters and current week select
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>(generateWeeklyMenuForWeek(1, []));

  // Sync Supabase Authentication state on startup
  useEffect(() => {
    // Current Active Session Check on page mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionUser(session.user);
        const metadataName = session.user.user_metadata?.name || session.user.user_metadata?.nome || 'Usuária';
        setProfile(prev => ({
          ...prev,
          name: metadataName,
          email: session.user.email
        }));
        setProfileNewName(metadataName);
        setShowApp(true);
      }
      setAuthInitialized(true);
    }).catch(err => {
      console.error("Auth session fetch error:", err);
      setAuthInitialized(true);
    });

    // Subscriptions to auth state transitions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setSessionUser(session.user);
        const metadataName = session.user.user_metadata?.name || session.user.user_metadata?.nome || 'Usuária';
        setProfile(prev => ({
          ...prev,
          name: metadataName,
          email: session.user.email
        }));
        setProfileNewName(metadataName);
        setShowApp(true);
      } else {
        setSessionUser(null);
        setShowApp(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync profileNewName when user login settings transition
  useEffect(() => {
    if (sessionUser) {
      setProfileNewName(sessionUser.user_metadata?.name || sessionUser.user_metadata?.nome || profile.name || '');
    }
  }, [sessionUser, profile.name]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSessionUser(null);
      setShowApp(false);
      setShowAuthPage(false);
      showToast('Sessão encerrada com sucesso.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Erro ao fechar sessão.', 'error');
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = profileNewName.trim();
    if (!cleanName) {
      showToast('Por favor, preencha um nome válido.', 'error');
      return;
    }
    setUpdateNameLoading(true);
    try {
      const { error: authErr } = await supabase.auth.updateUser({
        data: { name: cleanName, nome: cleanName }
      });
      if (authErr) throw authErr;

      // Update in Table 'usuarios' in Postgres/Supabase
      await supabase.from('usuarios')
        .update({ nome: cleanName })
        .eq('id', sessionUser.id);

      setProfile(prev => ({ ...prev, name: cleanName }));
      showToast('Nome de usuário atualizado com sucesso!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Falha ao atualizar nome.', 'error');
    } finally {
      setUpdateNameLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileNewPassword || !profileConfirmPassword) {
      showToast('Por favor, preencha ambos os campos de senha.', 'error');
      return;
    }
    if (profileNewPassword.length < 8) {
      showToast('Sua nova senha deve possuir no mínimo 8 caracteres.', 'error');
      return;
    }
    if (profileNewPassword !== profileConfirmPassword) {
      showToast('As senhas digitadas não batem.', 'error');
      return;
    }
    setUpdatePwLoading(true);
    try {
      const { error: authErr } = await supabase.auth.updateUser({
        password: profileNewPassword
      });
      if (authErr) throw authErr;

      setProfileNewPassword('');
      setProfileConfirmPassword('');
      showToast('Senha alterada com sucesso!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erro ao alterar sua senha.', 'error');
    } finally {
      setUpdatePwLoading(false);
    }
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintData(null);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  useEffect(() => {
    const computedMenu = generateWeeklyMenuForWeek(currentWeek, profile.dietRestrictions);
    setWeeklyMenu(computedMenu);
  }, [currentWeek, profile.dietRestrictions]);

  // Global click-away handler to close active substitutions dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // Handle achievement checks automatically as state undergoes modifications
  useEffect(() => {
    const updated = activeAchievements.map(ach => {
      let currentVal = 0;
      if (ach.metric === 'profile_filled') {
        currentVal = profile.name.trim().length > 0 ? 1 : 0;
      } else if (ach.metric === 'weeks_completed') {
        // Based on cooked meals cooked in the week
        const weekMealsCount = cookedMeals.filter(m => m.startsWith(String(currentWeek))).length;
        currentVal = weekMealsCount >= 4 ? 4 : weekMealsCount; 
      } else if (ach.metric === 'recipes_cooked') {
        currentVal = cookedMeals.length;
      } else if (ach.metric === 'favorites_added') {
        currentVal = favorites.length + favoriteWeeks.length;
      } else if (ach.metric === 'saved_budget') {
        // How many items marked off
        const totalChecked = Object.values(boughtItems).filter(Boolean).length;
        currentVal = Math.floor(totalChecked / 5);
      }

      return {
        ...ach,
        unlocked: currentVal >= ach.targetCount
      };
    });

    // Check if any newly unlocked achievements should notify or simply be logged.
    // Deep equal check to avoid infinite triggers.
    if (JSON.stringify(updated) !== JSON.stringify(activeAchievements)) {
      setActiveAchievements(updated);
    }
  }, [profile, cookedMeals, favorites, favoriteWeeks, boughtItems]);

  const handleToggleRestriction = (restId: string) => {
    setProfile(prev => {
      const exists = prev.dietRestrictions.includes(restId);
      const updated = exists 
        ? prev.dietRestrictions.filter(r => r !== restId) 
        : [...prev.dietRestrictions, restId];
      return { ...prev, dietRestrictions: updated };
    });
  };

  const handleSwapIngredient = (recipeId: string, ingredientName: string, alternativeName: string) => {
    setSubstitutions(prev => {
      const recipeSubs = prev[recipeId] || {};
      return {
        ...prev,
        [recipeId]: {
          ...recipeSubs,
          [ingredientName]: alternativeName
        }
      };
    });
    setActiveDropdown(null);
  };

  const getActiveIngredientName = (recipeId: string, baseIngredient: Ingredient): string => {
    return substitutions[recipeId]?.[baseIngredient.name] || baseIngredient.name;
  };

  const getDynamicRecipeName = (recipeId: string, baseName: string, recipeIngredients: Ingredient[]): string => {
    if (recipeId === 'rec8') {
      const mainIngredient = recipeIngredients.find(ing => ing.name === 'Cogumelos frescos mistos');
      if (mainIngredient) {
        const activeName = getActiveIngredientName(recipeId, mainIngredient);
        if (activeName !== 'Cogumelos frescos mistos') {
          const lower = activeName.toLowerCase();
          if (lower.includes('carne') || lower.includes('patinho') || lower.includes('porco') || lower.includes('bacon') || lower.includes('frango') || lower.includes('tofu') || lower.includes('sol')) {
            return `Feijoada com ${activeName}`;
          }
          return `Feijoada de ${activeName}`;
        }
      }
    }

    if (recipeId === 'rec1') {
      const mainIngredient = recipeIngredients.find(ing => ing.name === 'Peito de Frango');
      if (mainIngredient) {
        const activeName = getActiveIngredientName(recipeId, mainIngredient);
        if (activeName !== 'Peito de Frango') {
          return `${activeName} Grelhado Cítrico com Purê de Abóbora`;
        }
      }
    }

    if (recipeId === 'rec4') {
      const mainIngredient = recipeIngredients.find(ing => ing.name === 'Filé de Tilápia');
      if (mainIngredient) {
        const activeName = getActiveIngredientName(recipeId, mainIngredient);
        if (activeName !== 'Filé de Tilápia') {
          return `${activeName} à Provençal com Arroz de Brócolis`;
        }
      }
    }

    if (recipeId === 'rec5') {
      const mainIngredient = recipeIngredients.find(ing => ing.name === 'Carne Moída (Patinho)');
      if (mainIngredient) {
        const activeName = getActiveIngredientName(recipeId, mainIngredient);
        if (activeName !== 'Carne Moída (Patinho)') {
          return `Escondidinho Rústico de ${activeName} e Mandioca`;
        }
      }
    }

    return baseName;
  };

  const getDynamicRecipeImage = (recipeId: string, defaultImage: string, name: string): string => {
    const matchedRec = RECIPE_BANK.find(r => r.id === recipeId);
    const resolvedName = getDynamicRecipeName(recipeId, name, matchedRec?.ingredients || []);
    const lowercase = resolvedName.toLowerCase();

    if (lowercase.includes('feijoada')) {
      if (lowercase.includes('vegetariana') || lowercase.includes('vegano') || lowercase.includes('cogumelo')) {
        return 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop';
      }
      // Rich traditional Brazilian feijoada with meat
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop';
    }

    if (lowercase.includes('frango') || lowercase.includes('chicken')) {
      return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop';
    }

    if (lowercase.includes('tofu') && lowercase.includes('grelhado')) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop';
    }

    if (lowercase.includes('moqueca') || lowercase.includes('stew')) {
      return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop';
    }

    if (lowercase.includes('pesto') || lowercase.includes('massa') || lowercase.includes('penne') || lowercase.includes('pasta')) {
      return 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=600&auto=format&fit=crop';
    }

    if (lowercase.includes('peixe') || lowercase.includes('tilápia') || lowercase.includes('pescada') || lowercase.includes('salmão') || lowercase.includes('fish')) {
      return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600&auto=format&fit=crop';
    }

    if (lowercase.includes('escondidinho')) {
      return 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=600&auto=format&fit=crop';
    }

    if (lowercase.includes('estrogonofe') || lowercase.includes('stroganoff') || lowercase.includes('shimeji')) {
      return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop';
    }

    if (lowercase.includes('abobrinha') || lowercase.includes('zucchini') || lowercase.includes('bolonhesa')) {
      return 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop';
    }

    return defaultImage;
  };

  const getFormattedStep = (recipeId: string, stepText: string, ingredients: Ingredient[]): string => {
    let formattedText = stepText;
    const recipeSubs = substitutions[recipeId];
    if (!recipeSubs) return formattedText;

    const sortedIngs = [...ingredients].sort((a, b) => b.name.length - a.name.length);

    sortedIngs.forEach(ing => {
      const subbedName = recipeSubs[ing.name];
      if (subbedName && subbedName !== ing.name) {
        // Replace exact full name
        const escapedName = ing.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        formattedText = formattedText.replace(new RegExp(escapedName, 'gi'), subbedName);

        // Also replace parts or nouns from original ingredient name if length is >= 4
        const words = ing.name.split(/\s+/);
        words.forEach(w => {
          const cleanWord = w.replace(/[^a-zA-ZáàâãéèêíïóôõöúçÑñÁÀÂÃÉÈÍÓÔÕÚÇ]/g, '');
          if (cleanWord.length >= 4 && !['grelhado', 'fresco', 'picado', 'moído', 'cozido', 'ralado', 'seco', 'triturado', 'misto', 'colorido', 'g', 'unidade', 'unidades', 'colher', 'sopa', 'chá', 'copo', 'xícara', 'integral'].includes(cleanWord.toLowerCase())) {
            const escapedWord = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regexWord = new RegExp(`\\b${escapedWord}\\b`, 'gi');
            formattedText = formattedText.replace(regexWord, subbedName);
          }
        });

        // Specific high-frequency kitchen Portuguese helpers for seamless integration
        if (ing.name.toLowerCase().includes('frango')) {
          formattedText = formattedText.replace(/\bfrango\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('peixe') || ing.name.toLowerCase().includes('tilápia')) {
          formattedText = formattedText.replace(/\bpeixe\b/gi, subbedName);
          formattedText = formattedText.replace(/\btilápia\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('carne')) {
          formattedText = formattedText.replace(/\bcarne\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('banana')) {
          formattedText = formattedText.replace(/\bbanana\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('abóbora')) {
          formattedText = formattedText.replace(/\babóbora\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('limão')) {
          formattedText = formattedText.replace(/\blimão\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('queijo')) {
          formattedText = formattedText.replace(/\bqueijo\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('azeite')) {
          formattedText = formattedText.replace(/\bazeite\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('mandioca')) {
          formattedText = formattedText.replace(/\bmandioca\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('penne')) {
          formattedText = formattedText.replace(/\bpenne\b/gi, subbedName);
          formattedText = formattedText.replace(/\bmassa\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('manjericão')) {
          formattedText = formattedText.replace(/\bmanjericão\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('tomate')) {
          formattedText = formattedText.replace(/\btomate\b/gi, subbedName);
          formattedText = formattedText.replace(/\btomates\b/gi, subbedName);
          formattedText = formattedText.replace(/\btomatinhas\b/gi, subbedName);
          formattedText = formattedText.replace(/\btomatinhos\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('azeitona')) {
          formattedText = formattedText.replace(/\bazeitona\b/gi, subbedName);
          formattedText = formattedText.replace(/\bazeitonas\b/gi, subbedName);
        }
        if (ing.name.toLowerCase().includes('brócolis')) {
          formattedText = formattedText.replace(/\bbrócolis\b/gi, subbedName);
        }
      }
    });

    return formattedText;
  };

  // Scaled amounts based on family count
  const getScaledAmount = (basePerPerson: number, unit: string) => {
    if (!basePerPerson) return null;
    const value = basePerPerson * profile.familySize;
    if (unit === 'g' && value >= 1000) {
      return `${(value / 1000).toFixed(1).replace('.0', '')} kg`;
    }
    return `${value}${unit === 'unid' ? ' unidades' : ' ' + unit}`;
  };

  // Generate complete scaled shopping list for the currently visible weekly menu
  const getCombinedShoppingList = () => {
    const list: Record<string, { totalAmount: number; nameStr: string; unit: string; category: string; checked: boolean }> = {};

    weeklyMenu.days.forEach((day) => {
      [day.lunch, day.dinner].forEach((recipe) => {
        recipe.ingredients.forEach((ing) => {
          // get modified name if user activated a smart substitute!
          const activeName = getActiveIngredientName(recipe.id, ing);
          
          let key = `${ing.category}-${activeName}`;
          let baseAmount = ing.baseAmountPerPerson;

          // If ingredient was substituted, use a rough estimated proportional amount
          if (activeName !== ing.name) {
            // Find in bank to see if we can extract proper baseline from substitution target
            const alternativeRecipeMatch = RECIPE_BANK.find(r => r.ingredients.some(i => i.name === activeName));
            const alternativeIng = alternativeRecipeMatch?.ingredients.find(i => i.name === activeName);
            baseAmount = alternativeIng?.baseAmountPerPerson || ing.baseAmountPerPerson;
          }

          if (list[key]) {
            list[key].totalAmount += baseAmount;
          } else {
            list[key] = {
              totalAmount: baseAmount,
              nameStr: activeName,
              unit: ing.unit,
              category: ing.category,
              checked: boughtItems[key] || false
            };
          }
        });
      });
    });

    return Object.keys(list).map(k => ({
      key: k,
      ...list[k]
    }));
  };

  const toggleBoughtItem = (keyStr: string) => {
    setBoughtItems(prev => ({
      ...prev,
      [keyStr]: !prev[keyStr]
    }));
  };

  const toggleCookedMeal = (mealKey: string) => {
    setCookedMeals(prev => {
      const exists = prev.includes(mealKey);
      if (exists) {
        return prev.filter(m => m !== mealKey);
      } else {
        return [...prev, mealKey];
      }
    });
  };

  const toggleFavoriteRecipe = (recipeId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(recipeId);
      if (exists) {
        return prev.filter(r => r !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const toggleFavoriteWeek = (weekNum: number) => {
    setFavoriteWeeks(prev => {
      const exists = prev.includes(weekNum);
      if (exists) {
        return prev.filter(w => w !== weekNum);
      } else {
        return [...prev, weekNum];
      }
    });
  };

  // Client request to server-side AI Suggest endpoint
  const handleQueryAiChef = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: fridgeIngredients,
          restrictions: profile.dietRestrictions,
          timeAvailable: aiTime,
          persons: profile.familySize
        })
      });

      const data = await response.json();
      if (data.error) {
        setAiError(data.error);
      } else if (data.suggestion) {
        setAiResult(data.suggestion);
      } else {
        setAiError("Não foi possível gerar uma resposta válida da Inteligência Artificial. Verifique as configurações.");
      }
    } catch (e: any) {
      console.error(e);
      setAiError("Sem conexão de rede de internet ativa com o servidor para consultar o Gemini API. Verifique.");
    } finally {
      setAiLoading(false);
    }
  };

  const getPrintDataAsPlainText = (): string => {
    if (!printData) return '';
    if (printData.type === 'menu') {
      return `📅 MENU SEM ESTRESSE - SEMANA ${currentWeek}\n\n` + 
        weeklyMenu.days.map(day => `• ${day.dayName}\n  Janta: ${day.lunch.name}\n  Jantar: ${day.dinner.name}`).join('\n\n') +
        `\n\nGerado em Menu Sem Estresse.`;
    }
    if (printData.type === 'shopping') {
      const slItems = getCombinedShoppingList();
      const categories = Array.from(new Set(slItems.map(i => i.category)));
      return `🛒 LISTA DE COMPRAS - SEMANA ${currentWeek}\n\n` + 
        categories.map(cat => `📁 ${cat.toUpperCase()}:\n` + 
          slItems.filter(i => i.category === cat).map(i => `[ ] ${i.nameStr} (${getScaledAmount(i.totalAmount, i.unit) || `${i.totalAmount} ${i.unit}`})`).join('\n')
        ).join('\n\n') + 
        `\n\nGerado em Menu Sem Estresse.`;
    }
    if (printData.type === 'recipe' && printData.recipe) {
      const r = printData.recipe;
      return `🍳 RECEITA: ${r.name.toUpperCase()}\n"${r.description}"\n\n` + 
        `⏱️ Tempo: ${r.prepTime} min | Categoria: ${r.category}\n` +
        `🔥 Calorias: ${r.nutritionalInfo.calories} kcal/porção\n\n` +
        `📋 INGREDIENTES (Familia de ${profile.familySize} pessoas):\n` +
        r.ingredients.map(ing => `• ${getActiveIngredientName(r.id, ing)}: ${getScaledAmount(ing.baseAmountPerPerson, ing.unit) || ing.amount}`).join('\n') +
        `\n\n🍳 MODO DE PREPARO:\n` +
        r.instructions.map((step, idx) => `${idx + 1}. ${getFormattedStep(r.id, step, r.ingredients)}`).join('\n') +
        `\n\n💡 DICAS:\n` +
        r.tips.map(tip => `• ${tip}`).join('\n') +
        `\n\nGerado em Menu Sem Estresse.`;
    }
    if (printData.type === 'manual') {
      return `📖 MANUAL DA MARMITA SEM ÁGUA\n\n` + 
        `1. CONGELAMENTO PERFEITO:\n` + 
        MANUAL_MARMITA.freezing.map((item, idx) => `${idx + 1}. ${item.title}: ${item.description}`).join('\n') +
        `\n\n2. DESCONGELAMENTO SEGURO:\n` + 
        MANUAL_MARMITA.thawing.map((item, idx) => `${idx + 1}. ${item.title}: ${item.description}`).join('\n') +
        `\n\n3. REAQUECIMENTO INTELIGENTE:\n` + 
        MANUAL_MARMITA.heating.map((item, idx) => `${idx + 1}. ${item.title}: ${item.description}`).join('\n') +
        `\n\nGerado em Menu Sem Estresse.`;
    }
    return '';
  };

  const handleDownloadHTML = () => {
    if (!printData) return;
    
    const inlineCss = `
      body { 
        font-family: 'Inter', system-ui, -apple-system, sans-serif; 
        color: #1e293b; 
        padding: 30px 20px; 
        line-height: 1.6; 
        max-width: 680px; 
        margin: 0 auto; 
        background-color: #ffffff; 
      }
      .no-print-alert { 
        background-color: #ffe4e6; 
        color: #9f1239; 
        padding: 16px; 
        border-radius: 12px; 
        text-align: center; 
        margin-bottom: 30px; 
        border: 1px solid #fecdd3;
        font-size: 13px;
      }
      .btn-action { 
        display: inline-block; 
        margin-top: 10px; 
        padding: 10px 20px; 
        background-color: #e11d48; 
        color: #ffffff; 
        text-decoration: none; 
        font-weight: 600; 
        border-radius: 8px; 
        cursor: pointer; 
        border: none;
        font-size: 13px;
      }
      .btn-action:hover { background-color: #be123c; }
      h1 { color: #9f1239; font-family: 'Georgia', serif; font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 6px; }
      p.subtitle { text-align: center; color: #64748b; font-size: 13px; margin-top: 0; margin-bottom: 24px; }
      .meta-box { 
        display: grid; 
        grid-template-cols: 1fr 1fr; 
        gap: 10px; 
        background-color: #fdf2f8; 
        padding: 14px; 
        border-radius: 12px; 
        margin-bottom: 25px; 
        font-size: 12px; 
        border: 1px solid #fce7f3; 
        text-align: center;
      }
      .section-hl { 
        font-family: 'Georgia', serif; 
        color: #be123c; 
        border-b: 2px solid #fecdd3; 
        padding-bottom: 4px; 
        margin-top: 25px; 
        margin-bottom: 12px; 
        font-size: 17px; 
        font-weight: bold;
      }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      th { background-color: #ffe4e6; color: #9f1239; padding: 10px; text-align: left; font-size: 12px; font-weight: bold; border-bottom: 2px solid #fda4af; }
      td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; }
      ul, ol { padding-left: 20px; margin-top: 8px; }
      li { margin-bottom: 8px; font-size: 13px; }
      .tips { background-color: #fafaf9; border-left: 4px solid #f43f5e; padding: 12px; border-radius: 0 8px 8px 0; margin-top: 20px; font-size: 12px; }
      .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 45px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
      @media print {
        .no-print { display: none !important; }
        body { padding: 0; }
      }
    `;

    let contentHtml = '';
    let filename = 'menu-sem-estresse.html';

    if (printData.type === 'menu') {
      filename = `cardapio-semana-${currentWeek}.html`;
      contentHtml = `
        <h1>Menu Sem Estresse Premium</h1>
        <p class="subtitle">Plano Semanal Especial • Semana ${currentWeek} do Ano</p>
        <div class="meta-box">
          <div>👪 <strong>Membros Família:</strong> ${profile.familySize} pessoas</div>
          <div>📅 <strong>Plano:</strong> Semana Escrita ${currentWeek}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 25%;">Dia da Semana</th>
              <th style="width: 37.5%;">🌞 Janta Recomendada</th>
              <th style="width: 37.5%;">🌙 Jantar Prático</th>
            </tr>
          </thead>
          <tbody>
            ${weeklyMenu.days.map(day => `
              <tr>
                <td style="font-weight: bold; color: #9f1239;">${day.dayName}</td>
                <td>
                  <strong>${day.lunch.name}</strong><br>
                  <span style="font-size: 11px; color:#64748b;">Tempo: ${day.lunch.prepTime} min | Dif: ${day.lunch.difficulty}</span>
                </td>
                <td>
                  <strong>${day.dinner.name}</strong><br>
                  <span style="font-size: 11px; color:#64748b;">Tempo: ${day.dinner.prepTime} min | Dif: ${day.dinner.difficulty}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (printData.type === 'shopping') {
      filename = `lista-compras-semana-${currentWeek}.html`;
      const slItems = getCombinedShoppingList();
      const categories = Array.from(new Set(slItems.map(i => i.category)));
      contentHtml = `
        <h1>Lista de Compras Inteligente</h1>
        <p class="subtitle">Semana ${currentWeek} • Organizada por Categorias</p>
        <div class="meta-box">
          <div>👪 <strong>Membros Família:</strong> ${profile.familySize} pessoas</div>
          <div>🛒 <strong>Total Itens:</strong> ${slItems.length} ingredientes</div>
        </div>
        ${categories.map(cat => `
          <div style="margin-bottom: 20px;">
            <div class="section-hl">📁 Setor: ${cat}</div>
            <ul style="list-style: none; padding-left: 0;">
              ${slItems.filter(i => i.category === cat).map(item => `
                <li style="border-bottom: 1px dashed #e2e8f0; padding: 6px 0; display: flex; align-items: center; font-size: 13px;">
                  <span style="display:inline-block; width: 14px; height: 14px; border: 1px solid #cbd5e1; border-radius: 3px; margin-right: 10px; flex-shrink: 0;"></span>
                  <strong>${item.nameStr}</strong> &nbsp;—&nbsp; <span style="color: #64748b;">${getScaledAmount(item.totalAmount, item.unit) || `${item.totalAmount} ${item.unit}`}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      `;
    } else if (printData.type === 'recipe' && printData.recipe) {
      const r = printData.recipe;
      filename = `receita-${r.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      contentHtml = `
        <div style="text-align: center; margin-bottom: 5px;">
          <span style="font-size: 10px; font-weight: bold; color: #be123c; text-transform: uppercase; letter-spacing: 1px;">Receita Saudável Integrada</span>
        </div>
        <h1>${r.name}</h1>
        <p class="subtitle">"${r.description}"</p>
        <div class="meta-box" style="grid-template-cols: repeat(4, 1fr);">
          <div>⏱️ <strong>Preparo:</strong><br>${r.prepTime} min</div>
          <div>🔥 <strong>Dificuldade:</strong><br>${r.difficulty}</div>
          <div>🍲 <strong>Categoria:</strong><br>${r.category}</div>
          <div>⚡ <strong>Calorias:</strong><br>${r.nutritionalInfo.calories} kcal</div>
        </div>
        
        <div class="section-hl">📋 Ingredientes (Calculado para ${profile.familySize} pessoas)</div>
        <ul>
          ${r.ingredients.map(ing => `
            <li><strong>${getActiveIngredientName(r.id, ing)}</strong>: ${getScaledAmount(ing.baseAmountPerPerson, ing.unit) || ing.amount} (${ing.category})</li>
          `).join('')}
        </ul>
        
        <div class="section-hl">🍳 Modo de Preparo</div>
        <ol>
          ${r.instructions.map(step => `
            <li style="margin-bottom: 10px; line-height: 1.6;">${getFormattedStep(r.id, step, r.ingredients)}</li>
          `).join('')}
        </ol>
        
        <div class="tips">
          <strong style="color: #9f1239; display: block; margin-bottom: 4px;">💡 Dica Exclusiva:</strong>
          <ul style="margin: 0; padding-left: 15px;">
            ${r.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      `;
    } else if (printData.type === 'manual') {
      filename = 'manual-marmita-sem-agua.html';
      contentHtml = `
        <h1>Manual da Marmita Sem Água</h1>
        <p class="subtitle">Como preparar, congelar e reaquecer de forma inteligente</p>
        
        <div class="section-hl">1. Congelamento Perfeito</div>
        <ul style="list-style-type: decimal; padding-left: 20px;">
          ${MANUAL_MARMITA.freezing.map(item => `
            <li style="margin-bottom: 12px;"><strong>${item.title}:</strong> ${item.description}</li>
          `).join('')}
        </ul>
        
        <div class="section-hl">2. Descongelamento Seguro</div>
        <ul style="list-style-type: decimal; padding-left: 20px;">
          ${MANUAL_MARMITA.thawing.map(item => `
            <li style="margin-bottom: 12px;"><strong>${item.title}:</strong> ${item.description}</li>
          `).join('')}
        </ul>
        
        <div class="section-hl">3. Reaquecimento Inteligente</div>
        <ul style="list-style-type: decimal; padding-left: 20px;">
          ${MANUAL_MARMITA.heating.map(item => `
            <li style="margin-bottom: 12px;"><strong>${item.title}:</strong> ${item.description}</li>
          `).join('')}
        </ul>
      `;
    }

    const fullPageHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Menu Sem Estresse Premium</title>
        <style>${inlineCss}</style>
      </head>
      <body>
        <div class="no-print-alert no-print">
          <strong style="font-size: 15px; display: block; margin-bottom: 4px;">📥 Arquivo pronto para impressão no celular!</strong>
          Como você abriu o arquivo baixado, agora as restrições do navegador do sistema foram contornadas.
          <br><br>
          <button class="btn-action" onclick="window.print()">Abrir Opção de Salvar / Imprimir</button>
        </div>
        
        ${contentHtml}
        
        <div class="footer">
          © 2026 Menu Sem Estresse. Feito sob medida para você focar no que importa.
        </div>
        
        <script>
          // Automatically focus printing when top-level loaded
          setTimeout(function() {
            window.print();
          }, 350);
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([fullPageHtml], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleShare = () => {
    const plainText = getPrintDataAsPlainText();
    if (navigator.share) {
      navigator.share({
        title: 'Menu Sem Estresse',
        text: plainText,
      }).catch(err => console.error('Share failure', err));
    } else {
      // Direct fallback onto local clipboard triggers alert
      navigator.clipboard.writeText(plainText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          const textArea = document.createElement("textarea");
          textArea.value = plainText;
          textArea.style.position = "fixed";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error('Fallback copy fail', err);
          }
          document.body.removeChild(textArea);
        });
    }
  };

  // Convert current UI settings info into Printable PDF views natively
  const handlePrint = (type: 'menu' | 'shopping' | 'recipe' | 'manual', targetRecipeObj?: Recipe) => {
    setPrintData({ type, recipe: targetRecipeObj });
  };

  // Trigger redirect to register/login flow
  const triggerStartApp = (screen: 'login' | 'register' = 'login') => {
    setAuthPreloadEmail('');
    setAuthScreenMode(screen);
    setShowAuthPage(true);
  };

  // 1. Loading Initializer checking database sessions
  if (!authInitialized) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative inline-flex">
            <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin"></div>
            <UtensilsCrossed className="h-5 w-5 text-purple-500 absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className="text-sm font-serif font-bold text-slate-900">Validando credenciais de acesso...</p>
        </div>
      </div>
    );
  }

  // 2. Authentication and Onboarding flow views
  if (showAuthPage) {
    return (
      <AuthPage 
        initialEmail={authPreloadEmail}
        initialScreen={authScreenMode}
        onAuthSuccess={(user) => {
          setSessionUser(user);
          setShowAuthPage(false);
          setShowApp(true);
          showToast(`Boas-vindas, ${user.user_metadata?.name || 'Cliente'}!`, 'success');
        }}
        onBackToLanding={() => {
          setShowAuthPage(false);
          setShowApp(false);
        }}
      />
    );
  }

  // 3. Protection check: If user not authenticated, enforce login
  if (!showApp || !sessionUser) {
    return (
      <LandingPage 
        onStartPlatform={triggerStartApp} 
        onSelectPlan={(planId) => {
          setSelectedPlanId(planId);
        }}
      />
    );
  }

  // Active recipes list mapping based on tags
  const filteredRecipesCatalog = RECIPE_BANK.filter(recipe => {
    if (profile.dietRestrictions.length === 0) return true;
    return profile.dietRestrictions.every(rest => {
      const tagMapping: { [key: string]: string } = {
        'gluten-free': 'Sem Glúten',
        'lactose-free': 'Sem Lactose',
        'vegetarian': 'Vegetariano',
        'vegan': 'Vegano',
        'low-carb': 'Low Carb',
        'economical': 'Econômico'
      };
      const requiredTag = tagMapping[rest];
      return requiredTag ? recipe.tags.includes(requiredTag) : true;
    });
  });

  return (
    <>
      <div className="bg-[#FAF6F0] text-slate-800 min-h-screen selection:bg-purple-100 selection:text-purple-900 font-sans antialiased print:hidden">
      
      {/* Top Banner indicating premium status / simulated actions */}
      <div className="bg-slate-900 text-purple-200/90 py-1.5 px-4 text-center text-xs flex justify-between items-center sm:px-8 border-b border-slate-800">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
          Acesso Vitalício Premium Ativado • Sem Mensalidades
        </span>
        <div className="flex items-center gap-3">
          <button 
            id="nav-to-sales" 
            onClick={() => setShowApp(false)} 
            className="text-[11px] underline hover:text-white transition-all font-semibold"
          >
            Sair do Painel (Ver Landing Page)
          </button>
        </div>
      </div>

      {/* Main SaaS Layout Header */}
      <header className="border-b border-purple-100/60 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <Logo size="md" />
            </div>

            {/* User welcome name short */}
            <div className="flex items-center space-x-3 text-xs text-slate-600 font-medium">
              <span className="hidden sm:inline">Olá, <strong className="text-slate-950">{profile.name}</strong></span>
              <button 
                id="header-profile-btn"
                onClick={() => setActiveTab('minha-conta')}
                className="p-1.5 hover:bg-purple-50 rounded-lg text-slate-500 hover:text-purple-600 flex items-center gap-1 border border-slate-100 bg-[#FAF6F0]"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline text-[11px]">Perfil</span>
              </button>
            </div>
          </div>

          {/* SaaS Core Navigation Tabs Container (Responsive grid/scroll) */}
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 pt-1scrollbar-none border-t border-slate-100">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Calendar },
              { id: 'biblioteca', label: 'Biblioteca de Menus', icon: BookOpen },
              { id: 'ia-chef', label: 'Chef IA Grátis', icon: Sparkles },
              { id: 'marmitas', label: 'Manual Marmita', icon: Flame },
              { id: 'embalagens', label: 'Embalagens', icon: Layers },
              { id: 'calendario', label: 'Calendário Mensal', icon: Clock },
              { id: 'favoritos', label: 'Coleções & Favoritos', icon: Bookmark },
              { id: 'perfil', label: 'Preferências Alimentares', icon: SlidersHorizontal },
              { id: 'minha-conta', label: 'Minha Conta', icon: User },
              { id: 'assinatura', label: 'Meu Acesso Vitalício', icon: Award }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-nav-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPremiumAlert(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-purple-500 text-white shadow-sm shadow-purple-200' 
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 bg-transparent'
                  }`}
                >
                  <IconComp className="h-4 w-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main SaaS Screen Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Dynamic paywall simulated alert if relevant */}
        {premiumAlert && (
          <div id="premium-toast" className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex justify-between items-center shadow-sm">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="h-4 w-4 text-amber-600 flex-shrink-0" /> {premiumAlert}
            </span>
            <button 
              onClick={() => setActiveTab('assinatura')}
              className="text-[11px] font-bold underline text-amber-700 hover:text-amber-950 shrink-0 ml-4"
            >
              Ver Benefícios Premium
            </button>
          </div>
        )}

        {/* Tab 1: Dashboard Principal */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Upper Dashboard Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Meal Scheduler overview of week day selected */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Weekly Selector bar */}
                <div className="bg-white rounded-2xl p-5 border border-purple-100/40 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-purple-50">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-slate-950 flex items-center gap-1.5">
                        <Calendar className="text-purple-500 h-5 w-5" /> {weeklyMenu.title}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">Adaptado temporariamente para: {profile.dietRestrictions.length > 0 ? profile.dietRestrictions.map(r => r === 'gluten-free' ? 'Sem Glúten' : r === 'lactose-free' ? 'Sem Lactose' : r === 'vegetarian' ? 'Vegetariano' : r === 'vegan' ? 'Vegano' : r === 'low-carb' ? 'Low Carb' : 'Econômico').join(', ') : 'Sem restrições de filtro alimentares'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        id="prev-week-btn"
                        onClick={() => currentWeek > 1 && setCurrentWeek(w => w - 1)}
                        className="p-1.5 border border-purple-100 rounded-lg hover:bg-purple-50 text-purple-700 transition"
                        title="Semana anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-bold font-mono px-3 py-1 bg-purple-50 text-purple-700 rounded-md">
                        Semana {currentWeek} de 52
                      </span>
                      <button 
                        id="next-week-btn"
                        onClick={() => currentWeek < 52 && setCurrentWeek(w => w + 1)}
                        className="p-1.5 border border-purple-100 rounded-lg hover:bg-purple-50 text-purple-700 transition"
                        title="Próxima semana"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Monday to Sunday small pills */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {weeklyMenu.days.map((day, idx) => {
                      const isSelected = activeDayIndex === idx;
                      const hasLunchFinished = cookedMeals.includes(`${currentWeek}-${day.dayName}-lunch`);
                      const hasDinnerFinished = cookedMeals.includes(`${currentWeek}-${day.dayName}-dinner`);
                      const isComplete = hasLunchFinished && hasDinnerFinished;

                      return (
                        <button
                          key={day.dayName}
                          id={`day-select-${idx}`}
                          onClick={() => setActiveDayIndex(idx)}
                          className={`p-2 rounded-xl text-center transition-all flex flex-col items-center justify-between relative cursor-pointer border ${
                            isSelected 
                              ? 'bg-purple-50 border-purple-300 text-purple-950 font-bold shadow-xs' 
                              : isComplete 
                                ? 'bg-emerald-50/50 border-emerald-100 text-slate-500'
                                : 'bg-white hover:bg-stone-50 border-slate-100'
                          }`}
                        >
                          <span className="text-[10px] uppercase text-slate-400 font-mono">
                            {day.dayName.split('-')[0].substring(0, 3)}
                          </span>
                          <span className="text-xs mt-1">
                            {day.dayName.split('-')[0]}
                          </span>
                          
                          {/* Progress dots */}
                          <div className="flex gap-1 mt-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${hasLunchFinished ? 'bg-emerald-500' : 'bg-slate-200'}`} title="Janta"></span>
                            <span className={`h-1.5 w-1.5 rounded-full ${hasDinnerFinished ? 'bg-emerald-500' : 'bg-slate-200'}`} title="Jantar"></span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Day Meals Selection Detail view */}
                <div className="bg-white rounded-2xl p-6 border border-purple-100/40 shadow-sm space-y-6">
                  
                  {/* Title day info */}
                  <div className="flex items-center justify-between border-b border-purple-100/40 pb-4">
                    <div>
                      <h3 className="text-md sm:text-lg font-serif font-bold text-slate-950 flex items-center gap-1.5">
                        Refeições Planejadas de {weeklyMenu.days[activeDayIndex]?.dayName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Clique nas receitas para ver o modo de preparo completo.</p>
                    </div>
                    
                    <button 
                      id="save-week-fav"
                      onClick={() => toggleFavoriteWeek(currentWeek)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                        favoriteWeeks.includes(currentWeek) 
                          ? 'bg-purple-500 text-white border-purple-600' 
                          : 'bg-white hover:bg-purple-50 border-purple-100 text-purple-700'
                      }`}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>{favoriteWeeks.includes(currentWeek) ? 'Salvo nas Coleções' : 'Salvar Semana'}</span>
                    </button>
                  </div>

                  {/* Lunch & Dinner cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Lunch Item block */}
                    <div className="border border-slate-100 rounded-2xl p-4 bg-stone-50/50 hover:shadow-xs transition relative">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-bold">🌞 JANTA DO DIA</span>
                        
                        {/* Check completed meal */}
                        <button
                          id={`check-lunch-${activeDayIndex}`}
                          onClick={() => toggleCookedMeal(`${currentWeek}-${weeklyMenu.days[activeDayIndex].dayName}-lunch`)}
                          className={`p-1 rounded-md border flex items-center gap-1 text-[10px] font-bold transition-all ${
                            cookedMeals.includes(`${currentWeek}-${weeklyMenu.days[activeDayIndex].dayName}-lunch`)
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                          <span>{cookedMeals.includes(`${currentWeek}-${weeklyMenu.days[activeDayIndex].dayName}-lunch`) ? 'Feito ✓' : 'Marcar Feito'}</span>
                        </button>
                      </div>

                      {/* Display Recipe layout */}
                      <div className="space-y-3 cursor-pointer" onClick={() => setSelectedRecipeForDetails(weeklyMenu.days[activeDayIndex].lunch)}>
                        <div className="h-32 w-full rounded-xl overflow-hidden relative bg-stone-100">
                          <img 
                            src={getDynamicRecipeImage(
                              weeklyMenu.days[activeDayIndex].lunch.id,
                              weeklyMenu.days[activeDayIndex].lunch.image,
                              weeklyMenu.days[activeDayIndex].lunch.name
                            )} 
                            alt={getDynamicRecipeName(
                              weeklyMenu.days[activeDayIndex].lunch.id,
                              weeklyMenu.days[activeDayIndex].lunch.name,
                              weeklyMenu.days[activeDayIndex].lunch.ingredients
                            )}
                            className="object-cover h-full w-full hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-slate-950 text-sm hover:text-purple-600 transition-colors">
                            {getDynamicRecipeName(
                              weeklyMenu.days[activeDayIndex].lunch.id,
                              weeklyMenu.days[activeDayIndex].lunch.name,
                              weeklyMenu.days[activeDayIndex].lunch.ingredients
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {weeklyMenu.days[activeDayIndex].lunch.description}
                          </p>
                        </div>
                      </div>

                      {/* Substitution Quick trigger inline to avoid clutter */}
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">Deseja trocar ingredientes?</span>
                        <div className="flex flex-wrap gap-1">
                          {weeklyMenu.days[activeDayIndex].lunch.ingredients.slice(0, 2).map((ing, iIdx) => {
                            const activeIngName = getActiveIngredientName(weeklyMenu.days[activeDayIndex].lunch.id, ing);
                            const hasSubbed = activeIngName !== ing.name;

                            return (
                              <div key={iIdx} className="relative inline-block text-left group">
                                <button
                                  id={`sub-btn-lunch-${iIdx}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(prev => 
                                      (prev?.recipeId === weeklyMenu.days[activeDayIndex].lunch.id && prev?.ingredientName === ing.name)
                                        ? null 
                                        : { recipeId: weeklyMenu.days[activeDayIndex].lunch.id, ingredientName: ing.name }
                                    );
                                  }}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium border flex items-center gap-1 transition cursor-pointer ${
                                    hasSubbed 
                                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' 
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-stone-100'
                                  }`}
                                >
                                  🔄 {activeIngName}
                                </button>
                                {/* Alternates dropdown layer */}
                                <div 
                                  onClick={(e) => e.stopPropagation()}
                                  className={`absolute left-0 bottom-full mb-1 bg-white border border-slate-200/90 rounded-lg shadow-lg z-20 min-w-[210px] p-2 text-left ${
                                    (activeDropdown?.recipeId === weeklyMenu.days[activeDayIndex].lunch.id && activeDropdown?.ingredientName === ing.name) ? 'block' : 'hidden'
                                  }`}
                                >
                                  <p className="text-[10px] text-slate-400 font-bold mb-1 border-b pb-1 px-1">Trocar ingrediente por:</p>
                                  {/* Base original option fallback reset */}
                                  {hasSubbed && (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSwapIngredient(weeklyMenu.days[activeDayIndex].lunch.id, ing.name, ing.name);
                                      }}
                                      className="w-full text-left px-2 py-1 hover:bg-stone-50 rounded text-[10px] text-purple-600 font-mono block cursor-pointer"
                                    >
                                      Reverter para {ing.name} (Original)
                                    </button>
                                  )}
                                  {ing.substitutes.map((sub, sIdx) => (
                                    <button
                                      key={sIdx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSwapIngredient(weeklyMenu.days[activeDayIndex].lunch.id, ing.name, sub);
                                      }}
                                      className="w-full text-left px-2 py-1 hover:bg-stone-50 rounded text-[10px] text-slate-700 block cursor-pointer"
                                    >
                                      {sub}
                                    </button>
                                  ))}

                                  {/* Additional helper choices if they want other suggestions */}
                                  <p className="text-[9px] text-slate-400 font-bold mt-2 mb-1 border-t pt-1.5 px-1 font-sans">Se não gostar, outras opções:</p>
                                  <div className="flex flex-wrap gap-1 px-1 mb-2">
                                    {['Ovos', 'Carne de Sol', 'Couve-Flor', 'Espinafre', 'Grão-de-Bico', 'Mandioquinha']
                                      .filter(extra => extra !== ing.name && !ing.substitutes.includes(extra))
                                      .slice(0, 3)
                                      .map((extra, eIdx) => (
                                        <button
                                          key={eIdx}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSwapIngredient(weeklyMenu.days[activeDayIndex].lunch.id, ing.name, extra);
                                          }}
                                          className="bg-stone-50 hover:bg-purple-50/40 text-stone-700 hover:text-purple-700 text-[9px] border border-stone-200 rounded px-1.5 py-0.5 font-medium cursor-pointer transition"
                                        >
                                          + {extra}
                                        </button>
                                      ))}
                                  </div>

                                  {/* Custom typing field */}
                                  <div className="mt-2 pt-2 border-t border-slate-100 px-1">
                                    <label className="block text-[9px] text-slate-500 font-bold mb-1">
                                      Ou digite o que você quer:
                                    </label>
                                    <div className="flex gap-1">
                                      <input 
                                        type="text"
                                        placeholder="Ex: Mandioca, Lentilha..."
                                        value={customTypedIngredients[`${weeklyMenu.days[activeDayIndex].lunch.id}-${ing.name}`] || ''}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCustomTypedIngredients(prev => ({
                                            ...prev,
                                            [`${weeklyMenu.days[activeDayIndex].lunch.id}-${ing.name}`]: val
                                          }));
                                        }}
                                        onKeyDown={(e) => {
                                          e.stopPropagation();
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = customTypedIngredients[`${weeklyMenu.days[activeDayIndex].lunch.id}-${ing.name}`];
                                            if (val && val.trim() !== '') {
                                              handleSwapIngredient(weeklyMenu.days[activeDayIndex].lunch.id, ing.name, val.trim());
                                            }
                                          }
                                        }}
                                        className="flex-1 px-1.5 py-1 text-[10px] border border-slate-300 rounded focus:outline-none focus:border-purple-400 text-slate-800 bg-white"
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const val = customTypedIngredients[`${weeklyMenu.days[activeDayIndex].lunch.id}-${ing.name}`];
                                          if (val && val.trim() !== '') {
                                            handleSwapIngredient(weeklyMenu.days[activeDayIndex].lunch.id, ing.name, val.trim());
                                          }
                                        }}
                                        className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-[10px] font-bold cursor-pointer transition animate-none"
                                      >
                                        Ok
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <span className="text-[9px] text-slate-400 ml-1 mt-0.5">E mais...</span>
                        </div>
                      </div>
                    </div>

                    {/* Dinner Item block */}
                    <div className="border border-slate-100 rounded-2xl p-4 bg-stone-50/50 hover:shadow-xs transition relative">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">🌙 JANTAR DO DIA</span>
                        
                        {/* Check completed meal */}
                        <button
                          id={`check-dinner-${activeDayIndex}`}
                          onClick={() => toggleCookedMeal(`${currentWeek}-${weeklyMenu.days[activeDayIndex].dayName}-dinner`)}
                          className={`p-1 rounded-md border flex items-center gap-1 text-[10px] font-bold transition-all ${
                            cookedMeals.includes(`${currentWeek}-${weeklyMenu.days[activeDayIndex].dayName}-dinner`)
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                          <span>{cookedMeals.includes(`${currentWeek}-${weeklyMenu.days[activeDayIndex].dayName}-dinner`) ? 'Feito ✓' : 'Marcar Feito'}</span>
                        </button>
                      </div>

                      {/* Display Recipe layout */}
                      <div className="space-y-3 cursor-pointer" onClick={() => setSelectedRecipeForDetails(weeklyMenu.days[activeDayIndex].dinner)}>
                        <div className="h-32 w-full rounded-xl overflow-hidden relative bg-stone-100">
                          <img 
                            src={getDynamicRecipeImage(
                              weeklyMenu.days[activeDayIndex].dinner.id,
                              weeklyMenu.days[activeDayIndex].dinner.image,
                              weeklyMenu.days[activeDayIndex].dinner.name
                            )} 
                            alt={getDynamicRecipeName(
                              weeklyMenu.days[activeDayIndex].dinner.id,
                              weeklyMenu.days[activeDayIndex].dinner.name,
                              weeklyMenu.days[activeDayIndex].dinner.ingredients
                            )}
                            className="object-cover h-full w-full hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-slate-950 text-sm hover:text-purple-600 transition-colors">
                            {getDynamicRecipeName(
                              weeklyMenu.days[activeDayIndex].dinner.id,
                              weeklyMenu.days[activeDayIndex].dinner.name,
                              weeklyMenu.days[activeDayIndex].dinner.ingredients
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {weeklyMenu.days[activeDayIndex].dinner.description}
                          </p>
                        </div>
                      </div>

                      {/* Substitution Quick trigger inline to avoid clutter */}
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">Deseja trocar ingredientes?</span>
                        <div className="flex flex-wrap gap-1">
                          {weeklyMenu.days[activeDayIndex].dinner.ingredients.slice(0, 2).map((ing, iIdx) => {
                            const activeIngName = getActiveIngredientName(weeklyMenu.days[activeDayIndex].dinner.id, ing);
                            const hasSubbed = activeIngName !== ing.name;

                            return (
                              <div key={iIdx} className="relative inline-block text-left group">
                                <button
                                  id={`sub-btn-dinner-${iIdx}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(prev => 
                                      (prev?.recipeId === weeklyMenu.days[activeDayIndex].dinner.id && prev?.ingredientName === ing.name)
                                        ? null 
                                        : { recipeId: weeklyMenu.days[activeDayIndex].dinner.id, ingredientName: ing.name }
                                    );
                                  }}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium border flex items-center gap-1 transition cursor-pointer ${
                                    hasSubbed 
                                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' 
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-stone-100'
                                  }`}
                                >
                                  🔄 {activeIngName}
                                </button>
                                {/* Alternates dropdown layer */}
                                <div 
                                  onClick={(e) => e.stopPropagation()}
                                  className={`absolute left-0 bottom-full mb-1 bg-white border border-slate-200/90 rounded-lg shadow-lg z-20 min-w-[210px] p-2 text-left ${
                                    (activeDropdown?.recipeId === weeklyMenu.days[activeDayIndex].dinner.id && activeDropdown?.ingredientName === ing.name) ? 'block' : 'hidden'
                                  }`}
                                >
                                  <p className="text-[10px] text-slate-400 font-bold mb-1 border-b pb-1 px-1">Trocar ingrediente por:</p>
                                  {/* Base original option reset */}
                                  {hasSubbed && (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSwapIngredient(weeklyMenu.days[activeDayIndex].dinner.id, ing.name, ing.name);
                                      }}
                                      className="w-full text-left px-2 py-1 hover:bg-stone-50 rounded text-[10px] text-purple-600 font-mono block cursor-pointer"
                                    >
                                      Reverter para {ing.name} (Original)
                                    </button>
                                  )}
                                  {ing.substitutes.map((sub, sIdx) => (
                                    <button
                                      key={sIdx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSwapIngredient(weeklyMenu.days[activeDayIndex].dinner.id, ing.name, sub);
                                      }}
                                      className="w-full text-left px-2 py-1 hover:bg-stone-50 rounded text-[10px] text-slate-700 block cursor-pointer"
                                    >
                                      {sub}
                                    </button>
                                  ))}

                                  {/* Additional helper choices if they want other suggestions */}
                                  <p className="text-[9px] text-slate-400 font-bold mt-2 mb-1 border-t pt-1.5 px-1 font-sans">Se não gostar, outras opções:</p>
                                  <div className="flex flex-wrap gap-1 px-1 mb-2">
                                    {['Ovos', 'Carne de Sol', 'Couve-Flor', 'Espinafre', 'Grão-de-Bico', 'Mandioquinha']
                                      .filter(extra => extra !== ing.name && !ing.substitutes.includes(extra))
                                      .slice(0, 3)
                                      .map((extra, eIdx) => (
                                        <button
                                          key={eIdx}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSwapIngredient(weeklyMenu.days[activeDayIndex].dinner.id, ing.name, extra);
                                          }}
                                          className="bg-stone-50 hover:bg-purple-50/40 text-stone-700 hover:text-purple-700 text-[9px] border border-stone-200 rounded px-1.5 py-0.5 font-medium cursor-pointer transition"
                                        >
                                          + {extra}
                                        </button>
                                      ))}
                                  </div>

                                  {/* Custom typing field */}
                                  <div className="mt-2 pt-2 border-t border-slate-100 px-1">
                                    <label className="block text-[9px] text-slate-500 font-bold mb-1">
                                      Ou digite o que você quer:
                                    </label>
                                    <div className="flex gap-1">
                                      <input 
                                        type="text"
                                        placeholder="Ex: Mandioca, Lentilha..."
                                        value={customTypedIngredients[`${weeklyMenu.days[activeDayIndex].dinner.id}-${ing.name}`] || ''}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCustomTypedIngredients(prev => ({
                                            ...prev,
                                            [`${weeklyMenu.days[activeDayIndex].dinner.id}-${ing.name}`]: val
                                          }));
                                        }}
                                        onKeyDown={(e) => {
                                          e.stopPropagation();
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = customTypedIngredients[`${weeklyMenu.days[activeDayIndex].dinner.id}-${ing.name}`];
                                            if (val && val.trim() !== '') {
                                              handleSwapIngredient(weeklyMenu.days[activeDayIndex].dinner.id, ing.name, val.trim());
                                            }
                                          }
                                        }}
                                        className="flex-1 px-1.5 py-1 text-[10px] border border-slate-300 rounded focus:outline-none focus:border-purple-400 text-slate-800 bg-white"
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const val = customTypedIngredients[`${weeklyMenu.days[activeDayIndex].dinner.id}-${ing.name}`];
                                          if (val && val.trim() !== '') {
                                            handleSwapIngredient(weeklyMenu.days[activeDayIndex].dinner.id, ing.name, val.trim());
                                          }
                                        }}
                                        className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-[10px] font-bold cursor-pointer transition animate-none"
                                      >
                                        Ok
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <span className="text-[9px] text-slate-400 ml-1 mt-0.5">E mais...</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Print mode buttons for the day */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-purple-100/40 text-xs">
                    <button 
                      id="print-full-menu"
                      onClick={() => handlePrint('menu')}
                      className="px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-1.5 font-medium cursor-pointer"
                    >
                      <Printer className="h-4 w-4" /> Imprimir Cardápio Semanal (PDF)
                    </button>
                    <button 
                      id="print-shopping-menu"
                      onClick={() => handlePrint('shopping')}
                      className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-1.5 font-medium cursor-pointer"
                    >
                      <PrinterCheck className="h-4 w-4" /> Imprimir Lista de Compras (PDF)
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Grocery list progress status & gamification */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Micro User Profile card */}
                <div className="bg-white rounded-2xl p-5 border border-purple-100/40 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                    <span className="text-xs font-mono uppercase tracking-wider text-purple-600 font-bold">Meu Perfil Ativo</span>
                    <button 
                      onClick={() => setActiveTab('minha-conta')}
                      className="text-[11px] text-purple-600 hover:underline font-bold"
                    >
                      Editar
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    {profile.email && (
                      <div className="flex justify-between border-b border-neutral-100 pb-2 mb-2">
                        <span className="text-slate-400">E-mail Premium:</span>
                        <strong className="text-purple-600 truncate max-w-[170px]" title={profile.email}>{profile.email}</strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Responsável:</span>
                      <strong className="text-slate-900">{profile.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Membros da Casa:</span>
                      <strong className="text-slate-900">{profile.familySize} pessoas</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Meta Econômica:</span>
                      <strong className="text-purple-700">Até R$ {profile.weeklyBudget}/semana</strong>
                    </div>
                  </div>
                </div>

                {/* Automation Grocery List Checklist widget */}
                <div className="bg-white rounded-2xl p-5 border border-purple-100/40 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-purple-50">
                    <div>
                      <h4 className="font-serif font-bold text-slate-950 text-sm">Lista de Compras da Semana</h4>
                      <p className="text-[10px] text-slate-400">Porcionamento automático x{profile.familySize}</p>
                    </div>
                    <button 
                      onClick={() => handlePrint('shopping')}
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-stone-50 rounded-lg border border-slate-100"
                      title="Imprimir lista"
                    >
                      <Printer className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* List items scroll */}
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                    {getCombinedShoppingList().map((item) => (
                      <div 
                        key={item.key}
                        onClick={() => toggleBoughtItem(item.key)}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition text-xs border ${
                          item.checked 
                            ? 'bg-green-50/60 border-green-100 text-slate-400 line-through' 
                            : 'bg-stone-50/50 border-slate-100/50 hover:bg-purple-50/20 text-slate-700'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={item.checked} 
                          onChange={() => {}} // handled via container onClick
                          className="mt-0.5 rounded accent-purple-500 text-purple-500" 
                        />
                        <div className="flex-1">
                          <p className="font-semibold leading-tight">{item.nameStr}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{item.category} • {getScaledAmount(item.totalAmount, item.unit) || `${item.totalAmount} ${item.unit}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress indicator */}
                  <div className="pt-2 border-t border-slate-100 text-xs flex justify-between items-center text-slate-500">
                    <span>
                      Marcados: <strong>{getCombinedShoppingList().filter(i => i.checked).length}</strong> / {getCombinedShoppingList().length}
                    </span>
                    <button 
                      id="reset-list-btn"
                      onClick={() => setBoughtItems({})}
                      className="text-[10px] text-purple-600 hover:underline hover:text-purple-700 font-bold"
                    >
                      Limpar Marcas
                    </button>
                  </div>
                </div>

                {/* Gamification mini system */}
                <div className="bg-white rounded-2xl p-5 border border-purple-100/40 shadow-sm space-y-4">
                  <h4 className="font-serif font-bold text-slate-950 text-sm flex items-center gap-1.5">
                    <Award className="text-amber-500 h-4.5 w-4.5" /> Suas Conquistas Saudáveis
                  </h4>
                  
                  <div className="space-y-3">
                    {activeAchievements.slice(0, 3).map((ach) => (
                      <div key={ach.id} className="flex gap-3 items-start border-b border-stone-50 pb-2 last:border-b-0">
                        <span className={`p-2 rounded-xl text-xs flex-shrink-0 ${ach.unlocked ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-400'}`}>
                          🏅
                        </span>
                        <div>
                          <p className={`text-xs font-bold ${ach.unlocked ? 'text-slate-900' : 'text-slate-400'}`}>{ach.name}</p>
                          <p className="text-[10px] text-slate-400">{ach.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('perfil')}
                    className="w-full py-2 bg-stone-50 hover:bg-stone-100 text-slate-600 font-bold text-[11px] rounded-lg transition"
                  >
                    Ver Tudo & Recompensas Premium
                  </button>
                </div>

              </div>
            </div>

            {/* Quick Informações Section showing benefits of batch cooking */}
            <div className="bg-purple-50 border border-purple-100/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
              <div className="h-12 w-12 bg-purple-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Flame className="h-6 w-6" />
              </div>
              <div className="space-y-2 flex-1 text-center md:text-left">
                <h4 className="font-serif text-base font-bold text-slate-950">A Economia Real do Método "Menu Sem Estresse"</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                  Seguindo as compras estruturadas de forma restrita, famílias diminuem compras por impulso e cozinham tudo em bateladas eficientes de 90 minutos de domingo. Menos desperdício calórico, menos uso de delivery por desespero e zero preocupação mental na hora exausta das refeições diárias.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('marmitas')}
                className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 shrink-0 cursor-pointer"
              >
                Conhecer o Manual Técnico
              </button>
            </div>
            
          </div>
        )}

        {/* Tab 2: Biblioteca de Cardápios */}
        {activeTab === 'biblioteca' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">Biblioteca Anual Completa</h2>
              <p className="text-xs text-slate-500 font-light">Explore todos os 52 cardápios estruturados individualmente para cada semana do ano com variação equilibrada.</p>
            </div>

            {/* Selection Grid for all 52 weeks */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm space-y-6">
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 52 }).map((_, wIdx) => {
                  const weekNum = wIdx + 1;
                  const isCurrent = currentWeek === weekNum;
                  const isFavorited = favoriteWeeks.includes(weekNum);

                  return (
                    <button
                      key={weekNum}
                      id={`week-select-library-${weekNum}`}
                      onClick={() => {
                        setCurrentWeek(weekNum);
                        setActiveTab('dashboard'); // take back to explore
                      }}
                      className={`p-3 rounded-2xl text-left transition border group flex flex-col justify-between h-20 relative cursor-pointer ${
                        isCurrent 
                          ? 'bg-purple-500 text-white border-purple-600 shadow-sm' 
                          : 'bg-stone-50 hover:bg-stone-100 border-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`text-[10px] font-mono ${isCurrent ? 'text-purple-200' : 'text-slate-400'}`}>SEMANA</span>
                        {isFavorited && <span className="text-purple-600 font-serif">❤️</span>}
                      </div>
                      <span className="text-base font-serif font-bold tracking-tight">#{weekNum}</span>
                      <span className={`text-[9px] ${isCurrent ? 'text-purple-100' : 'text-slate-400'} group-hover:underline`}>Abrir no painel →</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complete Recipe Catalog lookup catalog search */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm space-y-6">
              <div>
                <h3 className="text-md sm:text-lg font-serif font-bold text-slate-950">Biblioteca Geral de Receitas Integrada</h3>
                <p className="text-xs text-slate-400">Total de mais de 780 receitas de base rotacionadas para você buscar ou favoritar na sua própria coleção.</p>
              </div>

              {/* Grid of full recipe catalog cards */}
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRecipesCatalog.map((rec) => {
                  const isFav = favorites.includes(rec.id);
                  return (
                    <div key={rec.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-[#FAF6F0]/40 flex flex-col justify-between hover:shadow-xs transition">
                      <div className="space-y-3 cursor-pointer" onClick={() => setSelectedRecipeForDetails(rec)}>
                        <div className="h-40 w-full relative bg-stone-100">
                          <img 
                            src={getDynamicRecipeImage(rec.id, rec.image, rec.name)} 
                            alt={getDynamicRecipeName(rec.id, rec.name, rec.ingredients)} 
                            className="object-cover h-full w-full"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/90 text-[9px] text-purple-700 font-bold rounded shadow-sm">
                            ⏱️ {rec.prepTime} min
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <h4 className="font-serif font-bold text-slate-950 text-sm leading-tight hover:text-purple-600 transition-colors">
                            {getDynamicRecipeName(rec.id, rec.name, rec.ingredients)}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {rec.description}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {rec.tags.map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[9px] font-bold rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-slate-100/50 flex justify-between items-center bg-white">
                        <span className="text-[10px] text-slate-400 font-mono">Dificuldade: {rec.difficulty}</span>
                        <button
                          id={`fav-toggle-btn-${rec.id}`}
                          onClick={() => toggleFavoriteRecipe(rec.id)}
                          className={`p-1.5 rounded-lg border text-xs transition ${
                            isFav 
                              ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold' 
                              : 'bg-white border-slate-100 hover:bg-stone-50 text-slate-400'
                          }`}
                        >
                          {isFav ? '❤️ Salvo' : '🤍 Favoritar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Chef IA Inteligente */}
        {activeTab === 'ia-chef' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">Assistente Inteligente "Não Sei o que Cozinhar"</h2>
              <p className="text-xs text-slate-500">Insira quais ingredientes estão disponíveis na geladeira para que a Inteligência Artificial formule uma receita prática sob medida.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left input Form column */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">🛍️ Ingredientes na Geladeira / Dispensa:</label>
                  <textarea
                    id="ai-ingredients-input"
                    value={fridgeIngredients}
                    onChange={(e) => setFridgeIngredients(e.target.value)}
                    rows={4}
                    placeholder="Ex: Ovos, frango, batata, espinafre, cebola..."
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none bg-stone-50"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Separe os alimentos por vírgula para melhor leitura do algoritmo.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">⏱️ Tempo Limite Disponível:</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="10" 
                      max="120" 
                      step="5" 
                      value={aiTime}
                      onChange={(e) => setAiTime(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                    />
                    <span className="text-xs font-bold font-mono text-purple-700 shrink-0 bg-purple-50 px-2 py-1 rounded">
                      {aiTime} min
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pb-2 border-b border-purple-50">
                  <span className="text-xs font-bold text-slate-700 block">🥗 Filtros de Dieta e Tolerância Ativos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.dietRestrictions.map(r => (
                      <span key={r} className="px-2 py-0.5 bg-purple-50 border border-purple-100 text-[10px] text-purple-700 rounded font-medium">
                        ✓ {r === 'gluten-free' ? 'Sem Glúten' : r === 'lactose-free' ? 'Sem Lactose' : r === 'vegetarian' ? 'Vegetariano' : r === 'vegan' ? 'Vegano' : r === 'low-carb' ? 'Low Carb' : 'Econômico'}
                      </span>
                    ))}
                    {profile.dietRestrictions.length === 0 && (
                      <span className="text-[10px] text-slate-400 italic">Nenhuma restrição de preferência configurada no perfil.</span>
                    )}
                  </div>
                </div>

                <button
                  id="query-ai-button"
                  onClick={handleQueryAiChef}
                  disabled={aiLoading}
                  className="w-full py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 rounded-2xl text-xs font-bold text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {aiLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Consultando IA Segura...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4.5 w-4.5" />
                      <span>Recomendar Receita com Inteligência Artificial</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right generated Recipe suggestion display column */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm min-h-[400px] flex flex-col justify-center">
                
                {aiLoading && (
                  <div className="text-center space-y-3 py-12">
                    <span className="inline-flex p-4 bg-purple-50 text-purple-500 rounded-full animate-bounce">
                      <Sparkles className="h-8 w-8" />
                    </span>
                    <h4 className="font-serif font-bold text-slate-950">Elaborando receita perfeita...</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Nossos algoritmos do Gemini estão calculando a combinação culinária perfeita para evitar desperdício de ingredientes em casa.</p>
                  </div>
                )}

                {!aiLoading && !aiResult && !aiError && (
                  <div className="text-center py-12 space-y-2">
                    <UtensilsCrossed className="h-10 w-10 text-purple-200 mx-auto" />
                    <h4 className="font-serif font-bold text-slate-600">Sua Recomendação Culinária Exclusiva em Segundos</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">Customize os ingredientes que você possui nos campos à esquerda e acione o robô. A sugestão nasce pronta em tempo real.</p>
                  </div>
                )}

                {aiError && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center space-y-3">
                    <HelpCircle className="h-8 w-8 text-purple-600 mx-auto" />
                    <h4 className="font-serif font-bold text-purple-950">Aconteceu uma restrição na conexão</h4>
                    <p className="text-xs text-purple-700 max-w-lg mx-auto">{aiError}</p>
                    <p className="text-[10px] text-slate-400">Dica: Configure sua **GEMINI_API_KEY** no canto superior direito se persistir.</p>
                  </div>
                )}

                {aiResult && (
                  <div className="space-y-6 animate-fade-in text-slate-800">
                    
                    {/* Header bar of recommended card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-55 pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 bg-purple-50 rounded text-purple-700 font-bold">🤖 Sugestão do Chef Virtual</span>
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-950 mt-1">{aiResult.recipeName}</h3>
                        <p className="text-xs text-slate-400 mt-1">Estimado para: {profile.familySize} pessoas • Categoria: {aiResult.category || 'Gourmet'}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          id="print-ai-recipe"
                          onClick={() => {
                            // Map aiResult back to Recipe structure roughly
                            const mappedRecipe: Recipe = {
                              id: 'ai-recipe-temp',
                              name: aiResult.recipeName,
                              description: aiResult.description,
                              prepTime: aiResult.prepTime || 30,
                              difficulty: aiResult.difficulty || 'Fácil',
                              category: aiResult.category || 'Gourmet',
                              tags: [],
                              ingredients: (aiResult.ingredients || []).map((i: string) => ({
                                name: i,
                                amount: i,
                                baseAmountPerPerson: 1,
                                unit: '',
                                category: 'Outros',
                                substitutes: []
                              })),
                              instructions: aiResult.instructions || [],
                              tips: aiResult.tips || [],
                              nutritionalInfo: { calories: aiResult.calories || 350, protein: 20, carbs: 30, fat: 12 },
                              image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=300'
                            };
                            handlePrint('recipe', mappedRecipe);
                          }}
                          className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Printer className="h-3.5 w-3.5" /> PDF
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl flex items-center justify-around text-xs my-4 border border-purple-100/20 text-slate-700">
                      <div>⚙️ <strong>Preparo:</strong> {aiResult.prepTime} min</div>
                      <div>🔥 <strong>Dificuldade:</strong> {aiResult.difficulty}</div>
                      <div>🥗 <strong>Calorias:</strong> {aiResult.calories} kcal</div>
                    </div>

                    <p className="text-xs italic text-slate-550 leading-relaxed bg-[#FAF6F0] p-3 rounded-lg border-l-2 border-purple-400">
                      "{aiResult.description}"
                    </p>

                    {/* Ingredients list */}
                    <div className="space-y-2 mt-4 text-xs">
                      <h4 className="font-serif font-bold text-purple-800 border-b pb-1">📋 Ingredientes Necessários:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {(aiResult.ingredients || []).map((ing: string, idx: number) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Step-by-step instructions */}
                    <div className="space-y-2 mt-4 text-xs">
                      <h4 className="font-serif font-bold text-purple-800 border-b pb-1">🍳 Modo de Preparo Inteligente:</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-slate-700 leading-relaxed">
                        {(aiResult.instructions || []).map((step: string, idx: number) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Chef Tips */}
                    <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-xs mt-4">
                      <h5 className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                        💡 Dica do Chef para Marmita Sem Água:
                      </h5>
                      <p className="text-amber-800 leading-relaxed font-light font-sans">
                        {(aiResult.tips || [])[0] || 'Deixe esfriar completamente na geladeira sem tampa antes de selar o fechamento para evitar murchamento das fibras do alimento.'}
                      </p>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Manual da Marmita Sem Água */}
        {activeTab === 'marmitas' && (
          <div className="space-y-6 animate-fade-in text-slate-800">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">Manual da Marmita Sem Água</h2>
              <p className="text-xs text-slate-500 font-light">Elimine de vez a textura molenga, a perda de nutrientes e o temido gosto de comida requentada da sua semana.</p>
            </div>

            {/* Techniques split into bento layout */}
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Box 1: Congelamento */}
              <div className="bg-white rounded-3xl p-6 border border-purple-100/40 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
                  <span className="p-2 bg-purple-50 text-purple-700 rounded-xl font-bold">❄️</span>
                  <div>
                    <h3 className="font-serif font-bold text-slate-950 text-sm sm:text-base">1. Como Congelar</h3>
                    <p className="text-[10px] text-slate-400">Técnicas de fixação de sabor e frescor</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {MANUAL_MARMITA.freezing.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <h5 className="font-bold text-purple-700">{item.title}</h5>
                      <p className="text-slate-500 leading-relaxed font-light">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Descongelamento */}
              <div className="bg-white rounded-3xl p-6 border border-purple-100/40 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
                  <span className="p-2 bg-blue-50 text-blue-700 rounded-xl font-bold">💧</span>
                  <div>
                    <h3 className="font-serif font-bold text-slate-950 text-sm sm:text-base">2. Como Descongelar</h3>
                    <p className="text-[10px] text-slate-400">Preservação integral da textura animal/vegetal</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {MANUAL_MARMITA.thawing.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <h5 className="font-bold text-indigo-700">{item.title}</h5>
                      <p className="text-slate-500 leading-relaxed font-light">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3: Reaquecimento */}
              <div className="bg-white rounded-3xl p-6 border border-purple-100/40 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
                  <span className="p-2 bg-purple-50 text-purple-700 rounded-xl font-bold">🔥</span>
                  <div>
                    <h3 className="font-serif font-bold text-slate-950 text-sm sm:text-base">3. Como Aquecer</h3>
                    <p className="text-[10px] text-slate-400">Hidratação restaurada estilo restaurante</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {MANUAL_MARMITA.heating.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <h5 className="font-bold text-amber-700">{item.title}</h5>
                      <p className="text-slate-500 leading-relaxed font-light">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Graphic bento summary with printing link */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase">Imprimir Versão Livro</span>
                <h4 className="font-serif font-bold text-lg">Deseja pregar este manual na porta da sua geladeira?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Geramos uma versão de layout limpa, diagramada especificamente para impressão residencial em papel comum A4 ou encadernação de guia de bolso. Perfeito para manter a rotina fluida na cozinha para toda a família ou empregados domésticos lerem.
                </p>
              </div>
              <button 
                onClick={() => handlePrint('manual')}
                className="px-5 py-3 bg-purple-500 text-white rounded-xl text-xs font-semibold hover:bg-purple-600 transition shadow-lg shadow-purple-500/20"
              >
                Gerar Versão Premium para Impressão
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Guia de Embalagens */}
        {activeTab === 'embalagens' && (
          <div className="space-y-6 animate-fade-in text-slate-800">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">Guia Inteligente de Embalagens Recomendadas</h2>
              <p className="text-xs text-slate-500">Compare as melhores soluções em vidro, alumínio, silicone e plástico recomendadas para congelamento e preparos saudáveis.</p>
            </div>

            {/* Packs comparative grid layout */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {EMBALAGEM_GUIDES.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-purple-100/40 p-5 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="h-32 w-full rounded-2xl bg-stone-100 overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="object-cover h-full w-full"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-purple-500 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                        ★ {item.rating.toFixed(1)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-bold">
                        {item.category === 'vidro' ? 'Vidros Robustos' : item.category === 'forno' ? 'Alumínio de Forno' : item.category === 'congelador' ? 'Saco de Silicone' : 'Plástico Leve'}
                      </span>
                      <h4 className="font-serif font-bold text-slate-950 text-sm mt-1 mb-2 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-slate-500 font-light line-clamp-3 leading-relaxed">{item.description}</p>
                    </div>

                    {/* Pros and cons */}
                    <div className="space-y-2 text-[10px] pt-1">
                      <div className="space-y-0.5">
                        <span className="font-bold text-emerald-600 block">✓ Vantagens:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-600 font-light">
                          {item.pros.slice(0, 2).map((p, idx) => <li key={idx}>{p}</li>)}
                        </ul>
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-purple-700 block">✗ Desvantagens:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-600 font-light">
                          {item.cons.slice(0, 1).map((c, idx) => <li key={idx}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 text-center">
                    <a
                      href={item.buyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                    >
                      Pesquisar na Amazon 🛒
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Calendário Alimentar */}
        {activeTab === 'calendario' && (
          <div className="space-y-6 animate-fade-in text-slate-800">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">Seu Calendário Alimentar Mensal</h2>
              <p className="text-xs text-slate-500">Acompanhe de forma farta a roteirização do mês inteiro divididos em blocos práticos.</p>
            </div>

            {/* Interactive Grid representing 4 entire weeks program */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm overflow-x-auto">
              
              <div className="min-w-[800px] space-y-6">
                
                {/* Visual Header row */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-600 pb-2 border-b">
                  <div>Segunda-feira</div>
                  <div>Terça-feira</div>
                  <div>Quarta-feira</div>
                  <div>Quinta-feira</div>
                  <div>Sexta-feira</div>
                  <div>Sábado</div>
                  <div>Domingo</div>
                </div>

                {/* Weeks renderer (we will render 4 entire simulated weeks) */}
                {[1, 2, 3, 4].map((mockWeekIdx) => {
                  const itemsWeek = generateWeeklyMenuForWeek(mockWeekIdx, profile.dietRestrictions);
                  return (
                    <div key={mockWeekIdx} className="space-y-1">
                      <div className="text-[10px] text-purple-600 font-mono font-bold uppercase tracking-wider mb-1">
                        Série Alimentar – Semana #{mockWeekIdx} do Ano {mockWeekIdx === currentWeek ? '(SEMANA SELECIONADA)' : ''}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {itemsWeek.days.map((day, dIdx) => (
                          <div 
                            key={dIdx} 
                            onClick={() => {
                              setCurrentWeek(mockWeekIdx);
                              setActiveDayIndex(dIdx);
                              setActiveTab('dashboard'); // go check!
                            }}
                            className={`p-2.5 rounded-xl border text-left transition hover:border-purple-300 cursor-pointer h-24 flex flex-col justify-between ${
                              mockWeekIdx === currentWeek
                                ? 'bg-purple-50/40 border-purple-200'
                                : 'bg-[#FAF6F0]/20 border-slate-100'
                            }`}
                          >
                            <span className="text-[9px] text-slate-400 font-semibold block">{day.dayName.split('-')[0]}</span>
                            <div className="space-y-0.5 flex-1 mt-1">
                              <span className="text-[10px] font-bold text-slate-900 block truncate" title={day.lunch.name}>
                                🌞 {day.lunch.name}
                              </span>
                              <span className="text-[10px] text-slate-600 block truncate" title={day.dinner.name}>
                                🌙 {day.dinner.name}
                              </span>
                            </div>
                            <span className="text-[8px] text-right text-purple-500 font-mono">Abrir →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Coleções & Favoritos */}
        {activeTab === 'favoritos' && (
          <div className="space-y-6 animate-fade-in text-slate-800">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">Suas Coleções de Sabores Personalizada</h2>
              <p className="text-xs text-slate-500">Gerencie todos os pratos ou semanas marcadas com coração para acesso rápido.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              
              {/* Favorited Recipes list */}
              <div className="bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-slate-950 text-base border-b pb-2">📂 Meus Pratos Favoritos</h3>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">Nenhum prato favoritado ainda.</p>
                    <button 
                      onClick={() => setActiveTab('biblioteca')} 
                      className="text-xs font-bold text-purple-600 underline mt-1"
                    >
                      Explorar Receitas
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites.map((favId) => {
                      const recMatch = RECIPE_BANK.find(r => r.id === favId);
                      if (!recMatch) return null;

                      return (
                        <div key={favId} className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-[#FAF6F0]/20 items-center justify-between">
                          <div className="flex gap-3 items-center cursor-pointer" onClick={() => setSelectedRecipeForDetails(recMatch)}>
                            <div className="h-12 w-12 bg-slate-150 rounded-xl overflow-hidden flex-shrink-0">
                              <img 
                                src={getDynamicRecipeImage(recMatch.id, recMatch.image, recMatch.name)} 
                                alt={getDynamicRecipeName(recMatch.id, recMatch.name, recMatch.ingredients)} 
                                className="object-cover h-full w-full" 
                                referrerPolicy="no-referrer" 
                              />
                            </div>
                            <div>
                              <h4 className="font-serif font-bold text-xs text-slate-900 leading-tight">
                                {getDynamicRecipeName(recMatch.id, recMatch.name, recMatch.ingredients)}
                              </h4>
                              <p className="text-[10px] text-slate-400">Preparo: {recMatch.prepTime} min • {recMatch.difficulty}</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => toggleFavoriteRecipe(favId)}
                            className="p-1 px-2 border border-purple-100 hover:bg-purple-50 text-purple-600 rounded text-[10px] font-bold"
                          >
                            Excluir 🗑️
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Favorited Weeks list */}
              <div className="bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-slate-950 text-base border-b pb-2">🗓️ Minhas Semanas de Menu Salvas</h3>
                
                {favoriteWeeks.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">Nenhuma semana favorita arquivada.</p>
                    <button 
                      onClick={() => setActiveTab('biblioteca')} 
                      className="text-xs font-bold text-purple-600 underline mt-1"
                    >
                      Explorar biblioteca
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {favoriteWeeks.map((weekNo) => (
                      <div key={weekNo} className="p-4 rounded-2xl border border-slate-100 bg-[#FAF6F0]/30 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-purple-600 font-mono font-bold">CARDÁPIO ARQUIVADO</p>
                          <h4 className="font-serif font-bold text-sm text-slate-900 mt-1">Semana de Sucesso #{weekNo}</h4>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => {
                              setCurrentWeek(weekNo);
                              setActiveTab('dashboard');
                            }}
                            className="flex-1 py-1 bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-bold text-center rounded-lg transition"
                          >
                            Ativar
                          </button>
                          <button 
                            onClick={() => toggleFavoriteWeek(weekNo)}
                            className="p-1 px-2 border border-slate-200 hover:bg-purple-50 text-slate-500 rounded text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 8: Minhas Preferências / Perfil */}
        {activeTab === 'perfil' && (
          <div className="space-y-6 animate-fade-in text-slate-800">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">Configurações de Saúde e Alimento</h2>
              <p className="text-xs text-slate-500">Mantenha seus hábitos, tamanho da família e preferências atualizados para escalonamento automático.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Form setting preferences */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm space-y-6">
                
                {/* General data */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Meu Nome de Usuária:</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 bg-stone-50 font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Integrantes na Casa (Para Escalar):</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="12"
                      value={profile.familySize}
                      onChange={(e) => setProfile(p => ({ ...p, familySize: Math.max(1, Number(e.target.value)) }))}
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 bg-stone-50 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block font-sans">Orçamento de Compras Semanal (R$):</label>
                    <input 
                      type="text" 
                      value={profile.weeklyBudget}
                      onChange={(e) => setProfile(p => ({ ...p, weeklyBudget: e.target.value }))}
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 bg-stone-50 font-mono text-purple-700 font-bold"
                    />
                  </div>
                </div>

                {/* Dietary controls checkbox list */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Restrições Alimentares Ativas:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'gluten-free', label: 'Sem Glúten' },
                      { id: 'lactose-free', label: 'Sem Lactose' },
                      { id: 'vegetarian', label: 'Vegetarianismo' },
                      { id: 'vegan', label: 'Vegano' },
                      { id: 'low-carb', label: 'Dieta Low Carb' },
                      { id: 'economical', label: 'Modelo Econômico' }
                    ].map((item) => {
                      const isChecked = profile.dietRestrictions.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => handleToggleRestriction(item.id)}
                          className={`p-3 rounded-2xl border text-center cursor-pointer transition text-xs font-semibold ${
                            isChecked 
                              ? 'bg-purple-500 border-purple-600 text-white shadow-sm' 
                              : 'bg-stone-50 border-slate-150 hover:bg-stone-100 text-slate-700'
                          }`}
                        >
                          {isChecked ? '✓ ' : ''}{item.label}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-400">Ativar essas restrições muda automaticamente todas as 52 semanas de cardápios de base adaptando os ingredientes!</p>
                </div>

                {/* Additional profile notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Outras Observações Importantes:</label>
                  <textarea
                    value={profile.prefNotes}
                    onChange={(e) => setProfile(p => ({ ...p, prefNotes: e.target.value }))}
                    rows={3}
                    placeholder="Ex: Não consumimos pimenta preta, preferimos carne magra..."
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none bg-stone-50"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      showToast("Preferências atualizadas e salvas com sucesso!", "success");
                      setActiveTab('dashboard');
                    }}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 font-semibold text-xs text-white rounded-xl shadow-lg cursor-pointer"
                  >
                    Salvar e Aplicar Alterações ✓
                  </button>
                </div>

              </div>

              {/* Achievements full checklist */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-slate-950 text-base border-b pb-2">🏆 Conquistas Descobertas</h3>
                <div className="space-y-4">
                  {activeAchievements.map((ach) => (
                    <div 
                      key={ach.id}
                      className={`p-3 rounded-2xl border flex gap-3 items-start transition ${
                        ach.unlocked 
                          ? 'bg-amber-50/10 border-amber-200 text-slate-800' 
                          : 'bg-stone-50/20 border-slate-100 text-slate-400'
                      }`}
                    >
                      <span className={`p-2.5 rounded-xl text-md shrink-0 flex items-center justify-center ${
                        ach.unlocked ? 'bg-amber-100' : 'bg-slate-100'
                      }`}>
                        {ach.unlocked ? '🏆' : '🔒'}
                      </span>
                      <div className="space-y-0.5">
                        <span className={`text-xs font-bold block ${ach.unlocked ? 'text-slate-950 font-serif' : 'text-slate-400'}`}>
                          {ach.name}
                        </span>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {ach.description}
                        </p>
                        <span className={`text-[9px] font-bold block mt-1 ${ach.unlocked ? 'text-green-600' : 'text-slate-400'}`}>
                          {ach.unlocked ? 'Concluído ✓' : 'Em progresso'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: Minha Conta */}
        {activeTab === 'minha-conta' && sessionUser && (
          <div className="space-y-6 animate-fade-in text-slate-800">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">Gerenciamento da Minha Conta</h2>
              <p className="text-xs text-slate-500">Exiba os dados do seu cadastro premium, altere suas credenciais de segurança ou encerre a sessão.</p>
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
              
              {/* Profile Details and Password Form */}
              <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm space-y-6 text-left animate-fade-in text-slate-800">
                
                {/* Visual Header */}
                <div className="flex items-center gap-4 border-b border-purple-50 pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-serif text-xl font-bold shadow shadow-purple-200">
                    {profileNewName ? profileNewName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-base">{profileNewName || 'Sua Conta'}</h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {sessionUser.id}</p>
                  </div>
                </div>

                {/* Form: Name Alteration */}
                <form onSubmit={handleUpdateName} className="space-y-4">
                  <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider pl-1 font-mono">Informações Básicas</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        value={profileNewName}
                        onChange={(e) => setProfileNewName(e.target.value)}
                        className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 bg-stone-50 font-semibold text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5 opacity-75">
                      <label className="text-xs font-bold text-slate-500 block">E-mail Cadastrado</label>
                      <input 
                        type="email" 
                        disabled
                        value={sessionUser.email || ''}
                        className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={updateNameLoading}
                      className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold text-xs rounded-xl shadow transition cursor-pointer"
                    >
                      {updateNameLoading ? 'Salvando...' : 'Atualizar Nome ✓'}
                    </button>
                  </div>
                </form>

                <hr className="border-purple-50" />

                {/* Form: Password Alteration */}
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider pl-1 font-mono">Segurança de Acesso</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Nova Senha</label>
                      <input 
                        type="password" 
                        required
                        minLength={8}
                        placeholder="Mínimo 8 caracteres"
                        value={profileNewPassword}
                        onChange={(e) => setProfileNewPassword(e.target.value)}
                        className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 bg-stone-50 text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Confirmar Nova Senha</label>
                      <input 
                        type="password" 
                        required
                        placeholder="Repita a nova senha"
                        value={profileConfirmPassword}
                        onChange={(e) => setProfileConfirmPassword(e.target.value)}
                        className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 bg-stone-50 text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={updatePwLoading}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl shadow transition cursor-pointer"
                    >
                      {updatePwLoading ? 'Alterando...' : 'Definir Nova Senha ✓'}
                    </button>
                  </div>
                </form>

              </div>

              {/* Status and Diagnostics */}
              <div className="md:col-span-12 lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100/40 shadow-sm space-y-6 text-left text-slate-800 animate-fade-in">
                <h3 className="font-serif font-bold text-slate-950 text-base border-b pb-2">Status da Assinatura</h3>
                
                <div className="space-y-4">
                  <div className="rounded-2xl bg-purple-50/50 p-4 border border-purple-100/40 text-xs text-purple-950 space-y-1">
                    <span className="font-bold text-purple-800 block">🏅 Membro VIP Select Vitalício</span>
                    <p className="opacity-80 leading-relaxed">Seu cadastro premium de pagamento único foi finalizado e validado na rede Supabase.</p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs text-slate-600">
                    <div className="flex justify-between border-b pb-1">
                      <span>Status da Conta:</span>
                      <strong className="text-green-600 font-bold">Ativa</strong>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Data de Cadastro:</span>
                      <strong>{formatDate(sessionUser.created_at)}</strong>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Nível de Segurança:</span>
                      <strong className="text-blue-600 font-bold">Alta (SSL)</strong>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Acessos Habilitados:</span>
                      <strong className="text-slate-800 font-bold">Ilimitados</strong>
                    </div>
                  </div>
                </div>

                <hr className="border-purple-50" />

                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400">Ao encerrar a sessão, você precisará digitar seu e-mail e senha correspondentes novamente para acessar os planos culinários da semana.</p>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Encerrar Sessão (Sair Conta)
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 9: Acesso Vitalício */}
        {activeTab === 'assinatura' && (
          <div className="space-y-8 animate-fade-in text-slate-800">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">Seu Portal de Acesso Vitalício</h2>
              <p className="text-xs text-slate-500">Aproveite controle absoluto de todos os 52 cardápios semanais do ano com atualizações perpétuas. Sem mensalidades ou taxas de assinatura.</p>
            </div>

            {/* Centered Lifetime Card */}
            <div className="flex justify-center">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div 
                  key={plan.id}
                  className="rounded-3xl p-8 flex flex-col justify-between transition-all relative max-w-md w-full bg-slate-900 text-white shadow-xl border-2 border-purple-500"
                >
                  <div className="space-y-6">
                    <div className="relative">
                      {plan.badge && (
                        <span className="absolute -top-11 left-0 px-2 py-0.5 bg-purple-500 text-white text-[9px] font-bold rounded">
                          {plan.badge}
                        </span>
                      )}
                      <h4 className="font-serif text-lg font-bold mt-2">{plan.name}</h4>
                      <p className="text-xs text-slate-300">Praticidade culinária premium sem esforços</p>
                    </div>

                    <div className="flex items-center gap-2">
                       <span className="text-xs font-mono uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-1 rounded font-bold">
                         {plan.price}
                       </span>
                       <span className="text-xs text-slate-400">• {plan.period}</span>
                    </div>

                    <ul className="space-y-3 text-xs">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-purple-400" />
                          <span className="text-slate-200">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      id={`btn-manage-tier-${plan.id}`}
                      onClick={() => {
                        showToast("Sua chave de acesso vitalício está ativa e validada!", "success");
                      }}
                      className="w-full py-3.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
                    >
                      ✓ Acesso Vitalício Ativo para Sempre
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Exclusive Guarantee block */}
            <div className="bg-white border border-purple-100/50 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 shadow-xs">
              <span className="h-14 w-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                🛡️
              </span>
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="font-serif text-lg font-bold text-slate-900">Garantia de Satisfação Incondicional</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Oferecemos tranquilidade absoluta para sua culinária. Se por algum motivo o Menu Sem Estresse não for perfeitamente compatível com as necessidades diárias de planejamento alimentar de sua casa nos primeiros 30 dias de uso, sinta-se totalmente confortável para acionar nosso suporte.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Recipe Detail Modal popup */}
      {selectedRecipeForDetails && (
        <div id="recipe-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-purple-100 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative animate-fade-in text-slate-800">
            
            {/* Close button top corner */}
            <button
              id="close-recipe-modal"
              onClick={() => {
                setSelectedRecipeForDetails(null);
                setActiveCookingStepIndex(null);
              }}
              className="absolute top-4 right-4 h-9 w-9 bg-stone-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold"
              title="Fechar"
            >
              ✕
            </button>

            {/* Header recipe details */}
            <div className="text-center space-y-2 pr-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-bold">
                {selectedRecipeForDetails.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">
                {getDynamicRecipeName(selectedRecipeForDetails.id, selectedRecipeForDetails.name, selectedRecipeForDetails.ingredients)}
              </h3>
              <p className="text-xs text-slate-400 italic">"{selectedRecipeForDetails.description}"</p>
            </div>

            {/* Cooked Dish Photo Banner */}
            <div className="h-44 sm:h-56 w-full rounded-2xl overflow-hidden shadow-sm relative bg-stone-100">
              <img 
                src={getDynamicRecipeImage(selectedRecipeForDetails.id, selectedRecipeForDetails.image, selectedRecipeForDetails.name)} 
                alt={getDynamicRecipeName(selectedRecipeForDetails.id, selectedRecipeForDetails.name, selectedRecipeForDetails.ingredients)} 
                className="object-cover h-full w-full"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-4 gap-2 text-center bg-[#FAF6F0] p-4 rounded-2xl text-xs text-slate-700 border border-purple-100/30">
              <div>
                <p className="text-slate-400 font-mono text-[9px] uppercase">Preparo</p>
                <p className="font-bold text-slate-900">{selectedRecipeForDetails.prepTime} min</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono text-[9px] uppercase">Dificuldade</p>
                <p className="font-bold text-slate-900">{selectedRecipeForDetails.difficulty}</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono text-[9px] uppercase">Calorias</p>
                <p className="font-bold text-slate-900">{selectedRecipeForDetails.nutritionalInfo.calories} kcal</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono text-[9px] uppercase">Proteína</p>
                <p className="font-bold text-purple-700">{selectedRecipeForDetails.nutritionalInfo.protein}g</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              
              {/* Left Column: scaled Ingredients list with active substitutions */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-purple-800 text-sm border-b pb-1">
                  📋 Ingredientes (X {profile.familySize} pessoas)
                </h4>
                
                <div className="space-y-2">
                  {selectedRecipeForDetails.ingredients.map((ing, idx) => {
                    // check substituted target
                    const activeIngName = getActiveIngredientName(selectedRecipeForDetails.id, ing);
                    const isSubbed = activeIngName !== ing.name;

                    return (
                      <div key={idx} className="flex items-start justify-between p-2 rounded-lg bg-stone-50 hover:bg-purple-50/20 text-xs">
                        <div className="space-y-0.5">
                          <strong className={isSubbed ? 'text-amber-800 font-bold' : 'text-slate-800'}>
                            {activeIngName} {isSubbed ? '(Substituído)' : ''}
                          </strong>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Categoria: {ing.category} • Quantidade: {getScaledAmount(ing.baseAmountPerPerson, ing.unit) || ing.amount}
                          </span>
                        </div>

                        {/* Interactive substitution toggle */}
                        <div className="relative inline-block text-left group">
                          <button
                            id={`swap-recipe-detail-btn-${idx}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(prev => 
                                (prev?.recipeId === selectedRecipeForDetails.id && prev?.ingredientName === ing.name)
                                  ? null 
                                  : { recipeId: selectedRecipeForDetails.id, ingredientName: ing.name }
                              );
                            }}
                            className="text-[10px] px-1.5 py-0.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-950 rounded transition font-medium cursor-pointer"
                          >
                            Trocar 🔄
                          </button>
                          
                          {/* Options drop menu popup */}
                          <div className={`absolute right-0 top-full mt-1 bg-white border border-slate-200/90 rounded-lg shadow-md z-30 min-w-[210px] p-2 text-left text-slate-800 ${
                            (activeDropdown?.recipeId === selectedRecipeForDetails.id && activeDropdown?.ingredientName === ing.name) ? 'block' : 'hidden'
                          }`}>
                            <span className="text-[9px] text-slate-400 font-bold block mb-1 border-b pb-1">Opções saudáveis:</span>
                            {isSubbed && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSwapIngredient(selectedRecipeForDetails.id, ing.name, ing.name);
                                }}
                                className="w-full text-left px-2 py-1 text-[10px] text-purple-600 font-bold hover:bg-stone-100 block cursor-pointer"
                              >
                                Reverter para {ing.name}
                              </button>
                            )}
                            {ing.substitutes.map((sub, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSwapIngredient(selectedRecipeForDetails.id, ing.name, sub);
                                }}
                                className="w-full text-left px-2 py-1 text-[10px] text-slate-700 hover:bg-stone-50 block cursor-pointer"
                              >
                                {sub}
                              </button>
                            ))}

                            {/* Additional helper choices if they want other suggestions */}
                            <p className="text-[9px] text-slate-400 font-bold mt-2 mb-1 border-t pt-1.5 px-1 font-sans">Se não gostar, outras opções:</p>
                            <div className="flex flex-wrap gap-1 px-1 mb-2">
                              {['Ovos', 'Carne de Sol', 'Couve-Flor', 'Espinafre', 'Grão-de-Bico', 'Mandioquinha']
                                .filter(extra => extra !== ing.name && !ing.substitutes.includes(extra))
                                .slice(0, 3)
                                .map((extra, eIdx) => (
                                  <button
                                    key={eIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSwapIngredient(selectedRecipeForDetails.id, ing.name, extra);
                                    }}
                                    className="bg-stone-50 hover:bg-purple-50/40 text-stone-700 hover:text-purple-700 text-[9px] border border-stone-200 rounded px-1.5 py-0.5 font-medium cursor-pointer transition"
                                  >
                                    + {extra}
                                  </button>
                                ))}
                            </div>

                            {/* Custom typing field */}
                            <div className="mt-2 pt-2 border-t border-slate-100 px-1">
                              <label className="block text-[9px] text-slate-500 font-bold mb-1">
                                Ou digite o que você quer:
                              </label>
                              <div className="flex gap-1 animate-none">
                                <input 
                                  type="text"
                                  placeholder="Ex: Mandioca, Lentilha..."
                                  value={customTypedIngredients[`${selectedRecipeForDetails.id}-${ing.name}`] || ''}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomTypedIngredients(prev => ({
                                      ...prev,
                                      [`${selectedRecipeForDetails.id}-${ing.name}`]: val
                                    }));
                                  }}
                                  onKeyDown={(e) => {
                                    e.stopPropagation();
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const val = customTypedIngredients[`${selectedRecipeForDetails.id}-${ing.name}`];
                                      if (val && val.trim() !== '') {
                                        handleSwapIngredient(selectedRecipeForDetails.id, ing.name, val.trim());
                                      }
                                    }
                                  }}
                                  className="flex-1 px-1.5 py-1 text-[10px] border border-slate-300 rounded focus:outline-none focus:border-purple-400 text-slate-800 bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const val = customTypedIngredients[`${selectedRecipeForDetails.id}-${ing.name}`];
                                    if (val && val.trim() !== '') {
                                      handleSwapIngredient(selectedRecipeForDetails.id, ing.name, val.trim());
                                    }
                                  }}
                                  className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-[10px] font-bold cursor-pointer transition animate-none"
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: interactive step instructions cooking steps */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-purple-800 text-sm border-b pb-1">
                  🍳 Modo de Preparo Interativo
                </h4>

                <div className="space-y-4 text-xs">
                  {selectedRecipeForDetails.instructions.map((step, idx) => {
                    const isPassed = activeCookingStepIndex !== null && idx < activeCookingStepIndex;
                    const isActive = activeCookingStepIndex === idx;
                    const formattedStep = getFormattedStep(selectedRecipeForDetails.id, step, selectedRecipeForDetails.ingredients);

                    return (
                      <div 
                        key={idx}
                        onClick={() => setActiveCookingStepIndex(idx)}
                        className={`p-3 rounded-xl border cursor-pointer transition ${
                          isActive 
                            ? 'bg-purple-50 border-purple-300 text-purple-950 font-medium' 
                            : isPassed 
                              ? 'bg-emerald-50/40 border-emerald-100 text-slate-400 line-through'
                              : 'bg-stone-50/50 border-slate-100/50 text-slate-600'
                        }`}
                      >
                        <span className="font-serif font-bold text-purple-700 mr-1.5">Passo {idx + 1}</span>
                        <span>{formattedStep}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Tips for freezing with printing controls */}
            <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4 text-xs">
              <h5 className="font-bold text-amber-900 flex items-center gap-1.5 mb-1 bg-transparent">
                💡 Dicas do Manual para esta Receita na Marmita:
              </h5>
              <ul className="list-disc pl-5 space-y-1 text-amber-800 leading-relaxed font-light">
                {selectedRecipeForDetails.tips.map((tipStr, tIdx) => <li key={tIdx}>{tipStr}</li>)}
              </ul>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t">
              <button
                id="modal-print-recipe"
                onClick={() => handlePrint('recipe', selectedRecipeForDetails)}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Imprimir Receita
              </button>
              <button
                onClick={() => {
                  setSelectedRecipeForDetails(null);
                  setActiveCookingStepIndex(null);
                }}
                className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Fechar Receita
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Standard professional footer credits */}
      <footer className="bg-white/80 py-8 border-t border-purple-100/40 text-center text-xs mt-12 text-slate-400">
        <p>© 2026 Menu Sem Estresse. Plataforma SaaS Premium de Planejamento Familiar.</p>
        <p className="text-[10px] text-slate-400/80 mt-1">Desenvolvida com alto rigor técnico e visual para redefinir rotinas domésticas culinárias.</p>
      </footer>

      {/* Dynamic Toast Notifications */}
      {toast && (
        <div id="toast-wrapper" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full animate-fade-in print:hidden">
          <div className={`p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 border ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-950/[0.04]' 
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900 shadow-red-950/[0.04]'
              : 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-950/[0.04]'
          }`}>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-left font-semibold">
              <span className="text-base">
                {toast.type === 'success' ? '✓' : toast.type === 'error' ? '⚠' : 'ℹ'}
              </span>
              <span>{toast.message}</span>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>

    {/* Printable Area / On-Screen Lightbox Preview */}
    {printData && (
      <div id="print-overlay" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto print:static print:bg-transparent print:p-0 print:m-0 print:block">
        <div id="print-container" className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 cursor-default print:shadow-none print:max-h-none print:p-0 print:border-none print:w-full print:rounded-none relative print:bg-white print:text-slate-900">
          
          {/* Header Controls - HIDDEN DURING PRINTING */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between border-b border-purple-100 pb-4 mb-5 print:hidden">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Visualização de Impressão</h3>
              <p className="text-xs text-slate-400">Excelente para salvar em PDF no celular ou computador</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <button
                onClick={handleShare}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer flex-1 sm:flex-none justify-center"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600" /> Copiado!
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-slate-500" /> Compartilhar
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadHTML}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer flex-1 sm:flex-none justify-center"
              >
                <Download className="h-3.5 w-3.5" /> Baixar p/ Celular
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer flex-1 sm:flex-none justify-center"
              >
                <Printer className="h-3.5 w-3.5" /> Salvar PDF
              </button>
              <button
                onClick={() => setPrintData(null)}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer flex-1 sm:flex-none justify-center"
              >
                Fechar
              </button>
            </div>
          </div>

          {/* Quick tips about PDF generation on mobile/desktop - HIDDEN DURING PRINTING */}
          <div className="bg-purple-50/55 text-purple-950 text-[11px] p-3 rounded-xl mb-5 border border-purple-100/50 print:hidden flex flex-col gap-1 leading-relaxed">
            <strong className="text-purple-900 font-semibold text-xs flex items-center gap-1">📱 Dica Importante para Celular:</strong>
            <span>• Se clicar em <strong className="text-purple-800">"Salvar PDF"</strong> e não abrir nada (devido a bloqueadores de seu navegador), clique no botão azul <strong className="text-blue-800">"Baixar p/ Celular"</strong>.</span>
            <span>• O arquivo será baixado e, ao abrir, seu celular abrirá a tela de salvamento em PDF de forma nativa e 100% garantida!</span>
            <span>• Você também pode clicar em <strong className="text-purple-800">"Compartilhar"</strong> para enviar o texto formatado diretamente para seu WhatsApp.</span>
          </div>

          {/* Actual Document Content */}
          <div id="print-sheet" className="bg-white text-slate-900 text-left print:p-0">
            {printData.type === 'menu' && (
              <div className="font-serif">
                <div className="text-center pb-6 mb-8 border-b-2 border-purple-300">
                  <h1 className="text-3xl font-bold text-purple-800 tracking-tight">Menu Sem Estresse Premium</h1>
                  <p className="text-sm text-slate-500 mt-1">Plano Semanal Especial • Semana {currentWeek} do Ano</p>
                  <p className="text-xs text-slate-400 mt-0.5">Preparado para: Família de {profile.familySize} pessoas</p>
                </div>
                
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-purple-100/60 text-purple-900 border-b border-purple-200">
                      <th className="p-3 text-left font-serif font-bold text-sm">Dia da Semana</th>
                      <th className="p-3 text-left font-serif font-bold text-sm">🌞 Janta Recomendada</th>
                      <th className="p-3 text-left font-serif font-bold text-sm">🌙 Jantar Prático</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyMenu.days.map((day, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-4 font-bold text-sm text-purple-800 align-top w-1/4">{day.dayName}</td>
                        <td className="p-4 align-top w-3/8">
                          <div className="font-semibold text-sm text-slate-950">{day.lunch.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Tempo: {day.lunch.prepTime} min | Dificuldade: {day.lunch.difficulty}
                          </div>
                        </td>
                        <td className="p-4 align-top w-3/8">
                          <div className="font-semibold text-sm text-slate-950">{day.dinner.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Tempo: {day.dinner.prepTime} min | Dificuldade: {day.dinner.difficulty}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-16 text-center text-[10px] text-slate-400 border-t pt-4">
                  © 2026 Menu Sem Estresse. Feito sob medida para você focar no que realmente importa.
                </div>
              </div>
            )}

            {printData.type === 'shopping' && (() => {
              const slItems = getCombinedShoppingList();
              const categories = Array.from(new Set(slItems.map(i => i.category)));
              return (
                <div className="font-sans">
                  <div className="text-center pb-6 mb-8 border-b-2 border-purple-300">
                    <h1 className="text-3xl font-bold text-purple-800 tracking-tight">Lista de Compras Inteligente</h1>
                    <p className="text-sm text-slate-500 mt-1">Referência: Semana {currentWeek} • Família de {profile.familySize} pessoas</p>
                    <p className="text-xs text-slate-400 mt-1 bg-slate-50 p-2 rounded inline-block">
                      Organize antes de ir ao mercado para otimizar a rota e economizar.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="break-inside-avoid">
                        <h3 className="text-sm font-bold text-purple-800 border-b border-purple-200 pb-1 mb-3">
                          📁 Setor: {cat}
                        </h3>
                        <ul className="space-y-2">
                          {slItems.filter(i => i.category === cat).map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start text-xs py-1.5 border-b border-dashed border-slate-100">
                              <span className="inline-block w-4 h-4 border border-slate-300 rounded mr-3 mt-0.5 flex-shrink-0"></span>
                              <div>
                                <span className="font-semibold text-slate-800">{item.nameStr}</span>
                                <span className="mx-2 text-slate-400">—</span>
                                <span className="text-slate-500">
                                  {getScaledAmount(item.totalAmount, item.unit) || `${item.totalAmount} ${item.unit}`}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 text-center text-[10px] text-slate-400 border-t pt-4">
                    Impresso via Plataforma Digital Menu Sem Estresse. Economize até 30% em desperdício doméstico.
                  </div>
                </div>
              );
            })()}

            {printData.type === 'recipe' && printData.recipe && (() => {
              const r = printData.recipe;
              return (
                <div className="font-serif">
                  <div className="text-center pb-6 mb-8 border-b-2 border-purple-300">
                    <span className="text-[10px] font-mono tracking-wider text-purple-600 font-bold uppercase block mb-1">
                      Receita Saudável Integrada
                    </span>
                    <h1 className="text-3xl font-bold text-purple-900 leading-tight">{r.name}</h1>
                    <p className="text-sm italic text-slate-600 mt-1.5 max-w-lg mx-auto">"{r.description}"</p>
                  </div>

                  <div className="grid grid-cols-4 gap-4 bg-purple-50/50 rounded-xl p-4 mb-8 text-center text-xs text-slate-700 border border-purple-100">
                    <div>⏱️ <strong>Preparo:</strong> <br/>{r.prepTime} min</div>
                    <div>🔥 <strong>Dificuldade:</strong> <br/>{r.difficulty}</div>
                    <div>🍲 <strong>Categoria:</strong> <br/>{r.category}</div>
                    <div>⚡ <strong>Calorias:</strong> <br/>{r.nutritionalInfo.calories} kcal</div>
                  </div>

                  <div className="mb-8 font-sans">
                    <h3 className="text-base font-bold text-purple-800 border-b border-purple-200 pb-1.5 mb-3">
                      📋 Ingredientes (Calculado para {profile.familySize} pessoas)
                    </h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-800">
                      {r.ingredients.map((ing, iIdx) => (
                        <li key={iIdx}>
                          <strong>{getActiveIngredientName(r.id, ing)}</strong>: {getScaledAmount(ing.baseAmountPerPerson, ing.unit) || ing.amount} ({ing.category})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8 font-sans">
                    <h3 className="text-base font-bold text-purple-800 border-b border-purple-200 pb-1.5 mb-3 font-sans">
                      🍳 Passos para o Preparo
                    </h3>
                    <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-800 leading-relaxed">
                      {r.instructions.map((step, sIdx) => (
                        <li key={sIdx} className="pl-1">
                          {getFormattedStep(r.id, step, r.ingredients)}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mb-8 bg-stone-50 border-l-4 border-purple-500 rounded p-4 font-sans">
                    <h4 className="font-bold text-purple-800 text-sm mb-1.5">💡 Dicas Exclusivas do Manual</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                      {r.tips.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-16 text-center text-[10px] text-slate-400 border-t pt-4">
                    © 2026 Menu Sem Estresse. Feito sob medida para sua família.
                  </div>
                </div>
              );
            })()}

            {printData.type === 'manual' && (
              <div className="font-serif">
                <div className="text-center pb-6 mb-8 border-b-2 border-purple-300">
                  <span className="text-[10px] font-mono tracking-wider text-purple-600 font-bold uppercase block mb-1">
                    Uso Doméstico Premium
                  </span>
                  <h1 className="text-3xl font-bold text-purple-900 leading-tight">Manual da Marmita Sem Água</h1>
                  <p className="text-sm italic text-slate-600 mt-1">Como preparar, congelar e reaquecer com perfeição</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-bold text-purple-800 border-b border-purple-200 pb-1 mb-3">
                      1. Congelamento Perfeito
                    </h2>
                    <div className="space-y-4">
                      {MANUAL_MARMITA.freezing.map((item, idx) => (
                        <div key={idx} className="break-inside-avoid">
                          <h4 className="font-sans font-bold text-sm text-slate-900">{idx + 1}. {item.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-purple-800 border-b border-purple-200 pb-1 mb-3">
                      2. Descongelamento Seguro
                    </h2>
                    <div className="space-y-4">
                      {MANUAL_MARMITA.thawing.map((item, idx) => (
                        <div key={idx} className="break-inside-avoid">
                          <h4 className="font-sans font-bold text-sm text-slate-900">{idx + 1}. {item.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-purple-800 border-b border-purple-200 pb-1 mb-3">
                      3. Reaquecimento Inteligente
                    </h2>
                    <div className="space-y-4">
                      {MANUAL_MARMITA.heating.map((item, idx) => (
                        <div key={idx} className="break-inside-avoid">
                          <h4 className="font-sans font-bold text-sm text-slate-900">{idx + 1}. {item.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-16 text-center text-[10px] text-slate-400 border-t pt-4">
                  © 2026 Menu Sem Estresse. Manual Exclusivo para Clientes Select.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </>
);
}
