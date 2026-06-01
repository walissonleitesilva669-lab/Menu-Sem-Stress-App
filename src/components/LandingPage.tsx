import React from 'react';
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
  Heart,
  Undo2,
  Lock,
  ThumbsUp
} from 'lucide-react';
import { PlanOption } from '../types';
import { SUBSCRIPTION_PLANS, FAQ_LIST } from '../data';
import Logo from './Logo';

interface LandingPageProps {
  onStartPlatform: (screen: 'login' | 'register') => void;
  onSelectPlan: (planId: string) => void;
}

export default function LandingPage({ onStartPlatform, onSelectPlan }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  return (
    <div className="bg-[#FAF6F0] text-slate-800 min-h-screen selection:bg-purple-100 selection:text-purple-950">
      {/* Premium Header */}
      <header className="border-b border-purple-100/60 bg-[#FAF6F0]/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo size="lg" />
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
              <a href="#problema" className="hover:text-purple-600 transition-colors">O Problema</a>
              <a href="#beneficios" className="hover:text-purple-600 transition-colors">Benefícios</a>
              <a href="#funcionamento" className="hover:text-purple-600 transition-colors">Como Funciona</a>
              <a href="#faq" className="hover:text-purple-600 transition-colors">Perguntas Comuns</a>
            </nav>
            <button 
              onClick={() => onStartPlatform('login')}
              className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white shadow-sm hover:shadow text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left pitch */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
              <span className="inline-flex self-center lg:self-start items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded-full">
                <Sparkles className="h-3 w-3 animate-pulse text-purple-500" /> Planejamento para Mulheres & Mães Reais
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                Nunca mais perca tempo pensando no que fazer para o almoço.
              </h1>
              <p className="text-md sm:text-lg text-slate-600 max-w-2xl font-light leading-relaxed">
                Receba cardápios completos, listas de compras estruturadas em minutos e mais de 
                <span className="font-semibold text-purple-600"> 780 receitas inteligentes</span> pensadas para o ano inteiro, 
                personalizado para as restrições alimentares de toda a sua família.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row gap-4 max-w-md w-full">
                <button
                  onClick={() => onStartPlatform('register')}
                  className="px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-purple-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer flex-grow"
                >
                  Criar Conta Grátis <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onStartPlatform('login')}
                  className="px-6 py-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-2xl shadow hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer flex-grow"
                >
                  Fazer Login
                </button>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                🔒 Acesse ou crie sua conta para conferir os melhores cardápios personalizados.
              </p>
              
              {/* Key trust indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-purple-100/60 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-serif font-bold text-slate-950">52</p>
                  <p className="text-xs text-slate-500">Semanas de Cardápio</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-serif font-bold text-slate-950">1 Clique</p>
                  <p className="text-xs text-slate-500">Lista Automática</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-serif font-bold text-slate-950">100%</p>
                  <p className="text-xs text-slate-500">Marmita Sem Água</p>
                </div>
              </div>
            </div>

            {/* Right mockup visual */}
            <div className="lg:col-span-5 relative w-full flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/30 to-amber-200/20 rounded-full filter blur-3xl opacity-70"></div>
              
              {/* Static Beautiful Culinary Asset */}
              <div className="relative border border-white/80 bg-white/40 backdrop-blur-sm p-4 rounded-3xl shadow-2xl max-w-md w-full scale-100 hover:scale-[1.01] transition-transform overflow-hidden">
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" 
                    alt="Prato Saudável e Delicioso" 
                    className="object-cover h-full w-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Problema */}
      <section id="problema" className="py-20 bg-white border-y border-purple-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-purple-600 font-bold mb-2">A Carga Mental Invisível</h2>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
              Por que pensar no que cozinhar é mais exaustivo que cozinhar?
            </h3>
            <p className="mt-4 text-slate-600">
              Chegar às 18h exausta do trabalho ou dos cuidados com a casa, abrir a geladeira e enfrentar a eterna pergunta redundante: 
              <span className="italic font-serif font-medium text-slate-900 block mt-2 text-lg">"O que eu faço pro jantar hoje?"</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#FAF6F0] space-y-4 text-left">
              <span className="inline-flex p-3 bg-red-50 text-red-600 rounded-xl">
                <Clock className="h-6 w-6" id="prob-clock" />
              </span>
              <h4 className="font-serif text-lg font-semibold text-slate-950">Desperdício Crônico de Tempo</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Você gasta em média 45 minutes diários entre pesquisar receitas, checar o armário, ir ao supermercado esquecendo itens cruciais e decidindo cardápios improvisados.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF6F0] space-y-4 text-left">
              <span className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-xl">
                <ShoppingBag className="h-6 w-6" id="prob-shopping" />
              </span>
              <h4 className="font-serif text-lg font-semibold text-slate-950">Gasto Excessivo no Supermercado</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Comprar sem planejamento gera compras repetitivas, vegetais esquecidos apodrecendo na gaveta e gastos astronômicos de impulsividades em delivery caro.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF6F0] space-y-4 text-left">
              <span className="inline-flex p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Layers className="h-6 w-6" id="prob-layers" />
              </span>
              <h4 className="font-serif text-lg font-semibold text-slate-950">Restrições Não Atendidas</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Quando alguém na família entra na dieta Low Carb ou descobre intolerância ao glúten, o desespero de elaborar receitas saborosas e criativas triplica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Benefícios */}
      <section id="beneficios" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <img 
                src="https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=500&auto=format&fit=crop" 
                alt="Mulher organizando cozinha" 
                className="rounded-3xl shadow-xl border-4 border-white"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-purple-500 text-white p-6 rounded-2xl shadow-xl hidden sm:block max-w-[200px] text-left">
                <p className="text-2xl font-serif font-bold">100%</p>
                <p className="text-xs">Foco na saúde e leveza da sua rotina.</p>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-600 font-bold">O Método Ideal</span>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                Seu cardápio do ano inteiro desenhado para a vida real.
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed p-0">
                Nós criamos o <strong>Menu Sem Estresse</strong> para solucionar a futilidade operacional da rotina culinária. Aqui você não precisa de conhecimentos avançados em gastronomia ou de dezenas de horas livres.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <span className="p-1 text-green-600 bg-green-50 rounded-full mt-0.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm sm:text-base">Cardápios semanais dinâmicos de Segunda a Domingo</h5>
                    <p className="text-xs text-slate-500">Variações exclusivas cobrindo almoço, jantar, tempo e info calórica exata.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="p-1 text-green-600 bg-green-50 rounded-full mt-0.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm sm:text-base">Substituições inteligentes em 1 clique</h5>
                    <p className="text-xs text-slate-500">Sem frango hoje? Troque instantaneamente por carne, peixe ou soja sem bagunçar a receita.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="p-1 text-green-600 bg-green-50 rounded-full mt-0.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm sm:text-base">Módulo Marmitas Sem Água</h5>
                    <p className="text-xs text-slate-500">Aprenda a congelar, organizar e reaquecer alimentos mantendo o sabor de recém-feito.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="funcionamento" className="py-20 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-600 font-bold">Simplicidade Extrema</span>
            <h3 className="text-3xl font-serif font-bold text-slate-950 mt-2">Como Funciona a Plataforma</h3>
            <p className="text-sm text-slate-500 mt-2">Praticidade estruturada em três etapas rápidas:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-purple-100/40 shadow-sm relative text-left">
              <span className="absolute -top-4 left-8 h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold font-serif shadow-md shadow-purple-200">1</span>
              <div className="space-y-4 pt-4">
                <div className="text-purple-500"><Calendar className="h-8 w-8" /></div>
                <h4 className="font-serif text-lg font-bold">Defina suas Restrições</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Defina se prefere Sem Glúten, Lactose, Vegano, Vegetariano ou Low Carb. O sistema adapta o algoritmo instantaneamente.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-purple-100/40 shadow-sm relative text-left">
              <span className="absolute -top-4 left-8 h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold font-serif shadow-md shadow-purple-200">2</span>
              <div className="space-y-4 pt-4">
                <div className="text-purple-500"><ShoppingBag className="h-8 w-8" /></div>
                <h4 className="font-serif text-lg font-bold">Gere sua Lista</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Uma lista categorizada por setores nasce pronta calculando as porções necessárias conforme quantas pessoas moram com você.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-purple-100/40 shadow-sm relative text-left">
              <span className="absolute -top-4 left-8 h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold font-serif shadow-md shadow-purple-200">3</span>
              <div className="space-y-4 pt-4">
                <div className="text-purple-500"><Flame className="h-8 w-8" /></div>
                <h4 className="font-serif text-lg font-bold">Cozinhe ou Congele</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Aproveite as receitas práticas de até 30 minutos ou use nosso Manual Técnico de Marmitas para estocar sua semana com excelência.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos Realistas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-600 font-bold">Resultados Reais</span>
            <h3 className="text-3xl font-serif font-bold text-slate-950 mt-2">Depoimentos de Quem Já Simplificou</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FAF6F0] space-y-4 relative text-left">
              <p className="italic text-sm text-slate-600 leading-relaxed">
                "Eu gastava horas de domingo tentando bolar as marmitas da família para a semana. Com o Menu Sem Estresse, o sistema escolhe as combinações e a lista de compras sai pronta, setorizada. Economizo mais de R$ 350 por mês!"
              </p>
              <div>
                <h5 className="font-bold text-sm text-slate-900">Mariana Albuquerque</h5>
                <p className="text-[11px] text-slate-400">Mãe de 2 filhos • Advogada</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF6F0] space-y-4 relative text-left">
              <p className="italic text-sm text-slate-600 leading-relaxed">
                "O Manual de Marmitas sem Água mudou minha vida. Eu odiava o gosto de comida requentada, que sempre ficava molenga ou cheia de cristais de gelo. O truque do papel toalha úmido e as embalagens indicadas são fantásticos."
              </p>
              <div>
                <h5 className="font-bold text-sm text-slate-900">Letícia Guimarães</h5>
                <p className="text-[11px] text-slate-400">Arquiteta • Autônoma</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF6F0] space-y-4 relative text-left">
              <p className="italic text-sm text-slate-600 leading-relaxed">
                "Descobri intolerância ao glúten no ano passado e cozinhar virou um desastre. O sistema de troca rápida de ingredientes com um clique me ajudou a manter receitas gostosas sem precisar ficar lendo listas imensas na internet."
              </p>
              <div>
                <h5 className="font-bold text-sm text-slate-900">Juliana Nogueira</h5>
                <p className="text-[11px] text-slate-400">Designer Gráfica • Vegana por Opção</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-600 font-bold">Dúvidas Frequentes</span>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mt-2">Respostas para as Principais Perguntas</h3>
          </div>

          <div className="space-y-4">
            {FAQ_LIST.map((faq, index) => (
              <div 
                key={index}
                className="border border-purple-100/50 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  id={`faq-btn-${index}`}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full py-4 px-6 bg-stone-50/50 hover:bg-stone-50 text-left font-serif font-bold text-sm sm:text-base text-slate-900 flex justify-between items-center transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="text-purple-500 text-xl font-mono">{activeFaq === index ? '−' : '+'}</span>
                </button>
                {activeFaq === index && (
                  <div className="py-4 px-6 bg-white text-xs sm:text-sm text-slate-600 border-t border-purple-50 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persuasive Call out Footer */}
      <section className="bg-slate-950 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_60%)]"></div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold">Pronta para redefinir sua relação com as refeições?</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Abandone a indecisão, o desperdício alimentar e a canseira diária. Entre hoje mesmo para a comunidade do Menu Sem Estresse.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={() => onStartPlatform('register')}
              className="px-6 py-3.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-purple-500/20 hover:shadow-xl transition cursor-pointer flex-1"
            >
              Criar Conta Grátis
            </button>
            <button
              onClick={() => onStartPlatform('login')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-white font-semibold rounded-xl text-xs sm:text-sm shadow transition cursor-pointer flex-1"
            >
              Já tenho conta (Entrar)
            </button>
          </div>
        </div>
      </section>

      {/* Real footer info */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <p>© 2026 Menu Sem Estresse. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-6">
            <a href="#problema" className="hover:text-white">Termos de Uso</a>
            <a href="#beneficios" className="hover:text-white">Privacidade</a>
            <a href="#funcionamento" className="hover:text-white">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
