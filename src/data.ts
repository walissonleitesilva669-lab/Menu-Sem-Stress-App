import { Recipe, EmbalagemGuide, Achievement, PlanOption, WeeklyMenu, MealPlanDay } from './types';

export const RECIPE_BANK: Recipe[] = [
  {
    id: 'rec1',
    name: 'Frango Grelhado Cítrico com Purê de Abóbora',
    description: 'Filé de peito de frango marinado no limão e ervas, grelhado à perfeição e servido com purê rústico de abóbora cabotiá.',
    prepTime: 25,
    difficulty: 'Fácil',
    category: 'Aves',
    tags: ['Sem Glúten', 'Sem Lactose', 'Low Carb'],
    ingredients: [
      { name: 'Peito de Frango', amount: '150g', baseAmountPerPerson: 150, unit: 'g', category: 'Carnes', substitutes: ['Carne Bovina Moída', 'Filé de Tilápia', 'Tofu Defumado'] },
      { name: 'Abóbora Cabotiá', amount: '200g', baseAmountPerPerson: 200, unit: 'g', category: 'Hortifruti', substitutes: ['Batata-Doce', 'Mandioca', 'Couve-Flor'] },
      { name: 'Azeite de Oliva', amount: '1 colher de sopa', baseAmountPerPerson: 15, unit: 'ml', category: 'Temperos', substitutes: ['Óleo de Coco', 'Manteiga Ghee', 'Óleo de Abacate'] },
      { name: 'Limão Siciliano', amount: '1/2 unidade', baseAmountPerPerson: 0.5, unit: 'unid', category: 'Hortifruti', substitutes: ['Limão Taiti', 'Laranja', 'Vinagre de Maçã'] },
      { name: 'Alho triturado', amount: '1 dente', baseAmountPerPerson: 1, unit: 'dente', category: 'Temperos', substitutes: ['Cebola picada', 'Alho-Poró', 'Alho em Pó'] }
    ],
    instructions: [
      'Marine o peito de frango fatiado no suco de limão siciliano, alho, sal e pimenta-do-reino por 10 minutos.',
      'Corte a abóbora em pedaços e cozinhe no vapor até ficar bem macia.',
      'Aqueça metade do azeite em uma frigideira antiaderente e grelhe o frango por 4 minutos de cada lado ou até dourar.',
      'Amasse a abóbora cozida com um garfo, misture o restante do azeite e tempere com sal e uma pitada de noz-moscada.',
      'Sirva o frango suculento acompanhado do purê quentinho.'
    ],
    tips: [
      'Não pressione o frango enquanto grelha para manter a suculência.',
      'Para congelar, espere o purê esfriar completamente para evitar umidade excessiva.'
    ],
    nutritionalInfo: { calories: 340, protein: 32, carbs: 18, fat: 12 },
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'rec2',
    name: 'Moqueca Elegante de Banana da Terra',
    description: 'Tradicional moqueca farta e aromática que substitui a proteína animal por rodelas adocicadas de banana da terra cozidas no leite de coco caseiro e pimentões.',
    prepTime: 35,
    difficulty: 'Fácil',
    category: 'Vegetariana',
    tags: ['Sem Glúten', 'Sem Lactose', 'Vegetariano', 'Vegano', 'Econômico'],
    ingredients: [
      { name: 'Banana da Terra', amount: '1 unidade grande', baseAmountPerPerson: 1, unit: 'unid', category: 'Hortifruti', substitutes: ['Palmito Pupunha', 'Cogumelo Portobello', 'Caju Grelhado'] },
      { name: 'Pimentão Colorido (Misto)', amount: '1/2 xícara fatiado', baseAmountPerPerson: 0.5, unit: 'xícara', category: 'Hortifruti', substitutes: ['Abobrinha', 'Tomate Extra', 'Cenoura'] },
      { name: 'Leite de Coco', amount: '150ml', baseAmountPerPerson: 150, unit: 'ml', category: 'Laticínios', substitutes: ['Leite de Aveia', 'Leite de Castanhas', 'Creme de Castanha de Caju'] },
      { name: 'Molho de Tomate', amount: '3 colheres de sopa', baseAmountPerPerson: 45, unit: 'ml', category: 'Grãos', substitutes: ['Tomate Pelado', 'Extrato de Tomate', 'Pesto de Tomate Seco'] },
      { name: 'Azeite de Dendê', amount: '1 colher de chá', baseAmountPerPerson: 5, unit: 'ml', category: 'Temperos', substitutes: ['Azeite de Oliva', 'Óleo de Coco com Cúrcuma', 'Óleo de Urcum'] },
      { name: 'Coentro Fresco', amount: '1 punhado', baseAmountPerPerson: 10, unit: 'g', category: 'Hortifruti', substitutes: ['Salsinha', 'Manjericão', 'Cebolinha'] }
    ],
    instructions: [
      'Corte a banana da terra em rodelas de aproximadamente 1,5cm.',
      'Em uma panela de fundo grosso (se possível barro), distribua uma camada de cebolas, pimentões e as rodelas de banana.',
      'Regue com o leite de coco, molho de tomate e azeite de dendê. Tempere com sal.',
      'Tampe e leve ao fogo médio por 15 minutos até a banana ficar macia e o caldo encorpado.',
      'Finalize com bastante coentro fresco antes de servir.'
    ],
    tips: [
      'A banana deve estar madura com casca amarela pontilhada de preto, para dar o contraste adocicado perfeito.',
      'Sirva com arroz branco ou farofa de alho.'
    ],
    nutritionalInfo: { calories: 280, protein: 4, carbs: 42, fat: 12 },
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'rec3',
    name: 'Penne Integral de Primavera ao Molho Pesto',
    description: 'Massa integral com vegetais salteados envoltos em um sedoso e aromático molho pesto de manjericão fresco e nozes.',
    prepTime: 20,
    difficulty: 'Fácil',
    category: 'Massas',
    tags: ['Vegetariano'],
    ingredients: [
      { name: 'Penne Integral', amount: '80g', baseAmountPerPerson: 80, unit: 'g', category: 'Grãos', substitutes: ['Penne de Grão-de-Bico (Glúten-Free)', 'Espaguete de Abobrinha', 'Penne de Arroz'] },
      { name: 'Manjericão Fresco', amount: '1 xícara', baseAmountPerPerson: 1, unit: 'xícara', category: 'Hortifruti', substitutes: ['Rúcula', 'Espinafre', 'Hortelã'] },
      { name: 'Castanha de Caju', amount: '20g', baseAmountPerPerson: 20, unit: 'g', category: 'Grãos', substitutes: ['Nozes', 'Amêndoas', 'Semente de Girassol'] },
      { name: 'Queijo Parmesão Ralado', amount: '2 colheres de sopa', baseAmountPerPerson: 20, unit: 'g', category: 'Laticínios', substitutes: ['Levedura Nutricional', 'Queijo Sem Lactose', 'Tofu Amassado'] },
      { name: 'Cerejas de Tomate', amount: '50g', baseAmountPerPerson: 50, unit: 'g', category: 'Hortifruti', substitutes: ['Moranga assada nozes', 'Abobrinha fatiada', 'Brócolis picado'] },
      { name: 'Azeite de Oliva', amount: '2 colheres de sopa', baseAmountPerPerson: 30, unit: 'ml', category: 'Temperos', substitutes: ['Óleo de Abacate', 'Óleo de Amêndoas', 'Óleo de Girassol'] }
    ],
    instructions: [
      'Cozinhe o penne em água abundante com sal até ficar "al dente".',
      'No liquidificador ou mixer, bata as folhas de manjericão, castanhas, queijo parmesão ralado, metade do azeite, alho e sal até formar uma pasta rústica.',
      'Em uma frigideira rápida, salteie os tomatinhos cereja cortados ao meio com o restante do azeite por 2 minutos.',
      'Escorra a massa reservando 3 colheres de sopa da água do cozimento.',
      'Misture o penne morno ao pesto, os tomatinhos e a água reservada para emulsificar o molho.'
    ],
    tips: [
      'Para manter o verde vivo do pesto, evite aquecer demais o molho direto no fogo; misture-o sempre com a panela já desligada.',
      'Excelente opção para comer fria como salada de macarrão marmita!'
    ],
    nutritionalInfo: { calories: 460, protein: 12, carbs: 54, fat: 22 },
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'rec4',
    name: 'Filé de Peixe à Provençal com Arroz de Brócolis',
    description: 'Filé de tilápia grelhado com tomates cereja, alcaparras e azeitonas, acompanhado de arroz de couve-flor e brócolis finamente picado.',
    prepTime: 25,
    difficulty: 'Médio',
    category: 'Peixes',
    tags: ['Sem Glúten', 'Sem Lactose', 'Low Carb'],
    ingredients: [
      { name: 'Filé de Tilápia', amount: '160g', baseAmountPerPerson: 160, unit: 'g', category: 'Carnes', substitutes: ['Filé de Pescada', 'Salmão', 'Filé de Frango'] },
      { name: 'Brócolis Fresco', amount: '100g', baseAmountPerPerson: 100, unit: 'g', category: 'Hortifruti', substitutes: ['Couve-Flor', 'Vagem', 'Aspargos'] },
      { name: 'Tomate Cereja', amount: '60g', baseAmountPerPerson: 60, unit: 'g', category: 'Hortifruti', substitutes: ['Pimentão Vermelho', 'Abobrinha', 'Cebola Roxa'] },
      { name: 'Azeitona Preta', amount: '4 unidades', baseAmountPerPerson: 4, unit: 'unid', category: 'Temperos', substitutes: ['Alcaparras', 'Picles de pepino', 'Tomate Seco'] },
      { name: 'Azeite de Oliva', amount: '1 colher de sopa', baseAmountPerPerson: 15, unit: 'ml', category: 'Temperos', substitutes: ['Manteiga de Coco', 'Manteiga Ghee', 'Óleo de canola'] }
    ],
    instructions: [
      'Tempere o peixe com sal, pimenta do reino e gotas de limão.',
      'Para o arroz de brócolis: processe ou pique o brócolis e couve-flor bem miudinhos até obter textura de arroz. Refogue com alho e azeite por 5 minutos.',
      'Em outra frigideira bem quente, sele o filé de peixe com um fio de azeite por 3 minutos de cada lado.',
      'No último minuto, adicione os tomatinhos partidos ao meio e as azeitonas na frigideira do peixe para dar um susto e aquecer.',
      'Sirva o peixe por cima do arroz verde de brócolis.'
    ],
    tips: [
      'Peixes descongelam rápido e são super práticos para noites corridas.',
      'O arroz de brócolis é uma excelente alternativa com quase zero de carboidratos.'
    ],
    nutritionalInfo: { calories: 290, protein: 34, carbs: 10, fat: 12 },
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'rec5',
    name: 'Escondidinho Rústico de Carne Moída e Mandioca',
    description: 'Deliciosa combinação de purê de mandioca cremoso gratinado com recheio suculento de carne moída bem temperada com cebola, alho e cheiro-verde.',
    prepTime: 40,
    difficulty: 'Médio',
    category: 'Carne Bovina',
    tags: ['Sem Glúten', 'Econômico'],
    ingredients: [
      { name: 'Carne Moída (Patinho)', amount: '130g', baseAmountPerPerson: 130, unit: 'g', category: 'Carnes', substitutes: ['Frango desfiado', 'Lentilha Cozida', 'Carne de Jaca'] },
      { name: 'Mandioca Cozida', amount: '150g', baseAmountPerPerson: 150, unit: 'g', category: 'Hortifruti', substitutes: ['Batata Inglesa', 'Cará', 'Abóbora'] },
      { name: 'Creme de Leite Seco', amount: '1 colher de sopa', baseAmountPerPerson: 15, unit: 'ml', category: 'Laticínios', substitutes: ['Creme de Leite de Coco', 'Requeijão Lac-Free', 'Manteiga Ghee'] },
      { name: 'Cebola picada', amount: '1/2 unidade', baseAmountPerPerson: 0.5, unit: 'unid', category: 'Hortifruti', substitutes: ['Alho-Poró', 'Cebolinha', 'Cebola Roxa'] },
      { name: 'Queijo Coalho Ralado', amount: '20g', baseAmountPerPerson: 20, unit: 'g', category: 'Laticínios', substitutes: ['Queijo sem lactose', 'Levedura nutricional', 'Sem queijo (finalizar com ervas)'] }
    ],
    instructions: [
      'Cozinhe a mandioca até derreter. Processe ou amasse-a bem quente retirando os fiapos, misture ao creme de leite e sal até criar um purê liso.',
      'Refogue a cebola e o alho, junte a carne moída e cozinhe até secar a água. Corrija o sal e adicione temperinhos verdes.',
      'Em um refratário, coloque a carne moída temperada na base do prato.',
      'Cubra com o purê de mandioca alisando com as costas de uma colher úmida.',
      'Polvilhe o queijo coalho por cima e leve ao forno na função grill por 10 minutos para dourar.'
    ],
    tips: [
      'Se o purê de mandioca ficar muito denso, misture um pouquinho da água do cozimento para amaciar.',
      'Uma receita clássica de marmita que congela lindamente e não solta água se for bem montada.'
    ],
    nutritionalInfo: { calories: 420, protein: 30, carbs: 38, fat: 16 },
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'rec6',
    name: 'Estrogonofe Funcional de Shimeji',
    description: 'Versão leve e nutritiva do clássico estrogonofe, feita com cogumelos shimeji e creme de castanha ou leite de coco artesanal, sem glúten nem lactose.',
    prepTime: 25,
    difficulty: 'Fácil',
    category: 'Vegetariana',
    tags: ['Sem Glúten', 'Sem Lactose', 'Vegetariano', 'Vegano'],
    ingredients: [
      { name: 'Cogumelo Shimeji', amount: '150g', baseAmountPerPerson: 150, unit: 'g', category: 'Hortifruti', substitutes: ['Cogumelo Paris', 'Tofu em Cubos', 'Grão-de-Bico Cozido'] },
      { name: 'Creme de Coco ou Castanha', amount: '100ml', baseAmountPerPerson: 100, unit: 'ml', category: 'Laticínios', substitutes: ['Creme de leite clássico', 'Creme de aveia', 'Iogurte natural'] },
      { name: 'Passata de Tomate', amount: '2 colheres de sopa', baseAmountPerPerson: 30, unit: 'ml', category: 'Grãos', substitutes: ['Ketchup Orgânico', 'Molho de Tomate', 'Cúrcuma com Mel'] },
      { name: 'Mostarda Dijon ou Amarela', amount: '1 colher de chá', baseAmountPerPerson: 5, unit: 'ml', category: 'Temperos', substitutes: ['Mostarda em pó', 'Limão espremido', 'Salsa de Trufa'] },
      { name: 'Cebola picadinha', amount: '1/2 unidade', baseAmountPerPerson: 0.5, unit: 'unid', category: 'Hortifruti', substitutes: ['Alho-Poró', 'Cebolinha', 'Alho fresco'] }
    ],
    instructions: [
      'Separe os ramos do shimeji e limpe-os levemente com pano úmido.',
      'Em uma panela, doure a cebola no fio de azeite.',
      'Adicione os cogumelos e salteie em fogo alto por 4 minutos até que amaciem (não cozinhe demais para não soltar muita água).',
      'Despeje a passata de tomate, a mostarda e misture bem por 1 minuto.',
      'Apague o fogo, misture o creme de castanha/coco morno e ajuste o sal.'
    ],
    tips: [
      'Adicionar o creme com o fogo já desligado evita que o creme talhe ou separe.',
      'Combina deliciosamente com batata rústica assada ou arroz integral.'
    ],
    nutritionalInfo: { calories: 230, protein: 7, carbs: 14, fat: 15 },
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'rec7',
    name: 'Espaguete de Abobrinha à Bolonhesa Saudável',
    description: 'Abobrinha fresca ralada em formato de fitas de espaguete, salteada de leve e coberta com molho de tomate caseiro encorpado e patinho moído.',
    prepTime: 20,
    difficulty: 'Fácil',
    category: 'Massa Low Carb',
    tags: ['Sem Glúten', 'Sem Lactose', 'Low Carb', 'Econômico'],
    ingredients: [
      { name: 'Abobrinha Média', amount: '1 unidade', baseAmountPerPerson: 1, unit: 'unid', category: 'Hortifruti', substitutes: ['Espaguete Integral', 'Pupunha em fatias', 'Cenoura ralada'] },
      { name: 'Carne Moída (Patinho)', amount: '130g', baseAmountPerPerson: 130, unit: 'g', category: 'Carnes', substitutes: ['Frango Desfiado', 'Lentilha Cozida', 'Proteína de soja texturizada'] },
      { name: 'Molho de Tomate Rústico', amount: '1/2 xícara', baseAmountPerPerson: 0.5, unit: 'xícara', category: 'Grãos', substitutes: ['Tomate fresco esmagado', 'Passata', 'Molho pesto de tomate secos'] },
      { name: 'Manjericão Fresco', amount: '1 punhado', baseAmountPerPerson: 10, unit: 'g', category: 'Hortifruti', substitutes: ['Orégano seco', 'Salsinha', 'Coentro'] },
      { name: 'Alho', amount: '1 dente', baseAmountPerPerson: 1, unit: 'dente', category: 'Temperos', substitutes: ['Cebola picada', 'Alho seco ralado', 'Alho-Poró'] }
    ],
    instructions: [
      'Passe a abobrinha no cortador espiral ou rale no fatiador grosso para obter fitas longas.',
      'Refogue o alho no azeite, adicione a carne moída e cozinhe até dourar. Tempere com sal e noz-moscada.',
      'Acrescente o molho de tomate rústico à carne e deixe apurar em fogo baixo por 5 minutos.',
      'Em outra frigideira bem quente, salteie as fitas de abobrinha com gotas de azeite e sal por apenas 90 segundos (ela deve ficar firme, "al dente").',
      'Disponha os filamentos vegetais em uma travessa e cubra generosamente com a bolonhesa encorpada.'
    ],
    tips: [
      'Saltear a abobrinha rápido evita que ela solte água e fique molenga.',
      'Retire as sementes do centro da abobrinha antes de espiralizar se quiser reduzir ainda mais a água produzida na marmita.'
    ],
    nutritionalInfo: { calories: 250, protein: 28, carbs: 12, fat: 10 },
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'rec8',
    name: 'Feijoada Vegetariana Premium de Cogumelos',
    description: 'Versão vegana fantástica enriquecida de aromas com feijão preto, abóbora cabotiá, cogumelos shimeji e paris frescos e fumaça líquida defumada.',
    prepTime: 45,
    difficulty: 'Médio',
    category: 'Vegetariana',
    tags: ['Sem Glúten', 'Sem Lactose', 'Vegetariano', 'Vegano', 'Econômico'],
    ingredients: [
      { name: 'Feijão Preto Cozido', amount: '1 xícara com caldo', baseAmountPerPerson: 1, unit: 'xícara', category: 'Grãos', substitutes: ['Feijão Carioca', 'Feijão Branco', 'Lentilha preta'] },
      { name: 'Abóbora Cabotiá em cubos', amount: '80g', baseAmountPerPerson: 80, unit: 'g', category: 'Hortifruti', substitutes: ['Batata-Doce', 'Cenoura rústica', 'Chuchu rústico'] },
      { name: 'Cogumelos frescos mistos', amount: '80g', baseAmountPerPerson: 80, unit: 'g', category: 'Hortifruti', substitutes: ['Tofu defumado', 'Proteína de soja', 'Grão-de-Bico'] },
      { name: 'Louro desidratado', amount: '2 folhas', baseAmountPerPerson: 2, unit: 'unid', category: 'Temperos', substitutes: ['Alecrim', 'Tomilho', 'Orégano'] },
      { name: 'Couve Manteiga fatiada', amount: '1 xícara', baseAmountPerPerson: 1, unit: 'xícara', category: 'Hortifruti', substitutes: ['Repolho picadinho', 'Espinafre fresco', 'Acelga'] }
    ],
    instructions: [
      'Grelhe os cubos de abóbora e cogumelos com fios de azeite até dar uma leve tostadinha de panela.',
      'Em uma panela funda, refogue cebola e alho, despeje o feijão preto pré-cozido com as folhas de louro.',
      'Deixe o caldo ferver e adicione a abóbora assada e os cogumelos dourados.',
      'Cozinhe por 10 minutos em fogo baixo para apurar os sabores e engrossar o caldo.',
      'Sirva bem quente com couve rapidamente salteada no alho.'
    ],
    tips: [
      'Se quiser o aroma defumado clássico sem carnes, coloque 3 gotas de fumaça líquida ou 1 colher de chá de páprica defumada.',
      'Congela perfeitamente e é rica em ferro e proteínas magras.'
    ],
    nutritionalInfo: { calories: 310, protein: 14, carbs: 48, fat: 5 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop'
  }
];

export const RETIRED_RECIPES = RECIPE_BANK; // fallback catalog

export const EMBALAGEM_GUIDES: EmbalagemGuide[] = [
  {
    id: 'emb1',
    name: 'Potes de Vidro Borossilicato com Tampa de Encaixe Hermética',
    category: 'vidro',
    description: 'A joia da coroa da organização domiciliar. Suporta choques térmicos, vai do freezer direto ao micro-ondas ou forno convencional sem soltar nenhuma toxina.',
    pros: [
      'Livre de BPA e quaisquer resíduos químicos nocivos',
      'Pode ir direto ao forno, micro-ondas, freezer e lava-louças',
      'Não mancha nem pega cheiro de temperos ou molho de tomate',
      'Durabilidade de anos com ótimos cuidados de manuseio'
    ],
    cons: [
      'Preço de aquisição inicial consideravelmente mais alto',
      'Peso elevado para transporte em mochilas de trabalho',
      'Risco de quebra ou estilhaçamento em quedas acidentais'
    ],
    buyLink: 'https://www.amazon.com.br/s?k=potes+vidro+hermetico+borossilicato',
    image: 'https://images.unsplash.com/photo-1601205315512-255d4afbe1cd?q=80&w=300&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 'emb2',
    name: 'Recipientes de Alumínio Descartáveis com Tampa de Papel Metalizado',
    category: 'forno',
    description: 'Excelente opção para cozinhar lotes de escondidinhos ou massas. Podem ser assadas direto e acomodam porções perfeitas sem precisar sujar travessas de cerâmica.',
    pros: [
      'Custo unitário baixíssimo para marmitarias e volume',
      'Excelente distribuição de calor ao gratinar e assar',
      'Ideal para assados e pratos com molho denso no forno',
      'Leves e fáceis de acomodar em vãos no congelador'
    ],
    cons: [
      'Não podem ir ao micro-ondas sob hipótese alguma',
      'São descartáveis ou têm ciclo de reaproveitamento curto',
      'Exigem cuidado extra ao manusear quentes pois dobram fácil'
    ],
    buyLink: 'https://www.amazon.com.br/s?k=marmitas+aluminio+descartaveis',
    image: 'https://images.unsplash.com/photo-1601205315512-255d4afbe1cd?q=80&w=300&auto=format&fit=crop',
    rating: 4
  },
  {
    id: 'emb3',
    name: 'Sacos Herméticos Tipo Ziploc de Silicone Reutilizável de Grau Alimentício',
    category: 'congelador',
    description: 'Ideais para congelamento a vácuo, economizam um espaço gigantesco no freezer. Suportam banho-maria de forma espetacular para manter a umidade.',
    pros: [
      'Acomodação ultra compacta permitindo empilhamento horizontal',
      'Possibilitam extração manual de quase 100% do ar antes de fechar',
      'Vão ao micro-ondas e cozimento sous-vide ou banho-maria',
      'Flexibilidade total na organização de massas e caldos'
    ],
    cons: [
      'Exigem um pouco mais de cuidado e tempo na higienização de cantos',
      'Secagem demorada devido à flexibilidade interna das dobras',
      'Risco de vazão se o zíper de silicone não estiver bem pressionado'
    ],
    buyLink: 'https://www.amazon.com.br/s?k=saco+silicone+hermetico+reutilizavel',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=300&auto=format&fit=crop',
    rating: 4.5
  },
  {
    id: 'emb4',
    name: 'Potes de Plástico Polipropileno de Alta Densidade (BPA-Free)',
    category: 'microondas',
    description: 'Custo-benefício de entrada. Leves e práticos para transporte urbano, mas requerem cuidado de não superaquecer gorduras para evitar derretimento nas bordas.',
    pros: [
      'Leves e inquebráveis, adequados para correria escolar e trabalho',
      'Preço extremamente acessível em kits de 10 ou 15 peças',
      'Fáceis de encontrar em qualquer comércio físico de bairro'
    ],
    cons: [
      'Ficam amarelados ou vermelhos com molho de tomate',
      'Podem acumular odores de alho ou cebola com o tempo',
      'Bordas derretem se o alimento for aquecido por muito tempo contínuo'
    ],
    buyLink: 'https://www.amazon.com.br/s?k=potes+plastico+bpa+free+hermetico',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=300&auto=format&fit=crop',
    rating: 3.5
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach1', name: 'Primeiros Passos', description: 'Preencha suas preferências no perfil de saúde alimentar.', icon: 'UserCheck', targetCount: 1, metric: 'profile_filled', unlocked: false },
  { id: 'ach2', name: 'Semana Planejada', description: 'Ative um cardápio semanal completo economizando tempo.', icon: 'CalendarDays', targetCount: 1, metric: 'weeks_completed', unlocked: false },
  { id: 'ach3', name: 'Chef Iniciante', description: 'Adicione ou cozinhe sua 1ª receita premium da biblioteca.', icon: 'Flame', targetCount: 1, metric: 'recipes_cooked', unlocked: false },
  { id: 'ach4', name: 'Lar Organizado', description: 'Complete 4 semanas de menus e lista.', icon: 'CheckSquare', targetCount: 4, metric: 'weeks_completed', unlocked: false },
  { id: 'ach5', name: 'Economia na Ponta do Lápis', description: 'Atingiu a das compras 3 vezes.', icon: 'TrendingDown', targetCount: 3, metric: 'saved_budget', unlocked: false }
];

export const SUBSCRIPTION_PLANS: PlanOption[] = [
  {
    id: 'lifetime_access',
    name: 'Acesso Vitalício Premium',
    price: 'Ativo',
    period: 'Plano Liberado',
    badge: 'Acesso Total Garantido',
    features: [
      'Acesso completo e perpétuo aos 52 cardápios anuais',
      'Lista de compras inteligente e porcionada automaticamente',
      'Substituições de ingredientes com alteração do algoritmo em 1 clique',
      'Acesso ilimitado ao Cook-Along Interativo com modo de preparo passo-a-passo',
      'Manual Avançado de Marmitas (Congelamento rústico, Branqueamento e Toalha Úmida)',
      'Chef IA Integrado com Gemini para sugerir receitas com o que tem na geladeira',
      'Gerador de PDFs para impressão de receitas, menus e listas de mercado',
      'Zero mensalidades ou anuidades futuras'
    ],
    highlight: true,
    savings: 'Sem mensalidades para sempre'
  }
];

export const MANUAL_MARMITA = {
  freezing: [
    { title: 'Resfriamento Ultrarrápido (Crucial!)', description: 'Divida a comida quente em recipientes rasos ao invés de potes profundos e leve-os sem tampa à geladeira para esfriar rápido. Isso evita a proliferação bacteriana e a condensação térmica que gera aquela camada de pedrinhas de gelo sobre a refeição.' },
    { title: 'O Segredo Clássico dos Vegetais Firmes', description: 'Sempre faça o processo de "Branqueamento" nos hortifrutis. Cozinhe em água fervendo por apenas 2 minutos e jogue-os imediatamente em uma bacia com água e gelo. Isso trava as fibras, mantém a cor verde brilhante ativa e o vegetal firme após descongelar.' },
    { title: 'Zero Espaço para o Ar', description: 'O oxigênio é o maior vilão dos congelados. Ele oxida alimentos e atrai vapor que empedra. Se usar sacos herméticos, espreme o ar o máximo. Se pote clássico, encha quase até a borda externa deixando apenas 1cm livre (pois líquidos dilatam ao congelar).' }
  ],
  thawing: [
    { title: 'Adeus Cozinha Molenga (Fibras Preservadas)', description: 'Nunca descongele seu alimento em temperatura ambiente sobre a pia! Isso estimula bactérias nocivas nas bordas quentes enquanto o centro continua pedra. Descongele sempre com 12 a 24 horas de antecedência na prateleira da geladeira.' },
    { title: 'Descongelamento Emergencial Rápido', description: 'Caso tenha pressa absoluta, use o micro-ondas de forma inteligente na potência média 30-40% ou use a função pré-programada "Defrost / Descongelamento". Jamais use aquecimento total de primeira ou a fibra do alimento se romperá soltando inundação de suco!' }
  ],
  heating: [
    { title: 'O Truque da Toalha de Papel Úmida', description: 'Ao aquecer marmitas de arroz, carnes ou massas no micro-ondas, umedeça uma folha de papel toalha e descanse-a sobre o pote. Isso gera uma barreira de vapor úmido espetacular que hidrata novamente as fibras da carne e do arroz, impedindo que endureçam esturricados.' },
    { title: 'Banho-Maria para Massas e Caldos', description: 'Para caldos, sopas e escondidinhos de forno, use o aquecimento lento no banho-maria. Ele devolve o calor de forma envolvente de fora para dentro, preservando o brilho dos caldos e a cremosidade dos molhos com perfeição.' }
  ]
};

export const FAQ_LIST = [
  { question: 'Como vou ter acesso aos 52 cardápios do ano?', answer: 'Assim que você adquire o acesso vitalício, todos os 52 cardápios inteligentes estão totalmente disponíveis no seu painel para sempre. Você pode navegar por qualquer semana do ano, adaptar ingredientes e gerar listas instantaneamente.' },
  { question: 'A lista de compras muda se eu trocar um ingrediente?', answer: 'Sim! Esse é o maior poder do Menu Sem Estresse. Se você trocar Frango por Carne Moída com um clique, a lista de compras recalcula as quantidades corretas da nova carne e ajusta as porções.' },
  { question: 'Consigo customizar para o número de pessoas da minha casa?', answer: 'Sim! No seu perfil, mude o número exato de moradores na casa (1 a 12 pessoas). As porções e a lista de compras semanal calculam automaticamente as quantidades certas para evitar desperdícios.' },
  { question: 'O que é o Manual da Marmita Sem Água?', answer: 'É o nosso método exclusivo para preparar, congelar e reaquecer todas as marmitas da semana de forma que continuem suculentas, sem acumular cristais de gelo e sem aquela textura aguada e sem graça.' },
  { question: 'Preciso pagar mensalidades ou taxas extras?', answer: 'Não! O Menu Sem Estresse é vendido como uma compra única de Acesso Vitalício. Você adquire o acesso hoje e usa para sempre, com direito a todas as atualizações futuras de receitas sem nenhum custo adicional.' }
];

// Seed generator to produce stable deterministic menu for any of the 52 weeks
export function generateWeeklyMenuForWeek(weekNum: number, activeRestrictions: string[]): WeeklyMenu {
  // We will build a stable deterministic allocation of lunch and dinner recipes for the 7 days of the week based on recipes bank.
  // Using weekNum and dayIndex, index deterministically to ensure variety.
  const daysOfWeek = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  const filteredBank = RECIPE_BANK.filter(recipe => {
    if (activeRestrictions.length === 0) return true;
    return activeRestrictions.every(rest => {
      // mapping of restrictions (such as 'gluten-free' to tag equivalent 'Sem Glúten')
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

  // Fallback to active system if filtered is empty, just using full bank to prevent crash
  const availableRecipes = filteredBank.length > 0 ? filteredBank : RECIPE_BANK;

  const days: MealPlanDay[] = daysOfWeek.map((dayName, idx) => {
    // deterministic index calculations
    const lunchIdx = (weekNum * 3 + idx * 2) % availableRecipes.length;
    let dinnerIdx = (weekNum * 7 + idx * 3 + 1) % availableRecipes.length;
    if (dinnerIdx === lunchIdx && availableRecipes.length > 1) {
      dinnerIdx = (dinnerIdx + 1) % availableRecipes.length;
    }

    return {
      dayName,
      lunch: availableRecipes[lunchIdx],
      dinner: availableRecipes[dinnerIdx]
    };
  });

  return {
    weekNumber: weekNum,
    title: `Cardápio da Semana ${weekNum} do Ano`,
    days
  };
}
