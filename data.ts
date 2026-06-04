// Meal plan data
export const DAYS = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"] as const

export type DayName = typeof DAYS[number]

export interface MealItem {
  item: string
  qty: string
  isCreatine?: boolean
}

export interface DayMeals {
  [mealName: string]: MealItem[]
}

export const MEAL_ORDER = ["Cafe da Manha", "Almoco", "Lanche da Tarde", "Jantar"] as const

export type MealName = typeof MEAL_ORDER[number]

export const MEALS: Record<DayName, Record<MealName, MealItem[]>> = {
  Segunda: {
    "Cafe da Manha": [
      { item: "Ovos mexidos", qty: "3 unidades" },
      { item: "Pao integral", qty: "2 fatias" },
      { item: "Cafe preto", qty: "200ml" },
    ],
    Almoco: [
      { item: "Frango grelhado", qty: "200g" },
      { item: "Arroz integral", qty: "4 col. de sopa" },
      { item: "Feijao", qty: "2 conchas" },
      { item: "Salada de folhas", qty: "a vontade" },
    ],
    "Lanche da Tarde": [
      { item: "Banana", qty: "1 unidade" },
      { item: "Iogurte zero", qty: "170g" },
      { item: "Creatina", qty: "5g (1 dose)", isCreatine: true },
    ],
    Jantar: [
      { item: "Frango assado com temperos", qty: "200g" },
      { item: "Batata-doce cozida", qty: "150g" },
      { item: "Brocolis refogado", qty: "100g" },
    ],
  },
  Terca: {
    "Cafe da Manha": [
      { item: "Omelete de frango", qty: "3 ovos + 80g frango" },
      { item: "Cafe preto", qty: "200ml" },
    ],
    Almoco: [
      { item: "Frango desfiado refogado", qty: "200g" },
      { item: "Arroz integral", qty: "4 col. de sopa" },
      { item: "Feijao", qty: "2 conchas" },
      { item: "Couve refogada", qty: "100g" },
    ],
    "Lanche da Tarde": [
      { item: "Iogurte zero", qty: "170g" },
      { item: "Amendoim", qty: "30g" },
      { item: "Creatina", qty: "5g (1 dose)", isCreatine: true },
    ],
    Jantar: [
      { item: "Frango grelhado", qty: "180g" },
      { item: "Macarrao integral", qty: "80g seco" },
      { item: "Molho de tomate caseiro", qty: "3 col. de sopa" },
    ],
  },
  Quarta: {
    "Cafe da Manha": [
      { item: "Tapioca com ovo mexido", qty: "2 unidades + 2 ovos" },
      { item: "Cafe com leite desnatado", qty: "200ml" },
    ],
    Almoco: [
      { item: "Frango grelhado", qty: "200g" },
      { item: "Arroz integral", qty: "4 col. de sopa" },
      { item: "Feijao", qty: "2 conchas" },
      { item: "Cenoura e beterraba ralada", qty: "100g" },
    ],
    "Lanche da Tarde": [
      { item: "Iogurte zero", qty: "170g" },
      { item: "Banana", qty: "1 unidade" },
      { item: "Creatina", qty: "5g (1 dose)", isCreatine: true },
    ],
    Jantar: [
      { item: "Omelete de 3 ovos com legumes", qty: "1 porcao" },
      { item: "Espinafre refogado", qty: "100g" },
      { item: "Pao integral", qty: "1 fatia" },
    ],
  },
  Quinta: {
    "Cafe da Manha": [
      { item: "Mingau de aveia com banana", qty: "200ml" },
      { item: "Ovos cozidos", qty: "2 unidades" },
      { item: "Cafe preto", qty: "200ml" },
    ],
    Almoco: [
      { item: "Frango assado com alho", qty: "200g" },
      { item: "Pure de batata-doce", qty: "150g" },
      { item: "Vagem refogada", qty: "100g" },
      { item: "Salada de tomate e pepino", qty: "a vontade" },
    ],
    "Lanche da Tarde": [
      { item: "Iogurte zero", qty: "170g" },
      { item: "Mel", qty: "1 col. de cha" },
      { item: "Creatina", qty: "5g (1 dose)", isCreatine: true },
    ],
    Jantar: [
      { item: "Frango grelhado", qty: "200g" },
      { item: "Arroz integral", qty: "3 col. de sopa" },
      { item: "Abobrinha grelhada", qty: "120g" },
    ],
  },
  Sexta: {
    "Cafe da Manha": [
      { item: "Panqueca de aveia e ovo", qty: "3 unidades (2 ovos)" },
      { item: "Mel", qty: "1 col. de cha" },
      { item: "Cafe preto", qty: "200ml" },
    ],
    Almoco: [
      { item: "Frango grelhado", qty: "200g" },
      { item: "Arroz integral", qty: "4 col. de sopa" },
      { item: "Feijao", qty: "2 conchas" },
      { item: "Alface e rucula", qty: "a vontade" },
    ],
    "Lanche da Tarde": [
      { item: "Iogurte zero com granola", qty: "170g + 20g" },
      { item: "Creatina", qty: "5g (1 dose)", isCreatine: true },
    ],
    Jantar: [
      { item: "Frango assado com ervas", qty: "200g" },
      { item: "Batata-doce assada", qty: "150g" },
      { item: "Chuchu refogado", qty: "100g" },
    ],
  },
  Sabado: {
    "Cafe da Manha": [
      { item: "Ovos estrelados", qty: "3 unidades" },
      { item: "Tapioca", qty: "1 unidade" },
      { item: "Suco de laranja natural", qty: "200ml" },
    ],
    Almoco: [
      { item: "Frango grelhado (churrasco)", qty: "250g" },
      { item: "Arroz integral", qty: "4 col. de sopa" },
      { item: "Vinagrete", qty: "100g" },
      { item: "Feijao", qty: "2 conchas" },
    ],
    "Lanche da Tarde": [
      { item: "Iogurte zero", qty: "170g" },
      { item: "Amendoim", qty: "30g" },
      { item: "Creatina", qty: "5g (1 dose)", isCreatine: true },
    ],
    Jantar: [
      { item: "Salada com frango desfiado", qty: "1 bowl grande" },
      { item: "Azeite e limao", qty: "a gosto" },
      { item: "Pao integral", qty: "2 fatias" },
    ],
  },
  Domingo: {
    "Cafe da Manha": [
      { item: "Vitamina de banana com aveia e ovo", qty: "300ml" },
      { item: "Torrada integral", qty: "2 unidades" },
      { item: "Requeijao light", qty: "1 col. de sopa" },
    ],
    Almoco: [
      { item: "Frango ao molho (tomate + alho)", qty: "200g" },
      { item: "Arroz integral", qty: "4 col. de sopa" },
      { item: "Feijao", qty: "2 conchas" },
      { item: "Farofa de mandioca light", qty: "2 colheres" },
    ],
    "Lanche da Tarde": [
      { item: "Iogurte zero com frutas picadas", qty: "170g + 80g" },
      { item: "Creatina", qty: "5g (1 dose)", isCreatine: true },
    ],
    Jantar: [
      { item: "Omelete de frango e queijo", qty: "3 ovos + 80g frango" },
      { item: "Legumes assados (berinjela, pimentao)", qty: "150g" },
      { item: "Arroz integral", qty: "3 col. de sopa" },
    ],
  },
}

// Shopping list data
export interface ShoppingItem {
  item: string
  qty: string
  tip: string
}

export interface ShoppingCategory {
  cat: string
  icon: string
  items: ShoppingItem[]
}

export const SHOPPING: ShoppingCategory[] = [
  {
    cat: "Proteinas",
    icon: "drumstick",
    items: [
      { item: "Peito de frango", qty: "2,5 kg", tip: "Base da semana toda" },
      { item: "Ovos", qty: "2 duzias", tip: "Cafe, omelete e panqueca" },
      { item: "Atum em lata", qty: "2 latas", tip: "Salada do sabado" },
      { item: "Tilapia ou sardinha", qty: "400g", tip: "Opcao de jantar" },
    ],
  },
  {
    cat: "Laticinios",
    icon: "milk",
    items: [
      { item: "Iogurte zero", qty: "7 unidades", tip: "1 por dia no lanche" },
      { item: "Requeijao light", qty: "1 pote", tip: "Cafe de domingo" },
      { item: "Leite desnatado", qty: "500ml", tip: "Cafe de quarta" },
    ],
  },
  {
    cat: "Carboidratos",
    icon: "wheat",
    items: [
      { item: "Arroz integral", qty: "1 kg", tip: "Toda semana" },
      { item: "Feijao", qty: "500g", tip: "Cozinhar em quantidade" },
      { item: "Batata-doce", qty: "1 kg", tip: "Pre/pos treino" },
      { item: "Pao integral", qty: "1 pacote", tip: "Cafe e lanches" },
      { item: "Aveia em flocos", qty: "500g", tip: "Mingau e panqueca" },
      { item: "Tapioca (goma)", qty: "500g", tip: "Quarta e sabado" },
      { item: "Macarrao integral", qty: "500g", tip: "Jantar de terca" },
    ],
  },
  {
    cat: "Legumes e Verduras",
    icon: "salad",
    items: [
      { item: "Brocolis", qty: "1 cabeca", tip: "Jantar segunda" },
      { item: "Abobrinha", qty: "2 unidades", tip: "Versatil e barata" },
      { item: "Chuchu", qty: "2 unidades", tip: "Jantar sexta" },
      { item: "Couve", qty: "1 maco", tip: "Almoco terca" },
      { item: "Cenoura", qty: "3 unidades", tip: "Almoco quarta" },
      { item: "Tomate", qty: "4 unidades", tip: "Salada e molho" },
      { item: "Alface e rucula", qty: "1 pe cada", tip: "Saladas" },
      { item: "Pepino", qty: "2 unidades", tip: "Salada quinta" },
      { item: "Berinjela", qty: "1 unidade", tip: "Domingo" },
      { item: "Pimentao", qty: "2 unidades", tip: "Domingo" },
    ],
  },
  {
    cat: "Frutas",
    icon: "apple",
    items: [
      { item: "Banana", qty: "1 cacho (6-8)", tip: "Lanche e vitamina" },
      { item: "Mamao", qty: "1 unidade", tip: "Cafe terca" },
      { item: "Maca", qty: "3 unidades", tip: "Lanches" },
      { item: "Laranja", qty: "4 unidades", tip: "Suco sabado" },
    ],
  },
  {
    cat: "Temperos e Extras",
    icon: "flask-conical",
    items: [
      { item: "Alho", qty: "1 cabeca", tip: "Tempero base" },
      { item: "Azeite de oliva", qty: "1 vidro pequeno", tip: "Com moderacao" },
      { item: "Molho de tomate", qty: "1 lata", tip: "Jantar terca" },
      { item: "Amendoim torrado sem sal", qty: "200g", tip: "Lanches baratos" },
      { item: "Mel", qty: "1 pote pequeno", tip: "Panqueca e iogurte" },
      { item: "Granola sem acucar", qty: "200g", tip: "Iogurte sexta" },
      { item: "Creatina monohidratada", qty: "ver estoque", tip: "5g/dia no lanche" },
      { item: "Cafe", qty: "1 pacote", tip: "Diario" },
    ],
  },
]

// Recipes data
export interface Recipe {
  name: string
  cat: string
  freeze: boolean
  ingr: string
  steps: string[]
  tip: string
}

export const RECIPES: Recipe[] = [
  {
    name: "Frango Grelhado com Ervas",
    cat: "Proteina",
    freeze: true,
    ingr: "200g peito de frango - azeite - alho - sal - pimenta - ervas a gosto",
    steps: [
      "Bata levemente o frango para espessar uniforme.",
      "Tempere com alho amassado, sal, pimenta e ervas. Deixe marinar 15 min.",
      "Grelhe em frigideira quente com fio de azeite, 5 min cada lado.",
      "Descanse 3 min antes de cortar.",
    ],
    tip: "Para congelar: prepare em lote, embale em porcoes de 200g. Dura 3 meses no freezer.",
  },
  {
    name: "Omelete de Frango e Queijo",
    cat: "Proteina",
    freeze: false,
    ingr: "3 ovos - 80g frango desfiado - 1 fatia queijo - sal - pimenta - azeite",
    steps: [
      "Bata os ovos com sal e pimenta.",
      "Aqueca frigideira antiaderente com fio de azeite.",
      "Despeje os ovos, distribua o frango e o queijo na metade.",
      "Dobre ao meio quando as bordas firmarem. Sirva imediatamente.",
    ],
    tip: "Use frango ja cozido do lote semanal para agilizar.",
  },
  {
    name: "Panqueca de Aveia e Ovo",
    cat: "Cafe da Manha",
    freeze: true,
    ingr: "2 ovos - 3 col. sopa aveia - 1 banana madura - pitada de sal",
    steps: [
      "Amasse a banana com garfo ate virar pasta.",
      "Misture ovos, aveia e banana. Deixe repousar 3 min.",
      "Cozinhe em frigideira antiaderente, 2 min por lado.",
      "Sirva com mel ou iogurte zero.",
    ],
    tip: "Congele as panquecas prontas entre folhas de papel. Reaqueca na frigideira seca.",
  },
  {
    name: "Batata-doce Assada em Lote",
    cat: "Carboidrato",
    freeze: true,
    ingr: "1 kg batata-doce - sal grosso - azeite opcional",
    steps: [
      "Lave bem as batatas sem descascar.",
      "Corte ao meio no sentido do comprimento.",
      "Tempere com sal grosso. Forno a 200 C por 35-40 min.",
      "Deixe esfriar completamente antes de embalar.",
    ],
    tip: "Dura 1 semana na geladeira ou 2 meses no freezer.",
  },
  {
    name: "Arroz Integral Temperado",
    cat: "Carboidrato",
    freeze: true,
    ingr: "2 xicaras arroz integral - 4 xicaras agua - alho - sal - azeite",
    steps: [
      "Refogue alho amassado no azeite por 1 min.",
      "Adicione o arroz e toste por 2 min mexendo.",
      "Adicione agua quente e sal. Tampe. Cozinhe 35-40 min fogo baixo.",
      "Desligue e descanse 5 min.",
    ],
    tip: "Congele em porcoes de 4 col. de sopa. Dura 3 meses.",
  },
  {
    name: "Feijao Temperado",
    cat: "Carboidrato",
    freeze: true,
    ingr: "500g feijao - 1 cebola - 3 dentes alho - sal - louro - azeite",
    steps: [
      "Deixe o feijao de molho por 8h. Escorra.",
      "Panela de pressao com agua e louro por 20 min.",
      "Refogue cebola e alho, adicione ao feijao cozido.",
      "Tempere e cozinhe aberto 10 min para encorpar.",
    ],
    tip: "Congele em porcoes de 2 conchas. Dura 3 meses.",
  },
  {
    name: "Frango Desfiado em Lote",
    cat: "Proteina",
    freeze: true,
    ingr: "1 kg peito de frango - 1 limao - sal - alho - pimenta",
    steps: [
      "Cozinhe na pressao com agua, sal e alho por 20 min.",
      "Deixe esfriar na propria agua.",
      "Desfie com dois garfos.",
      "Tempere com limao, sal e pimenta. Divida em porcoes.",
    ],
    tip: "1 kg rende ~8 porcoes de 125g. Base pra omelete, tapioca, salada e macarrao.",
  },
  {
    name: "Brocolis Refogado com Alho",
    cat: "Vegetal",
    freeze: false,
    ingr: "1 cabeca brocolis - 3 dentes alho - azeite - sal - pimenta",
    steps: [
      "Separe em buques. Branqueie em agua fervente 2 min.",
      "Passe em agua gelada. Escorra bem.",
      "Refogue alho fatiado no azeite ate dourar.",
      "Adicione o brocolis, tempere, saltei 3 min.",
    ],
    tip: "Congele o brocolis branqueado e refogar na hora.",
  },
  {
    name: "Molho de Tomate Caseiro",
    cat: "Outros",
    freeze: true,
    ingr: "4 tomates - 1 cebola - 3 dentes alho - azeite - sal - manjericao",
    steps: [
      "Refogue cebola e alho no azeite por 3 min.",
      "Adicione tomates picados sem sementes.",
      "Cozinhe fogo medio 20 min mexendo.",
      "Tempere com sal e manjericao.",
    ],
    tip: "Congele em porcoes de 3 col. de sopa. Dura 4 meses.",
  },
]

// Financial categories
export const FIN_CATS = [
  "Proteina",
  "Vegetal",
  "Carboidrato",
  "Laticinio",
  "Fruta",
  "Tempero",
  "Outros",
] as const

export type FinCategory = typeof FIN_CATS[number]

// Prep items
export interface PrepItem {
  name: string
  unit: string
}

export const PREP_ITEMS: PrepItem[] = [
  { name: "Frango cozido/desfiado", unit: "porcoes (200g)" },
  { name: "Arroz integral", unit: "porcoes (4 col.)" },
  { name: "Feijao", unit: "porcoes (2 conchas)" },
  { name: "Batata-doce assada", unit: "porcoes (150g)" },
  { name: "Ovos cozidos", unit: "unidades" },
  { name: "Molho de tomate", unit: "porcoes (3 col.)" },
]
