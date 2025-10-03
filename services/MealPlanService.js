import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_KEY_CHAT = process.env.API_KEY_CHAT;
const MEAL_PLANS_KEY = '@meal_plans';
const MEAL_PREFERENCES_KEY = '@meal_preferences';

// Textos del prompt en diferentes idiomas
const promptTranslations = {
  en: {
    systemRole: 'You are an expert nutritionist who generates weekly menus in JSON format.',
    weeklyMenuIntro: 'You are an expert nutritionist. Generate a balanced and healthy weekly menu.',
    userPreferences: 'User preferences:',
    diet: 'Diet',
    servings: 'Servings',
    people: 'people',
    restrictions: 'Restrictions',
    none: 'none',
    budget: 'Budget',
    cookingLevel: 'Cooking level',
    intermittentFasting: 'Intermittent fasting: Yes (reduced eating windows, 2 main meals)',
    maxCalories: 'Maximum calories per meal',
    seasonalProducts: 'Seasonal products: Yes',
    generateDays: 'Generate 7 days (Monday to Sunday) with breakfast, lunch and dinner.',
    important: 'IMPORTANT: Respond ONLY with a valid JSON object, without additional text. Exact format:',
    requirements: 'Requirements:',
    req1: '- Variety of ingredients (do not repeat dishes)',
    req2: '- Nutritional balance',
    req3: '- Seasonal ingredients',
    req4: '- Practical and realistic recipes',
    req5: '- Reasonable preparation times',
    varietyRules: '\n\nCRITICAL RULES FOR VARIETY:\n- DO NOT repeat any main protein in the same day (if lunch has chicken, dinner must have fish, beef, pork, legumes, eggs, or another protein)\n- DO NOT use chicken more than 2 times across the entire week\n- DO NOT use salmon or fish more than 2 times across the entire week\n- MUST include at least: 1-2 beef/red meat meals, 1-2 pork meals, 2-3 fish meals (not just salmon - vary with tuna, cod, sea bass, etc.), 2 vegetarian/legume meals, 1-2 egg-based meals, 1-2 chicken meals\n- MUST vary cooking methods: grilled, baked, steamed, stir-fried, roasted, pan-seared, braised\n- MUST vary cuisines: Mediterranean, Asian, Latin American, Middle Eastern, European\n- For pasta: vary types (spaghetti, penne, lasagna, ravioli) and sauces (tomato, cream, pesto, carbonara, bolognese)\n- For salads: vary bases (lettuce, spinach, arugula, quinoa) and always include protein\n- Include diverse dishes: stews, casseroles, soups, grills, stir-fries, curries, tacos, bowls',
    varietyRulesIndividual: '\n\nIMPORTANT: Create a VARIED and INTERESTING meal. Avoid common/repetitive dishes like plain chicken salad or basic avocado toast. Be creative with proteins (beef, pork, fish varieties, legumes, eggs), cooking methods (grilled, baked, stir-fried, braised), and cuisines (Mediterranean, Asian, Latin, Middle Eastern).',
    mealTypes: { breakfast: 'breakfast', lunch: 'lunch', dinner: 'dinner' },
    chefRole: 'You are a chef who suggests meals in JSON format.',
    suggestMeal: 'Suggest a healthy and delicious',
    respondJSON: 'Respond ONLY with JSON:',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    seasons: { spring: 'spring', summer: 'summer', fall: 'fall', winter: 'winter' }
  },
  es: {
    systemRole: 'Eres un nutricionista experto que genera menús semanales en formato JSON.',
    weeklyMenuIntro: 'Eres un nutricionista experto. Genera un menú semanal balanceado y saludable.',
    userPreferences: 'Preferencias del usuario:',
    diet: 'Dieta',
    servings: 'Porciones',
    people: 'personas',
    restrictions: 'Restricciones',
    none: 'ninguna',
    budget: 'Presupuesto',
    cookingLevel: 'Nivel de cocina',
    intermittentFasting: 'Ayuno intermitente: Sí (ventanas de alimentación reducidas, 2 comidas principales)',
    maxCalories: 'Máximo de calorías por comida',
    seasonalProducts: 'Productos de temporada: Sí',
    generateDays: 'Genera 7 días (lunes a domingo) con desayuno, almuerzo y cena.',
    important: 'IMPORTANTE: Responde SOLO con un objeto JSON válido, sin texto adicional. Formato exacto:',
    requirements: 'Requisitos:',
    req1: '- Variedad de ingredientes (no repetir platos)',
    req2: '- Balance nutricional',
    req3: '- Ingredientes de temporada',
    req4: '- Recetas prácticas y realistas',
    req5: '- Tiempos de preparación razonables',
    varietyRules: '\n\nREGLAS CRÍTICAS PARA VARIEDAD:\n- NO repetir ninguna proteína principal en el mismo día (si el almuerzo tiene pollo, la cena debe tener pescado, carne, cerdo, legumbres, huevos u otra proteína)\n- NO usar pollo más de 2 veces en toda la semana\n- NO usar salmón o pescado más de 2 veces en toda la semana\n- DEBE incluir al menos: 1-2 comidas de carne roja/ternera, 1-2 comidas de cerdo, 2-3 comidas de pescado (no solo salmón - variar con atún, bacalao, lubina, etc.), 2 comidas vegetarianas/legumbres, 1-2 comidas con huevos, 1-2 comidas de pollo\n- DEBE variar métodos de cocción: a la parrilla, al horno, al vapor, salteado, asado, sellado, estofado\n- DEBE variar cocinas: mediterránea, asiática, latinoamericana, medio oriente, europea\n- Para pasta: variar tipos (espaguetis, penne, lasaña, raviolis) y salsas (tomate, nata, pesto, carbonara, boloñesa)\n- Para ensaladas: variar bases (lechuga, espinaca, rúcula, quinoa) y siempre incluir proteína\n- Incluir platos diversos: guisos, cazuelas, sopas, parrillas, salteados, currys, tacos, bowls',
    varietyRulesIndividual: '\n\nIMPORTANTE: Crea una comida VARIADA e INTERESANTE. Evita platos comunes/repetitivos como ensalada de pollo simple o tostadas básicas de aguacate. Sé creativo con proteínas (ternera, cerdo, variedades de pescado, legumbres, huevos), métodos de cocción (a la parrilla, al horno, salteado, estofado), y cocinas (mediterránea, asiática, latina, medio oriente).',
    mealTypes: { breakfast: 'desayuno', lunch: 'almuerzo', dinner: 'cena' },
    chefRole: 'Eres un chef que sugiere comidas en formato JSON.',
    suggestMeal: 'Sugiere un',
    respondJSON: 'Responde SOLO con JSON:',
    months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    seasons: { spring: 'primavera', summer: 'verano', fall: 'otoño', winter: 'invierno' }
  },
  de: {
    systemRole: 'Sie sind ein erfahrener Ernährungsberater, der Wochenmenüs im JSON-Format erstellt.',
    weeklyMenuIntro: 'Sie sind ein erfahrener Ernährungsberater. Erstellen Sie ein ausgewogenes und gesundes Wochenmenü.',
    userPreferences: 'Benutzerpräferenzen:',
    diet: 'Diät',
    servings: 'Portionen',
    people: 'Personen',
    restrictions: 'Einschränkungen',
    none: 'keine',
    budget: 'Budget',
    cookingLevel: 'Kochniveau',
    intermittentFasting: 'Intervallfasten: Ja (reduzierte Essenszeiten, 2 Hauptmahlzeiten)',
    maxCalories: 'Maximale Kalorien pro Mahlzeit',
    seasonalProducts: 'Saisonale Produkte: Ja',
    generateDays: 'Erstellen Sie 7 Tage (Montag bis Sonntag) mit Frühstück, Mittagessen und Abendessen.',
    important: 'WICHTIG: Antworten Sie NUR mit einem gültigen JSON-Objekt, ohne zusätzlichen Text. Genaues Format:',
    requirements: 'Anforderungen:',
    req1: '- Vielfalt der Zutaten (keine Wiederholung von Gerichten)',
    req2: '- Ernährungsgleichgewicht',
    req3: '- Saisonale Zutaten',
    req4: '- Praktische und realistische Rezepte',
    req5: '- Angemessene Zubereitungszeiten',
    varietyRules: '\n\nKRITISCHE REGELN FÜR VIELFALT:\n- KEIN Hauptprotein am selben Tag wiederholen (wenn Mittag Hähnchen hat, muss Abendessen Fisch, Rindfleisch, Schweinefleisch, Hülsenfrüchte, Eier oder anderes Protein haben)\n- Hähnchen NICHT mehr als 2-mal in der ganzen Woche verwenden\n- Lachs oder Fisch NICHT mehr als 2-mal in der ganzen Woche verwenden\n- MUSS mindestens enthalten: 1-2 Rindfleisch/rotes Fleisch-Gerichte, 1-2 Schweinefleisch-Gerichte, 2-3 Fischgerichte (nicht nur Lachs - variieren mit Thunfisch, Kabeljau, Wolfsbarsch usw.), 2 vegetarische/Hülsenfrucht-Gerichte, 1-2 Eier-Gerichte, 1-2 Hähnchen-Gerichte\n- MUSS Kochmethoden variieren: gegrillt, gebacken, gedämpft, pfannengerührt, gebraten, angebraten, geschmort\n- MUSS Küchen variieren: mediterran, asiatisch, lateinamerikanisch, nahöstlich, europäisch\n- Für Pasta: Typen variieren (Spaghetti, Penne, Lasagne, Ravioli) und Soßen (Tomate, Sahne, Pesto, Carbonara, Bolognese)\n- Für Salate: Basen variieren (Kopfsalat, Spinat, Rucola, Quinoa) und immer Protein einschließen\n- Diverse Gerichte einschließen: Eintöpfe, Aufläufe, Suppen, Grills, Pfannengerichte, Currys, Tacos, Bowls',
    varietyRulesIndividual: '\n\nWICHTIG: Erstellen Sie eine ABWECHSLUNGSREICHE und INTERESSANTE Mahlzeit. Vermeiden Sie gewöhnliche/sich wiederholende Gerichte wie einfachen Hähnchensalat oder einfachen Avocado-Toast. Seien Sie kreativ mit Proteinen (Rindfleisch, Schweinefleisch, Fischsorten, Hülsenfrüchte, Eier), Kochmethoden (gegrillt, gebacken, pfannengerührt, geschmort) und Küchen (mediterran, asiatisch, lateinisch, nahöstlich).',
    mealTypes: { breakfast: 'Frühstück', lunch: 'Mittagessen', dinner: 'Abendessen' },
    chefRole: 'Sie sind ein Koch, der Mahlzeiten im JSON-Format vorschlägt.',
    suggestMeal: 'Schlagen Sie ein gesundes und leckeres',
    respondJSON: 'Antworten Sie NUR mit JSON:',
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    seasons: { spring: 'Frühling', summer: 'Sommer', fall: 'Herbst', winter: 'Winter' }
  },
  fr: {
    systemRole: 'Vous êtes un nutritionniste expert qui génère des menus hebdomadaires au format JSON.',
    weeklyMenuIntro: 'Vous êtes un nutritionniste expert. Générez un menu hebdomadaire équilibré et sain.',
    userPreferences: 'Préférences de l\'utilisateur:',
    diet: 'Régime',
    servings: 'Portions',
    people: 'personnes',
    restrictions: 'Restrictions',
    none: 'aucune',
    budget: 'Budget',
    cookingLevel: 'Niveau de cuisine',
    intermittentFasting: 'Jeûne intermittent: Oui (fenêtres alimentaires réduites, 2 repas principaux)',
    maxCalories: 'Calories maximales par repas',
    seasonalProducts: 'Produits de saison: Oui',
    generateDays: 'Générez 7 jours (lundi à dimanche) avec petit-déjeuner, déjeuner et dîner.',
    important: 'IMPORTANT: Répondez UNIQUEMENT avec un objet JSON valide, sans texte supplémentaire. Format exact:',
    requirements: 'Exigences:',
    req1: '- Variété d\'ingrédients (ne pas répéter les plats)',
    req2: '- Équilibre nutritionnel',
    req3: '- Ingrédients de saison',
    req4: '- Recettes pratiques et réalistes',
    req5: '- Temps de préparation raisonnables',
    varietyRules: '\n\nRÈGLES CRITIQUES POUR LA VARIÉTÉ:\n- NE PAS répéter de protéine principale le même jour (si le déjeuner a du poulet, le dîner doit avoir du poisson, du bœuf, du porc, des légumineuses, des œufs ou une autre protéine)\n- NE PAS utiliser de poulet plus de 2 fois dans toute la semaine\n- NE PAS utiliser de saumon ou de poisson plus de 2 fois dans toute la semaine\n- DOIT inclure au moins: 1-2 repas de bœuf/viande rouge, 1-2 repas de porc, 2-3 repas de poisson (pas seulement du saumon - varier avec thon, cabillaud, bar, etc.), 2 repas végétariens/légumineuses, 1-2 repas aux œufs, 1-2 repas de poulet\n- DOIT varier les méthodes de cuisson: grillé, cuit au four, vapeur, sauté, rôti, poêlé, braisé\n- DOIT varier les cuisines: méditerranéenne, asiatique, latino-américaine, moyen-orientale, européenne\n- Pour les pâtes: varier les types (spaghetti, penne, lasagne, raviolis) et les sauces (tomate, crème, pesto, carbonara, bolognaise)\n- Pour les salades: varier les bases (laitue, épinards, roquette, quinoa) et toujours inclure des protéines\n- Inclure des plats divers: ragoûts, casseroles, soupes, grillades, sautés, currys, tacos, bols',
    varietyRulesIndividual: '\n\nIMPORTANT: Créez un repas VARIÉ et INTÉRESSANT. Évitez les plats communs/répétitifs comme la simple salade de poulet ou le toast d\'avocat basique. Soyez créatif avec les protéines (bœuf, porc, variétés de poisson, légumineuses, œufs), les méthodes de cuisson (grillé, cuit au four, sauté, braisé) et les cuisines (méditerranéenne, asiatique, latine, moyen-orientale).',
    mealTypes: { breakfast: 'petit-déjeuner', lunch: 'déjeuner', dinner: 'dîner' },
    chefRole: 'Vous êtes un chef qui suggère des repas au format JSON.',
    suggestMeal: 'Suggérez un',
    respondJSON: 'Répondez UNIQUEMENT avec JSON:',
    months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    seasons: { spring: 'printemps', summer: 'été', fall: 'automne', winter: 'hiver' }
  },
  it: {
    systemRole: 'Sei un nutrizionista esperto che genera menu settimanali in formato JSON.',
    weeklyMenuIntro: 'Sei un nutrizionista esperto. Genera un menu settimanale equilibrato e salutare.',
    userPreferences: 'Preferenze dell\'utente:',
    diet: 'Dieta',
    servings: 'Porzioni',
    people: 'persone',
    restrictions: 'Restrizioni',
    none: 'nessuna',
    budget: 'Budget',
    cookingLevel: 'Livello di cucina',
    intermittentFasting: 'Digiuno intermittente: Sì (finestre alimentari ridotte, 2 pasti principali)',
    maxCalories: 'Calorie massime per pasto',
    seasonalProducts: 'Prodotti stagionali: Sì',
    generateDays: 'Genera 7 giorni (lunedì a domenica) con colazione, pranzo e cena.',
    important: 'IMPORTANTE: Rispondi SOLO con un oggetto JSON valido, senza testo aggiuntivo. Formato esatto:',
    requirements: 'Requisiti:',
    req1: '- Varietà di ingredienti (non ripetere piatti)',
    req2: '- Equilibrio nutrizionale',
    req3: '- Ingredienti stagionali',
    req4: '- Ricette pratiche e realistiche',
    req5: '- Tempi di preparazione ragionevoli',
    varietyRules: '\n\nREGOLE CRITICHE PER LA VARIETÀ:\n- NON ripetere nessuna proteina principale nello stesso giorno (se il pranzo ha pollo, la cena deve avere pesce, manzo, maiale, legumi, uova o altra proteina)\n- NON usare pollo più di 2 volte in tutta la settimana\n- NON usare salmone o pesce più di 2 volte in tutta la settimana\n- DEVE includere almeno: 1-2 pasti di manzo/carne rossa, 1-2 pasti di maiale, 2-3 pasti di pesce (non solo salmone - variare con tonno, merluzzo, branzino, ecc.), 2 pasti vegetariani/legumi, 1-2 pasti con uova, 1-2 pasti di pollo\n- DEVE variare i metodi di cottura: alla griglia, al forno, al vapore, saltato, arrosto, scottato, brasato\n- DEVE variare le cucine: mediterranea, asiatica, latino-americana, medio-orientale, europea\n- Per la pasta: variare i tipi (spaghetti, penne, lasagne, ravioli) e le salse (pomodoro, panna, pesto, carbonara, bolognese)\n- Per le insalate: variare le basi (lattuga, spinaci, rucola, quinoa) e includere sempre proteine\n- Includere piatti diversi: stufati, casseruole, zuppe, grigliate, saltati, curry, tacos, bowl',
    varietyRulesIndividual: '\n\nIMPORTANTE: Crea un pasto VARIO e INTERESSANTE. Evita piatti comuni/ripetitivi come semplice insalata di pollo o toast basic di avocado. Sii creativo con proteine (manzo, maiale, varietà di pesce, legumi, uova), metodi di cottura (alla griglia, al forno, saltato, brasato) e cucine (mediterranea, asiatica, latina, medio-orientale).',
    mealTypes: { breakfast: 'colazione', lunch: 'pranzo', dinner: 'cena' },
    chefRole: 'Sei uno chef che suggerisce pasti in formato JSON.',
    suggestMeal: 'Suggerisci un',
    respondJSON: 'Rispondi SOLO con JSON:',
    months: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
    seasons: { spring: 'primavera', summer: 'estate', fall: 'autunno', winter: 'inverno' }
  },
  pt: {
    systemRole: 'Você é um nutricionista especialista que gera cardápios semanais em formato JSON.',
    weeklyMenuIntro: 'Você é um nutricionista especialista. Gere um cardápio semanal equilibrado e saudável.',
    userPreferences: 'Preferências do usuário:',
    diet: 'Dieta',
    servings: 'Porções',
    people: 'pessoas',
    restrictions: 'Restrições',
    none: 'nenhuma',
    budget: 'Orçamento',
    cookingLevel: 'Nível de cozinha',
    intermittentFasting: 'Jejum intermitente: Sim (janelas alimentares reduzidas, 2 refeições principais)',
    maxCalories: 'Calorias máximas por refeição',
    seasonalProducts: 'Produtos sazonais: Sim',
    generateDays: 'Gere 7 dias (segunda a domingo) com café da manhã, almoço e jantar.',
    important: 'IMPORTANTE: Responda APENAS com um objeto JSON válido, sem texto adicional. Formato exato:',
    requirements: 'Requisitos:',
    req1: '- Variedade de ingredientes (não repetir pratos)',
    req2: '- Equilíbrio nutricional',
    req3: '- Ingredientes sazonais',
    req4: '- Receitas práticas e realistas',
    req5: '- Tempos de preparação razoáveis',
    varietyRules: '\n\nREGRAS CRÍTICAS PARA VARIEDADE:\n- NÃO repetir nenhuma proteína principal no mesmo dia (se o almoço tem frango, o jantar deve ter peixe, carne bovina, porco, leguminosas, ovos ou outra proteína)\n- NÃO usar frango mais de 2 vezes em toda a semana\n- NÃO usar salmão ou peixe mais de 2 vezes em toda a semana\n- DEVE incluir pelo menos: 1-2 refeições de carne bovina/vermelha, 1-2 refeições de porco, 2-3 refeições de peixe (não apenas salmão - variar com atum, bacalhau, robalo, etc.), 2 refeições vegetarianas/leguminosas, 1-2 refeições com ovos, 1-2 refeições de frango\n- DEVE variar métodos de cozimento: grelhado, assado, no vapor, refogado, assado no forno, selado, ensopado\n- DEVE variar cozinhas: mediterrânea, asiática, latino-americana, do oriente médio, europeia\n- Para massas: variar tipos (espaguete, penne, lasanha, ravioli) e molhos (tomate, creme, pesto, carbonara, bolonhesa)\n- Para saladas: variar bases (alface, espinafre, rúcula, quinoa) e sempre incluir proteína\n- Incluir pratos diversos: ensopados, caçarolas, sopas, grelhados, refogados, curries, tacos, bowls',
    varietyRulesIndividual: '\n\nIMPORTANTE: Crie uma refeição VARIADA e INTERESSANTE. Evite pratos comuns/repetitivos como salada de frango simples ou torrada básica de abacate. Seja criativo com proteínas (carne bovina, porco, variedades de peixe, leguminosas, ovos), métodos de cozimento (grelhado, assado, refogado, ensopado) e cozinhas (mediterrânea, asiática, latina, do oriente médio).',
    mealTypes: { breakfast: 'café da manhã', lunch: 'almoço', dinner: 'jantar' },
    chefRole: 'Você é um chef que sugere refeições em formato JSON.',
    suggestMeal: 'Sugira um',
    respondJSON: 'Responda APENAS com JSON:',
    months: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    seasons: { spring: 'primavera', summer: 'verão', fall: 'outono', winter: 'inverno' }
  },
  ru: {
    systemRole: 'Вы эксперт-диетолог, который генерирует недельные меню в формате JSON.',
    weeklyMenuIntro: 'Вы эксперт-диетолог. Создайте сбалансированное и здоровое недельное меню.',
    userPreferences: 'Предпочтения пользователя:',
    diet: 'Диета',
    servings: 'Порции',
    people: 'человек',
    restrictions: 'Ограничения',
    none: 'нет',
    budget: 'Бюджет',
    cookingLevel: 'Уровень готовки',
    intermittentFasting: 'Интервальное голодание: Да (сокращенные окна питания, 2 основных приема пищи)',
    maxCalories: 'Максимум калорий на прием пищи',
    seasonalProducts: 'Сезонные продукты: Да',
    generateDays: 'Создайте 7 дней (понедельник-воскресенье) с завтраком, обедом и ужином.',
    important: 'ВАЖНО: Отвечайте ТОЛЬКО валидным JSON-объектом, без дополнительного текста. Точный формат:',
    requirements: 'Требования:',
    req1: '- Разнообразие ингредиентов (не повторять блюда)',
    req2: '- Пищевой баланс',
    req3: '- Сезонные ингредиенты',
    req4: '- Практичные и реалистичные рецепты',
    req5: '- Разумное время приготовления',
    varietyRules: '\n\nКРИТИЧЕСКИЕ ПРАВИЛА РАЗНООБРАЗИЯ:\n- НЕ повторять основной белок в один день (если на обед курица, на ужин должна быть рыба, говядина, свинина, бобовые, яйца или другой белок)\n- НЕ использовать курицу более 2 раз за всю неделю\n- НЕ использовать лосось или рыбу более 2 раз за всю неделю\n- ДОЛЖНО включать минимум: 1-2 блюда из говядины/красного мяса, 1-2 блюда из свинины, 2-3 рыбных блюда (не только лосось - варьировать с тунцом, треской, сибасом и т.д.), 2 вегетарианских/бобовых блюда, 1-2 блюда с яйцами, 1-2 блюда с курицей\n- ДОЛЖНЫ варьироваться способы приготовления: на гриле, запеченное, на пару, жареное, тушеное, обжаренное, томленое\n- ДОЛЖНЫ варьироваться кухни: средиземноморская, азиатская, латиноамериканская, ближневосточная, европейская\n- Для пасты: варьировать виды (спагетти, пенне, лазанья, равиоли) и соусы (томатный, сливочный, песто, карбонара, болоньезе)\n- Для салатов: варьировать основы (салат, шпинат, руккола, киноа) и всегда включать белок\n- Включать разнообразные блюда: рагу, запеканки, супы, гриль, жаркое, карри, тако, боулы',
    varietyRulesIndividual: '\n\nВАЖНО: Создайте РАЗНООБРАЗНОЕ и ИНТЕРЕСНОЕ блюдо. Избегайте обычных/повторяющихся блюд, таких как простой куриный салат или базовый тост с авокадо. Проявите креативность с белками (говядина, свинина, разные виды рыбы, бобовые, яйца), способами приготовления (гриль, запекание, жарка, тушение) и кухнями (средиземноморская, азиатская, латиноамериканская, ближневосточная).',
    mealTypes: { breakfast: 'завтрак', lunch: 'обед', dinner: 'ужин' },
    chefRole: 'Вы шеф-повар, который предлагает блюда в формате JSON.',
    suggestMeal: 'Предложите здоровый и вкусный',
    respondJSON: 'Отвечайте ТОЛЬКО в формате JSON:',
    months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    seasons: { spring: 'весна', summer: 'лето', fall: 'осень', winter: 'зима' }
  },
  tr: {
    systemRole: 'JSON formatında haftalık menüler oluşturan uzman bir diyetisyensiniz.',
    weeklyMenuIntro: 'Uzman bir diyetisyensiniz. Dengeli ve sağlıklı bir haftalık menü oluşturun.',
    userPreferences: 'Kullanıcı tercihleri:',
    diet: 'Diyet',
    servings: 'Porsiyon',
    people: 'kişi',
    restrictions: 'Kısıtlamalar',
    none: 'yok',
    budget: 'Bütçe',
    cookingLevel: 'Pişirme seviyesi',
    intermittentFasting: 'Aralıklı oruç: Evet (azaltılmış beslenme pencereleri, 2 ana öğün)',
    maxCalories: 'Öğün başına maksimum kalori',
    seasonalProducts: 'Mevsimsel ürünler: Evet',
    generateDays: '7 gün (Pazartesi-Pazar) kahvaltı, öğle ve akşam yemeği ile oluşturun.',
    important: 'ÖNEMLİ: SADECE geçerli bir JSON nesnesi ile yanıt verin, ek metin olmadan. Tam format:',
    requirements: 'Gereksinimler:',
    req1: '- Malzeme çeşitliliği (yemekleri tekrar etmeyin)',
    req2: '- Beslenme dengesi',
    req3: '- Mevsimsel malzemeler',
    req4: '- Pratik ve gerçekçi tarifler',
    req5: '- Makul hazırlama süreleri',
    varietyRules: '\n\nÇEŞİTLİLİK İÇİN KRİTİK KURALLAR:\n- Aynı gün ana proteini TEKRAR ETMEYİN (öğle yemeği tavuk içeriyorsa, akşam yemeği balık, sığır eti, domuz eti, baklagiller, yumurta veya başka bir protein içermelidir)\n- Tüm hafta boyunca tavuğu 2 kezden fazla KULLANMAYIN\n- Tüm hafta boyunca somon veya balığı 2 kezden fazla KULLANMAYIN\n- En az şunları içermelidir: 1-2 sığır eti/kırmızı et yemeği, 1-2 domuz eti yemeği, 2-3 balık yemeği (sadece somon değil - ton balığı, morina, levrek vb. ile çeşitlendirin), 2 vejetaryen/baklagil yemeği, 1-2 yumurta bazlı yemek, 1-2 tavuk yemeği\n- Pişirme yöntemlerini çeşitlendirmelidir: ızgara, fırında, buğulama, sote, rosto, kızartma, haşlama\n- Mutfakları çeşitlendirmelidir: Akdeniz, Asya, Latin Amerika, Orta Doğu, Avrupa\n- Makarna için: türleri (spagetti, penne, lazanya, ravioli) ve sosları (domates, krema, pesto, karbonara, bolonez) çeşitlendirin\n- Salatalar için: tabanları (marul, ıspanak, roka, kinoa) çeşitlendirin ve her zaman protein ekleyin\n- Çeşitli yemekler dahil edin: güveçler, fırın yemekleri, çorbalar, ızgaralar, soteler, köriler, takolar, kaseler',
    varietyRulesIndividual: '\n\nÖNEMLİ: ÇEŞİTLİ ve İLGİNÇ bir yemek oluşturun. Sade tavuk salatası veya basit avokado tostu gibi yaygın/tekrarlayan yemeklerden kaçının. Proteinlerde (sığır eti, domuz eti, balık çeşitleri, baklagiller, yumurta), pişirme yöntemlerinde (ızgara, fırında, sote, haşlama) ve mutfaklarda (Akdeniz, Asya, Latin, Orta Doğu) yaratıcı olun.',
    mealTypes: { breakfast: 'kahvaltı', lunch: 'öğle yemeği', dinner: 'akşam yemeği' },
    chefRole: 'JSON formatında yemek öneren bir şefsiniz.',
    suggestMeal: 'Sağlıklı ve lezzetli bir',
    respondJSON: 'SADECE JSON ile yanıt verin:',
    months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    seasons: { spring: 'ilkbahar', summer: 'yaz', fall: 'sonbahar', winter: 'kış' }
  },
  ar: {
    systemRole: 'أنت خبير تغذية يقوم بإنشاء قوائم أسبوعية بتنسيق JSON.',
    weeklyMenuIntro: 'أنت خبير تغذية. قم بإنشاء قائمة أسبوعية متوازنة وصحية.',
    userPreferences: 'تفضيلات المستخدم:',
    diet: 'النظام الغذائي',
    servings: 'الحصص',
    people: 'أشخاص',
    restrictions: 'القيود',
    none: 'لا يوجد',
    budget: 'الميزانية',
    cookingLevel: 'مستوى الطهي',
    intermittentFasting: 'الصيام المتقطع: نعم (نوافذ طعام مختصرة، وجبتان رئيسيتان)',
    maxCalories: 'الحد الأقصى للسعرات الحرارية لكل وجبة',
    seasonalProducts: 'المنتجات الموسمية: نعم',
    generateDays: 'قم بإنشاء 7 أيام (الاثنين-الأحد) مع الإفطار والغداء والعشاء.',
    important: 'مهم: أجب فقط بكائن JSON صالح، بدون نص إضافي. التنسيق الدقيق:',
    requirements: 'المتطلبات:',
    req1: '- تنوع المكونات (لا تكرر الأطباق)',
    req2: '- التوازن الغذائي',
    req3: '- المكونات الموسمية',
    req4: '- وصفات عملية وواقعية',
    req5: '- أوقات تحضير معقولة',
    varietyRules: '\n\nقواعد حاسمة للتنوع:\n- لا تكرر أي بروتين رئيسي في نفس اليوم (إذا كان الغداء يحتوي على دجاج، يجب أن يحتوي العشاء على سمك أو لحم بقري أو لحم خنزير أو بقوليات أو بيض أو بروتين آخر)\n- لا تستخدم الدجاج أكثر من مرتين في الأسبوع بأكمله\n- لا تستخدم السلمون أو السمك أكثر من مرتين في الأسبوع بأكمله\n- يجب أن تشمل على الأقل: 1-2 وجبة لحم بقري/لحم أحمر، 1-2 وجبة لحم خنزير، 2-3 وجبات سمك (ليس فقط السلمون - تنويع مع التونة والقد والقاروص وغيرها)، 2 وجبة نباتية/بقوليات، 1-2 وجبة بالبيض، 1-2 وجبة دجاج\n- يجب تنويع طرق الطهي: مشوي، مخبوز، على البخار، مقلي، محمص، مقلي بالمقلاة، مطهو ببطء\n- يجب تنويع المطابخ: البحر الأبيض المتوسط، الآسيوية، أمريكا اللاتينية، الشرق الأوسط، الأوروبية\n- للمعكرونة: تنويع الأنواع (سباغيتي، بيني، لازانيا، رافيولي) والصلصات (طماطم، كريمة، بيستو، كاربونارا، بولونيز)\n- للسلطات: تنويع القواعد (خس، سبانخ، جرجير، كينوا) وتضمين البروتين دائماً\n- تضمين أطباق متنوعة: يخنات، كسرولات، شوربات، مشويات، مقليات، كاري، تاكو، أوعية',
    varietyRulesIndividual: '\n\nمهم: أنشئ وجبة متنوعة ومثيرة للاهتمام. تجنب الأطباق الشائعة/المتكررة مثل سلطة الدجاج البسيطة أو توست الأفوكادو الأساسي. كن مبدعاً مع البروتينات (لحم بقري، لحم خنزير، أنواع السمك، البقوليات، البيض)، وطرق الطهي (مشوي، مخبوز، مقلي، مطهو ببطء)، والمطابخ (البحر الأبيض المتوسط، الآسيوية، اللاتينية، الشرق الأوسط).',
    mealTypes: { breakfast: 'الإفطار', lunch: 'الغداء', dinner: 'العشاء' },
    chefRole: 'أنت طاهٍ يقترح وجبات بتنسيق JSON.',
    suggestMeal: 'اقترح',
    respondJSON: 'أجب فقط بتنسيق JSON:',
    months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    seasons: { spring: 'الربيع', summer: 'الصيف', fall: 'الخريف', winter: 'الشتاء' }
  },
  hu: {
    systemRole: 'Ön egy táplálkozási szakértő, aki JSON formátumban heti étrendeket készít.',
    weeklyMenuIntro: 'Ön táplálkozási szakértő. Készítsen kiegyensúlyozott és egészséges heti étrendet.',
    userPreferences: 'Felhasználói preferenciák:',
    diet: 'Étrend',
    servings: 'Adagok',
    people: 'fő',
    restrictions: 'Korlátozások',
    none: 'nincs',
    budget: 'Költségvetés',
    cookingLevel: 'Főzési szint',
    intermittentFasting: 'Időszakos böjt: Igen (csökkentett étkezési ablakok, 2 fő étkezés)',
    maxCalories: 'Maximum kalória étkezésenként',
    seasonalProducts: 'Szezonális termékek: Igen',
    generateDays: 'Készítsen 7 napot (hétfő-vasárnap) reggeli, ebéd és vacsora étkezésekkel.',
    important: 'FONTOS: CSAK érvényes JSON objektummal válaszoljon, további szöveg nélkül. Pontos formátum:',
    requirements: 'Követelmények:',
    req1: '- Hozzávalók változatossága (ne ismételje az ételeket)',
    req2: '- Táplálkozási egyensúly',
    req3: '- Szezonális alapanyagok',
    req4: '- Gyakorlatias és valószerű receptek',
    req5: '- Ésszerű elkészítési idők',
    varietyRules: '\n\nKRITIKUS SZABÁLYOK A VÁLTOZATOSSÁGHOZ:\n- NE ismételje meg ugyanazt a fő fehérjét ugyanazon a napon (ha ebédre csirke van, vacsorára halnak, marhahúsnak, sertéshúsnak, hüvelyeseknek, tojásnak vagy más fehérjének kell lennie)\n- NE használjon csirkét többször, mint 2 alkalommal az egész héten\n- NE használjon lazacot vagy halat többször, mint 2 alkalommal az egész héten\n- Tartalmaznia KELL legalább: 1-2 marhahús/vöröshús ételt, 1-2 sertéshús ételt, 2-3 halételt (nem csak lazac - váltakozzon tonhallal, tőkehallal, tengeri sügérrel stb.), 2 vegetáriánus/hüvelyes ételt, 1-2 tojásos ételt, 1-2 csirkés ételt\n- Változatosnak KELL lennie a főzési módoknak: grillezett, sült, párolt, pirított, sütött, serpenyőben sütött, párolt\n- Változatosnak KELL lennie a konyháknak: mediterrán, ázsiai, latin-amerikai, közel-keleti, európai\n- Tésztákhoz: váltakozzon a típusokat (spagetti, penne, lasagne, ravioli) és szószokat (paradicsom, tejszín, pesto, carbonara, bolognai)\n- Salátákhoz: váltakozzon az alapokat (fejes saláta, spenót, rukkola, quinoa) és mindig tartalmazzon fehérjét\n- Tartalmazzon változatos ételeket: pörköltek, rakott ételek, levesek, grillezések, pirított ételek, currys, tacok, tálak',
    varietyRulesIndividual: '\n\nFONTOS: Készítsen VÁLTOZATOS és ÉRDEKES ételt. Kerülje a hétköznapi/ismétlődő ételeket, mint az egyszerű csirkesaláta vagy az alap avokádós pirítós. Legyen kreatív a fehérjékkel (marhahús, sertéshús, halfajták, hüvelyesek, tojás), főzési módokkal (grillezett, sült, pirított, párolt) és konyhákkal (mediterrán, ázsiai, latin, közel-keleti).',
    mealTypes: { breakfast: 'reggeli', lunch: 'ebéd', dinner: 'vacsora' },
    chefRole: 'Ön egy szakács, aki JSON formátumban javasol ételeket.',
    suggestMeal: 'Javasoljon egészséges és finom',
    respondJSON: 'CSAK JSON formátumban válaszoljon:',
    months: ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'],
    seasons: { spring: 'tavasz', summer: 'nyár', fall: 'ősz', winter: 'tél' }
  },
  ja: {
    systemRole: 'あなたはJSON形式で週間メニューを生成する栄養の専門家です。',
    weeklyMenuIntro: 'あなたは栄養の専門家です。バランスの取れた健康的な週間メニューを作成してください。',
    userPreferences: 'ユーザーの好み:',
    diet: '食事療法',
    servings: '人前',
    people: '人',
    restrictions: '制限',
    none: 'なし',
    budget: '予算',
    cookingLevel: '料理レベル',
    intermittentFasting: '間欠的断食：はい（食事時間の短縮、2回の主要な食事）',
    maxCalories: '1食あたりの最大カロリー',
    seasonalProducts: '季節の食材：はい',
    generateDays: '7日分（月曜日から日曜日）の朝食、昼食、夕食を作成してください。',
    important: '重要：追加のテキストなしで、有効なJSONオブジェクトのみで応答してください。正確な形式：',
    requirements: '要件：',
    req1: '- 食材の多様性（料理を繰り返さない）',
    req2: '- 栄養バランス',
    req3: '- 季節の食材',
    req4: '- 実用的で現実的なレシピ',
    req5: '- 合理的な調理時間',
    varietyRules: '\n\n多様性のための重要なルール:\n- 同じ日に主要なタンパク質を繰り返さないでください（昼食に鶏肉がある場合、夕食には魚、牛肉、豚肉、豆類、卵、または別のタンパク質が必要です）\n- 週全体で鶏肉を2回以上使用しないでください\n- 週全体でサーモンまたは魚を2回以上使用しないでください\n- 少なくとも以下を含める必要があります：1-2回の牛肉/赤身肉の食事、1-2回の豚肉の食事、2-3回の魚料理（サーモンだけでなく - マグロ、タラ、スズキなどで変化をつける）、2回のベジタリアン/豆類の食事、1-2回の卵ベースの食事、1-2回の鶏肉の食事\n- 調理方法を変える必要があります：グリル、オーブン焼き、蒸し、炒め、ロースト、パンシアー、煮込み\n- 料理のジャンルを変える必要があります：地中海料理、アジア料理、ラテンアメリカ料理、中東料理、ヨーロッパ料理\n- パスタの場合：種類（スパゲッティ、ペンネ、ラザニア、ラビオリ）とソース（トマト、クリーム、ペスト、カルボナーラ、ボロネーゼ）を変える\n- サラダの場合：ベース（レタス、ほうれん草、ルッコラ、キヌア）を変え、常にタンパク質を含める\n- 多様な料理を含める：シチュー、キャセロール、スープ、グリル、炒め物、カレー、タコス、ボウル',
    varietyRulesIndividual: '\n\n重要：多様で興味深い食事を作成してください。シンプルなチキンサラダや基本的なアボカドトーストのような一般的/繰り返しの料理は避けてください。タンパク質（牛肉、豚肉、魚の種類、豆類、卵）、調理方法（グリル、オーブン焼き、炒め、煮込み）、料理のジャンル（地中海料理、アジア料理、ラテン料理、中東料理）で創造的になってください。',
    mealTypes: { breakfast: '朝食', lunch: '昼食', dinner: '夕食' },
    chefRole: 'あなたはJSON形式で食事を提案するシェフです。',
    suggestMeal: '健康的でおいしい',
    respondJSON: 'JSONのみで応答してください：',
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    seasons: { spring: '春', summer: '夏', fall: '秋', winter: '冬' }
  },
  hi: {
    systemRole: 'आप एक विशेषज्ञ पोषण विशेषज्ञ हैं जो JSON प्रारूप में साप्ताहिक मेनू बनाते हैं।',
    weeklyMenuIntro: 'आप एक विशेषज्ञ पोषण विशेषज्ञ हैं। एक संतुलित और स्वस्थ साप्ताहिक मेनू बनाएं।',
    userPreferences: 'उपयोगकर्ता प्राथमिकताएं:',
    diet: 'आहार',
    servings: 'सर्विंग्स',
    people: 'लोग',
    restrictions: 'प्रतिबंध',
    none: 'कोई नहीं',
    budget: 'बजट',
    cookingLevel: 'खाना पकाने का स्तर',
    intermittentFasting: 'आंतरायिक उपवास: हां (कम खाने की अवधि, 2 मुख्य भोजन)',
    maxCalories: 'प्रति भोजन अधिकतम कैलोरी',
    seasonalProducts: 'मौसमी उत्पाद: हां',
    generateDays: '7 दिन (सोमवार से रविवार) नाश्ता, दोपहर का भोजन और रात का खाना के साथ बनाएं।',
    important: 'महत्वपूर्ण: केवल एक मान्य JSON ऑब्जेक्ट के साथ उत्तर दें, बिना अतिरिक्त पाठ के। सटीक प्रारूप:',
    requirements: 'आवश्यकताएं:',
    req1: '- सामग्री की विविधता (व्यंजन दोहराएं नहीं)',
    req2: '- पोषण संतुलन',
    req3: '- मौसमी सामग्री',
    req4: '- व्यावहारिक और यथार्थवादी व्यंजन',
    req5: '- उचित तैयारी समय',
    varietyRules: '\n\nविविधता के लिए महत्वपूर्ण नियम:\n- एक ही दिन में किसी भी मुख्य प्रोटीन को दोहराएं नहीं (यदि दोपहर के भोजन में चिकन है, तो रात के खाने में मछली, बीफ, पोर्क, फलियां, अंडे या अन्य प्रोटीन होना चाहिए)\n- पूरे सप्ताह में चिकन का उपयोग 2 बार से अधिक न करें\n- पूरे सप्ताह में सैल्मन या मछली का उपयोग 2 बार से अधिक न करें\n- कम से कम इन्हें शामिल करना चाहिए: 1-2 बीफ/रेड मीट भोजन, 1-2 पोर्क भोजन, 2-3 मछली भोजन (केवल सैल्मन नहीं - टूना, कॉड, सी बास आदि के साथ विविधता लाएं), 2 शाकाहारी/फलियां भोजन, 1-2 अंडे आधारित भोजन, 1-2 चिकन भोजन\n- खाना पकाने के तरीकों में विविधता लानी चाहिए: ग्रिल्ड, बेक्ड, स्टीम्ड, स्टिर-फ्राइड, रोस्टेड, पैन-सियर्ड, ब्रेज़्ड\n- व्यंजनों में विविधता लानी चाहिए: भूमध्यसागरीय, एशियाई, लैटिन अमेरिकी, मध्य पूर्वी, यूरोपीय\n- पास्ता के लिए: प्रकारों (स्पेगेटी, पेन्ने, लज़ान्या, रैवियोली) और सॉस (टमाटर, क्रीम, पेस्टो, कार्बोनारा, बोलोग्नीज़) में विविधता लाएं\n- सलाद के लिए: आधारों (लेटिस, पालक, अरुगुला, क्विनोआ) में विविधता लाएं और हमेशा प्रोटीन शामिल करें\n- विविध व्यंजन शामिल करें: स्टू, कैसरोल, सूप, ग्रिल, स्टिर-फ्राई, करी, टैकोस, बाउल',
    varietyRulesIndividual: '\n\nमहत्वपूर्ण: एक विविध और दिलचस्प भोजन बनाएं। सादे चिकन सलाद या बुनियादी एवोकाडो टोस्ट जैसे सामान्य/दोहराए जाने वाले व्यंजनों से बचें। प्रोटीन (बीफ, पोर्क, मछली की किस्में, फलियां, अंडे), खाना पकाने के तरीकों (ग्रिल्ड, बेक्ड, स्टिर-फ्राइड, ब्रेज़्ड), और व्यंजनों (भूमध्यसागरीय, एशियाई, लैटिन, मध्य पूर्वी) के साथ रचनात्मक रहें।',
    mealTypes: { breakfast: 'नाश्ता', lunch: 'दोपहर का भोजन', dinner: 'रात का खाना' },
    chefRole: 'आप एक शेफ हैं जो JSON प्रारूप में भोजन सुझाते हैं।',
    suggestMeal: 'एक स्वस्थ और स्वादिष्ट',
    respondJSON: 'केवल JSON के साथ उत्तर दें:',
    months: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
    seasons: { spring: 'वसंत', summer: 'गर्मी', fall: 'पतझड़', winter: 'सर्दी' }
  },
  nl: {
    systemRole: 'U bent een deskundige diëtist die weekmenu\'s in JSON-formaat genereert.',
    weeklyMenuIntro: 'U bent een deskundige diëtist. Genereer een uitgebalanceerd en gezond weekmenu.',
    userPreferences: 'Gebruikersvoorkeuren:',
    diet: 'Dieet',
    servings: 'Porties',
    people: 'personen',
    restrictions: 'Beperkingen',
    none: 'geen',
    budget: 'Budget',
    cookingLevel: 'Kookniveau',
    intermittentFasting: 'Intervalvasten: Ja (verminderde eetvensters, 2 hoofdmaaltijden)',
    maxCalories: 'Maximum calorieën per maaltijd',
    seasonalProducts: 'Seizoensproducten: Ja',
    generateDays: 'Genereer 7 dagen (maandag-zondag) met ontbijt, lunch en diner.',
    important: 'BELANGRIJK: Antwoord ALLEEN met een geldig JSON-object, zonder extra tekst. Exact formaat:',
    requirements: 'Vereisten:',
    req1: '- Variëteit van ingrediënten (gerechten niet herhalen)',
    req2: '- Voedingsevenwicht',
    req3: '- Seizoensingrediënten',
    req4: '- Praktische en realistische recepten',
    req5: '- Redelijke bereidingstijden',
    varietyRules: '\n\nKRITISCHE REGELS VOOR VARIATIE:\n- Herhaal NIET hetzelfde hoofdeiwit op dezelfde dag (als de lunch kip bevat, moet het diner vis, rundvlees, varkensvlees, peulvruchten, eieren of een ander eiwit bevatten)\n- Gebruik NIET meer dan 2 keer kip gedurende de hele week\n- Gebruik NIET meer dan 2 keer zalm of vis gedurende de hele week\n- MOET ten minste bevatten: 1-2 rundvlees/rood vlees maaltijden, 1-2 varkensvlees maaltijden, 2-3 vismaaltijden (niet alleen zalm - varieer met tonijn, kabeljauw, zeebaars, enz.), 2 vegetarische/peulvruchten maaltijden, 1-2 eimaaltijden, 1-2 kipmaaltijden\n- MOET bereidingsmethoden variëren: gegrild, gebakken, gestoomd, geroerbakt, geroosterd, aangebraden, gesmoord\n- MOET keukens variëren: mediterraan, Aziatisch, Latijns-Amerikaans, Midden-Oosters, Europees\n- Voor pasta: varieer types (spaghetti, penne, lasagne, ravioli) en sauzen (tomaat, room, pesto, carbonara, bolognese)\n- Voor salades: varieer basissen (sla, spinazie, rucola, quinoa) en voeg altijd eiwit toe\n- Neem diverse gerechten op: stoofschotels, ovenschotels, soepen, grills, roerbakgerechten, curry\'s, taco\'s, bowls',
    varietyRulesIndividual: '\n\nBELANGRIJK: Creëer een GEVARIEERDE en INTERESSANTE maaltijd. Vermijd gewone/herhaalde gerechten zoals eenvoudige kipsalade of basis avocadotoast. Wees creatief met eiwitten (rundvlees, varkensvlees, vissoorten, peulvruchten, eieren), bereidingsmethoden (gegrild, gebakken, geroerbakt, gesmoord) en keukens (mediterraan, Aziatisch, Latijns, Midden-Oosters).',
    mealTypes: { breakfast: 'ontbijt', lunch: 'lunch', dinner: 'diner' },
    chefRole: 'U bent een chef-kok die maaltijden in JSON-formaat suggereert.',
    suggestMeal: 'Stel een gezonde en heerlijke',
    respondJSON: 'Antwoord ALLEEN met JSON:',
    months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    seasons: { spring: 'lente', summer: 'zomer', fall: 'herfst', winter: 'winter' }
  }
};

export const MealPlanService = {
  /**
   * Obtener el inicio de la semana (lunes) para una fecha dada
   */
  getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  },

  /**
   * Formatear fecha como clave (YYYY-MM-DD)
   */
  formatDateKey(date) {
    return date.toISOString().split('T')[0];
  },

  /**
   * Convertir inicio de semana a rango legible
   */
  getWeekRange(weekStart) {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);

    const formatDay = (d) => {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${d.getDate()} ${months[d.getMonth()]}`;
    };

    return `${formatDay(start)} - ${formatDay(end)}`;
  },

  /**
   * Obtener todos los planes guardados
   */
  async getAllPlans() {
    try {
      const plansJson = await AsyncStorage.getItem(MEAL_PLANS_KEY);
      return plansJson ? JSON.parse(plansJson) : {};
    } catch (error) {
      console.error('Error al obtener planes:', error);
      return {};
    }
  },

  /**
   * Obtener plan de una semana específica
   */
  async getWeeklyPlan(weekStart) {
    try {
      const plans = await this.getAllPlans();
      const key = `weekOf_${this.formatDateKey(weekStart)}`;
      return plans[key] || this.createEmptyPlan(weekStart);
    } catch (error) {
      console.error('Error al obtener plan semanal:', error);
      return this.createEmptyPlan(weekStart);
    }
  },

  /**
   * Crear estructura de plan vacío
   */
  createEmptyPlan(weekStart) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const plan = {};

    days.forEach(day => {
      plan[day] = {
        breakfast: null,
        lunch: null,
        dinner: null
      };
    });

    return {
      weekRange: this.getWeekRange(weekStart),
      preferences: null,
      plan: plan,
      shoppingList: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      calendarSynced: false,
      notificationsEnabled: false
    };
  },

  /**
   * Guardar plan semanal
   */
  async saveWeeklyPlan(weekStart, planData) {
    try {
      const plans = await this.getAllPlans();
      const key = `weekOf_${this.formatDateKey(weekStart)}`;

      plans[key] = {
        ...planData,
        lastModified: new Date().toISOString()
      };

      await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
      return true;
    } catch (error) {
      console.error('Error al guardar plan semanal:', error);
      return false;
    }
  },

  /**
   * Eliminar plan semanal
   */
  async deleteWeeklyPlan(weekStart) {
    try {
      const plans = await this.getAllPlans();
      const key = `weekOf_${this.formatDateKey(weekStart)}`;
      delete plans[key];
      await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
      return true;
    } catch (error) {
      console.error('Error al eliminar plan semanal:', error);
      return false;
    }
  },

  /**
   * Añadir comida a un slot específico
   */
  async addMealToSlot(weekStart, day, mealType, meal) {
    try {
      console.log(`📌 [addMealToSlot] Inicio - weekStart: ${weekStart}, day: ${day}, mealType: ${mealType}`);
      console.log(`📌 [addMealToSlot] Meal a guardar:`, meal);

      const weekPlan = await this.getWeeklyPlan(weekStart);
      console.log(`📌 [addMealToSlot] Plan actual antes de modificar:`, JSON.stringify(weekPlan.plan[day], null, 2));

      if (!weekPlan.plan[day]) {
        weekPlan.plan[day] = { breakfast: null, lunch: null, dinner: null };
      }

      weekPlan.plan[day][mealType] = meal;

      console.log(`📌 [addMealToSlot] Plan después de modificar ${day}.${mealType}:`, JSON.stringify(weekPlan.plan[day], null, 2));

      await this.saveWeeklyPlan(weekStart, weekPlan);
      console.log(`📌 [addMealToSlot] Plan guardado exitosamente`);

      return true;
    } catch (error) {
      console.error('❌ [addMealToSlot] Error al añadir comida:', error);
      return false;
    }
  },

  /**
   * Eliminar comida de un slot
   */
  async removeMealFromSlot(weekStart, day, mealType) {
    try {
      const weekPlan = await this.getWeeklyPlan(weekStart);

      if (weekPlan.plan[day]) {
        weekPlan.plan[day][mealType] = null;
      }

      await this.saveWeeklyPlan(weekStart, weekPlan);
      return true;
    } catch (error) {
      console.error('Error al eliminar comida:', error);
      return false;
    }
  },

  /**
   * Obtener preferencias del usuario
   */
  async getPreferences() {
    try {
      const prefsJson = await AsyncStorage.getItem(MEAL_PREFERENCES_KEY);
      return prefsJson ? JSON.parse(prefsJson) : this.getDefaultPreferences();
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      return this.getDefaultPreferences();
    }
  },

  /**
   * Preferencias por defecto
   */
  getDefaultPreferences() {
    return {
      diet: 'normal',
      servings: 2,
      restrictions: [],
      budget: 'medium',
      cookingLevel: 'intermediate',
      defaultBreakfastTime: '08:00',
      defaultLunchTime: '13:00',
      defaultDinnerTime: '19:00',
      notificationOffsets: {
        breakfast: -30,
        lunch: -60,
        dinner: -90
      }
    };
  },

  /**
   * Guardar preferencias
   */
  async savePreferences(preferences) {
    try {
      await AsyncStorage.setItem(MEAL_PREFERENCES_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      return false;
    }
  },

  /**
   * Obtener fecha para un día de la semana
   */
  getDateForDay(dayName, weekStart) {
    const days = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6
    };

    const date = new Date(weekStart);
    date.setDate(date.getDate() + days[dayName]);
    return date;
  },

  /**
   * Obtener nombre del día en español
   */
  getDayNameInSpanish(dayName) {
    const names = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return names[dayName] || dayName;
  },

  /**
   * Generar menú semanal con IA (GPT-4)
   */
  async generateMenuWithAI(preferences) {
    try {
      console.log('📝 [MealPlanService] Iniciando generateMenuWithAI');
      console.log('📝 [MealPlanService] Preferencias recibidas:', preferences);
      console.log('📝 [MealPlanService] API_KEY_CHAT:', API_KEY_CHAT);

      // Obtener país, fecha y idioma del usuario
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const RNLocalize = require('react-native-localize');

      // Detectar idioma del dispositivo
      const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
      const t = promptTranslations[deviceLanguage] || promptTranslations['en'];

      let country = '';
      let currentMonth = '';
      let currentSeason = '';

      if (preferences.seasonalProducts) {
        try {
          let savedCountry = await AsyncStorage.getItem("@country");
          if (!savedCountry || savedCountry.trim() === '') {
            const countryCode = RNLocalize.getCountry();
            const countryNames = {
              'ES': 'España', 'MX': 'México', 'US': 'Estados Unidos',
              'AR': 'Argentina', 'CO': 'Colombia', 'CL': 'Chile',
              'PE': 'Perú', 'VE': 'Venezuela', 'EC': 'Ecuador',
              'CH': 'Suiza'
            };
            savedCountry = countryNames[countryCode] || countryCode || "";
          }
          country = savedCountry;

          const now = new Date();
          currentMonth = t.months[now.getMonth()];

          // Determinar estación
          const month = now.getMonth() + 1;
          if (month >= 3 && month <= 5) currentSeason = t.seasons.spring;
          else if (month >= 6 && month <= 8) currentSeason = t.seasons.summer;
          else if (month >= 9 && month <= 11) currentSeason = t.seasons.fall;
          else currentSeason = t.seasons.winter;
        } catch (error) {
          console.error('Error obteniendo país/fecha:', error);
        }
      }

      const prompt = `${t.weeklyMenuIntro}

${t.userPreferences}
- ${t.diet}: ${preferences.diet}
- ${t.servings}: ${preferences.servings} ${t.people}
- ${t.restrictions}: ${preferences.restrictions?.join(', ') || t.none}
- ${t.budget}: ${preferences.budget}
- ${t.cookingLevel}: ${preferences.cookingLevel}${preferences.intermittentFasting ? `\n- ${t.intermittentFasting}` : ''}${preferences.maxCaloriesEnabled && preferences.maxCalories ? `\n- ${t.maxCalories}: ${preferences.maxCalories} kcal` : ''}${preferences.seasonalProducts && country ? `\n- ${t.seasonalProducts} (${country}, ${currentMonth}, ${currentSeason})` : ''}

${t.generateDays}

${t.important}

{
  "monday": {
    "breakfast": {
      "name": "Nombre del plato",
      "servings": ${preferences.servings},
      "time": "15 min",
      "ingredients": [
        {"item": "Ingrediente", "quantity": "100", "unit": "g"}
      ]
    },
    "lunch": { ... },
    "dinner": { ... }
  },
  "tuesday": { ... },
  "wednesday": { ... },
  "thursday": { ... },
  "friday": { ... },
  "saturday": { ... },
  "sunday": { ... }
}

${t.requirements}
${t.req1}
${t.req2}
${t.req3}
${t.req4}
${t.req5}${t.varietyRules}${preferences.restrictions && preferences.restrictions.length > 0 ? `\n- ${deviceLanguage === 'es' ? 'RESPETAR restricciones dietéticas' : deviceLanguage === 'en' ? 'RESPECT dietary restrictions' : deviceLanguage === 'de' ? 'Diätetische Einschränkungen BEACHTEN' : deviceLanguage === 'fr' ? 'RESPECTER les restrictions alimentaires' : deviceLanguage === 'it' ? 'RISPETTARE le restrizioni dietetiche' : deviceLanguage === 'pt' ? 'RESPEITAR restrições alimentares' : deviceLanguage === 'ru' ? 'СОБЛЮДАТЬ диетические ограничения' : deviceLanguage === 'tr' ? 'Diyet kısıtlamalarına UYUN' : deviceLanguage === 'ar' ? 'احترام القيود الغذائية' : deviceLanguage === 'hu' ? 'Diétás korlátozások BETARTÁSA' : deviceLanguage === 'ja' ? '食事制限を守る' : deviceLanguage === 'hi' ? 'आहार प्रतिबंधों का सम्मान करें' : deviceLanguage === 'nl' ? 'Dieetbeperkingen RESPECTEREN' : 'RESPECT dietary restrictions'}: ${preferences.restrictions.join(', ')} - ${deviceLanguage === 'es' ? 'NO incluir estos ingredientes' : deviceLanguage === 'en' ? 'DO NOT include these ingredients' : deviceLanguage === 'de' ? 'Diese Zutaten NICHT einschließen' : deviceLanguage === 'fr' ? 'NE PAS inclure ces ingrédients' : deviceLanguage === 'it' ? 'NON includere questi ingredienti' : deviceLanguage === 'pt' ? 'NÃO incluir estes ingredientes' : deviceLanguage === 'ru' ? 'НЕ включать эти ингредиенты' : deviceLanguage === 'tr' ? 'Bu malzemeleri dahil ETMEYİN' : deviceLanguage === 'ar' ? 'لا تدرج هذه المكونات' : deviceLanguage === 'hu' ? 'Ezeket a hozzávalókat NE tartalmazza' : deviceLanguage === 'ja' ? 'これらの材料を含めないでください' : deviceLanguage === 'hi' ? 'इन सामग्रियों को शामिल न करें' : deviceLanguage === 'nl' ? 'Deze ingrediënten NIET opnemen' : 'DO NOT include these ingredients'}` : ''}`;

      console.log('📝 [MealPlanService] Prompt generado (primeros 200 chars):', prompt.substring(0, 200));
      console.log('📝 [MealPlanService] Realizando petición a API...');

      const requestBody = {

         model: 'gpt-4.1',
        max_tokens: 3000,
        messages: [
          {
            role: 'system',
            content: t.systemRole
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      };

      console.log('📝 [MealPlanService] Request body:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(API_KEY_CHAT, requestBody);

      console.log('📝 [MealPlanService] Respuesta recibida');
      console.log('📝 [MealPlanService] Status:', response.status);
      console.log('📝 [MealPlanService] Response data keys:', Object.keys(response.data));
      console.log('📝 [MealPlanService] Response.data:', response.data);

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        console.error('❌ [MealPlanService] Respuesta malformada:', response.data);
        throw new Error('Respuesta del servidor no tiene el formato esperado');
      }

      const content = response.data.choices[0].message.content;
      console.log('📝 [MealPlanService] Contenido extraído (primeros 500 chars):', content.substring(0, 500));
      console.log('📝 [MealPlanService] Longitud del contenido:', content.length);

      // Limpiar respuesta si contiene markdown
      const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      console.log('📝 [MealPlanService] JSON limpio (primeros 500 chars):', jsonContent.substring(0, 500));
      console.log('📝 [MealPlanService] JSON limpio (últimos 200 chars):', jsonContent.substring(Math.max(0, jsonContent.length - 200)));

      if (!jsonContent || jsonContent.length === 0) {
        console.error('❌ [MealPlanService] Contenido vacío después de limpiar');
        throw new Error('La respuesta de la IA está vacía');
      }

      let parsedMenu;
      try {
        parsedMenu = JSON.parse(jsonContent);
        console.log('📝 [MealPlanService] Menú parseado exitosamente');
        console.log('📝 [MealPlanService] Días en el menú:', Object.keys(parsedMenu));
      } catch (parseError) {
        console.error('❌ [MealPlanService] Error al parsear JSON:', parseError);
        console.error('❌ [MealPlanService] Contenido completo que causó el error:', jsonContent);
        throw new Error(`Error al parsear respuesta JSON: ${parseError.message}`);
      }

      return parsedMenu;
    } catch (error) {
      console.error('❌ [MealPlanService] Error al generar menú con IA:', error);
      console.error('❌ [MealPlanService] Error message:', error.message);
      console.error('❌ [MealPlanService] Error response:', error.response?.data);
      console.error('❌ [MealPlanService] Error status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Sugerir una comida específica con IA
   */
  async suggestMeal(mealType, preferences, weekPlan = null, currentDay = null) {
    try {
      // Obtener idioma del dispositivo
      const RNLocalize = require('react-native-localize');
      const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
      const t = promptTranslations[deviceLanguage] || promptTranslations['en'];

      // Analizar proteínas ya usadas en la semana y el día actual
      let usedProteins = [];
      let todayProteins = [];
      if (weekPlan && weekPlan.plan) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
          if (weekPlan.plan[day]) {
            ['breakfast', 'lunch', 'dinner'].forEach(meal => {
              if (weekPlan.plan[day][meal]) {
                const mealName = weekPlan.plan[day][meal].name?.toLowerCase() || '';
                // Detectar proteínas principales
                if (mealName.includes('pollo') || mealName.includes('chicken')) usedProteins.push('pollo');
                if (mealName.includes('salmón') || mealName.includes('salmon')) usedProteins.push('salmón');
                if (mealName.includes('pescado') || mealName.includes('fish') || mealName.includes('atún') || mealName.includes('tuna') || mealName.includes('bacalao') || mealName.includes('cod')) usedProteins.push('pescado');
                if (mealName.includes('carne') || mealName.includes('beef') || mealName.includes('ternera') || mealName.includes('res')) usedProteins.push('carne');
                if (mealName.includes('cerdo') || mealName.includes('pork') || mealName.includes('chuleta')) usedProteins.push('cerdo');
                if (mealName.includes('huevo') || mealName.includes('egg')) usedProteins.push('huevo');
                if (mealName.includes('camarón') || mealName.includes('gamba') || mealName.includes('shrimp') || mealName.includes('langostino')) usedProteins.push('camarón');

                // Proteínas del día actual
                if (day === currentDay) {
                  if (mealName.includes('pollo') || mealName.includes('chicken')) todayProteins.push('pollo');
                  if (mealName.includes('salmón') || mealName.includes('salmon')) todayProteins.push('salmón');
                  if (mealName.includes('pescado') || mealName.includes('fish') || mealName.includes('atún') || mealName.includes('tuna')) todayProteins.push('pescado');
                  if (mealName.includes('carne') || mealName.includes('beef') || mealName.includes('ternera')) todayProteins.push('carne');
                  if (mealName.includes('cerdo') || mealName.includes('pork')) todayProteins.push('cerdo');
                  if (mealName.includes('huevo') || mealName.includes('egg')) todayProteins.push('huevo');
                  if (mealName.includes('camarón') || mealName.includes('shrimp') || mealName.includes('gamba')) todayProteins.push('camarón');
                }
              }
            });
          }
        });
      }

      // Contar cuántas veces se ha usado cada proteína
      const proteinCount = {};
      usedProteins.forEach(p => {
        proteinCount[p] = (proteinCount[p] || 0) + 1;
      });

      // Construir contexto de restricciones basado en uso
      let contextRestrictions = '';
      if (todayProteins.length > 0) {
        contextRestrictions += `\n${deviceLanguage === 'es' ? 'HOY YA SE USÓ' : 'TODAY ALREADY USED'}: ${todayProteins.join(', ')}. ${deviceLanguage === 'es' ? 'DEBE usar una proteína DIFERENTE' : 'MUST use a DIFFERENT protein'}.`;
      }
      if (proteinCount['pollo'] >= 2) {
        contextRestrictions += `\n${deviceLanguage === 'es' ? 'Pollo ya usado 2+ veces esta semana - NO USAR' : 'Chicken already used 2+ times this week - DO NOT USE'}.`;
      }
      if (proteinCount['salmón'] >= 2 || proteinCount['pescado'] >= 2) {
        contextRestrictions += `\n${deviceLanguage === 'es' ? 'Pescado/salmón ya usado 2+ veces esta semana - NO USAR' : 'Fish/salmon already used 2+ times this week - DO NOT USE'}.`;
      }

      // Obtener país y fecha para productos de temporada
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;

      let country = '';
      let currentMonth = '';
      let currentSeason = '';

      if (preferences.seasonalProducts) {
        try {
          let savedCountry = await AsyncStorage.getItem("@country");
          if (!savedCountry || savedCountry.trim() === '') {
            const countryCode = RNLocalize.getCountry();
            const countryNames = {
              'ES': 'España', 'MX': 'México', 'US': 'Estados Unidos',
              'AR': 'Argentina', 'CO': 'Colombia', 'CL': 'Chile',
              'PE': 'Perú', 'VE': 'Venezuela', 'EC': 'Ecuador',
              'CH': 'Suiza'
            };
            savedCountry = countryNames[countryCode] || countryCode || "";
          }
          country = savedCountry;

          const now = new Date();
          currentMonth = t.months[now.getMonth()];

          const month = now.getMonth() + 1;
          if (month >= 3 && month <= 5) currentSeason = t.seasons.spring;
          else if (month >= 6 && month <= 8) currentSeason = t.seasons.summer;
          else if (month >= 9 && month <= 11) currentSeason = t.seasons.fall;
          else currentSeason = t.seasons.winter;
        } catch (error) {
          console.error('Error obteniendo país/fecha:', error);
        }
      }

      const prompt = `${t.suggestMeal} ${t.mealTypes[mealType]} ${deviceLanguage === 'es' ? 'saludable y delicioso' : 'healthy and delicious'}.

${t.userPreferences}
- ${t.diet}: ${preferences.diet}
- ${t.servings}: ${preferences.servings} ${t.people}
- ${t.restrictions}: ${preferences.restrictions?.join(', ') || t.none}${preferences.maxCaloriesEnabled && preferences.maxCalories ? `\n- ${t.maxCalories}: ${preferences.maxCalories} kcal` : ''}${preferences.seasonalProducts && country ? `\n- ${t.seasonalProducts} ${country} ${deviceLanguage === 'es' ? 'en' : 'in'} ${currentMonth} (${currentSeason})` : ''}${t.varietyRulesIndividual}${contextRestrictions}${preferences.restrictions && preferences.restrictions.length > 0 ? `\n${deviceLanguage === 'es' ? 'RESPETAR restricciones dietéticas' : deviceLanguage === 'en' ? 'RESPECT dietary restrictions' : deviceLanguage === 'de' ? 'Diätetische Einschränkungen BEACHTEN' : deviceLanguage === 'fr' ? 'RESPECTER les restrictions alimentaires' : deviceLanguage === 'it' ? 'RISPETTARE le restrizioni dietetiche' : deviceLanguage === 'pt' ? 'RESPEITAR restrições alimentares' : deviceLanguage === 'ru' ? 'СОБЛЮДАТЬ диетические ограничения' : deviceLanguage === 'tr' ? 'Diyet kısıtlamalarına UYUN' : deviceLanguage === 'ar' ? 'احترام القيود الغذائية' : deviceLanguage === 'hu' ? 'Diétás korlátozások BETARTÁSA' : deviceLanguage === 'ja' ? '食事制限を守る' : deviceLanguage === 'hi' ? 'आहार प्रतिबंधों का सम्मान करें' : deviceLanguage === 'nl' ? 'Dieetbeperkingen RESPECTEREN' : 'RESPECT dietary restrictions'}: ${preferences.restrictions.join(', ')} - ${deviceLanguage === 'es' ? 'NO incluir estos ingredientes' : deviceLanguage === 'en' ? 'DO NOT include these ingredients' : deviceLanguage === 'de' ? 'Diese Zutaten NICHT einschließen' : deviceLanguage === 'fr' ? 'NE PAS inclure ces ingrédients' : deviceLanguage === 'it' ? 'NON includere questi ingredienti' : deviceLanguage === 'pt' ? 'NÃO incluir estes ingredientes' : deviceLanguage === 'ru' ? 'НЕ включать эти ингредиенты' : deviceLanguage === 'tr' ? 'Bu malzemeleri dahil ETMEYİN' : deviceLanguage === 'ar' ? 'لا تدرج هذه المكونات' : deviceLanguage === 'hu' ? 'Ezeket a hozzávalókat NE tartalmazza' : deviceLanguage === 'ja' ? 'これらの材料を含めないでください' : deviceLanguage === 'hi' ? 'इन सामग्रियों को शामिल न करें' : deviceLanguage === 'nl' ? 'Deze ingrediënten NIET opnemen' : 'DO NOT include these ingredients'}.` : ''}

${t.respondJSON}
{
  "name": "Nombre del plato",
  "servings": ${preferences.servings},
  "time": "30 min",
  "ingredients": [
    {"item": "Ingrediente", "quantity": "100", "unit": "g"}
  ]
}`;

      const response = await axios.post(API_KEY_CHAT, {
        model: 'gpt-4o-mini',
        temperature: 0.8,
        max_tokens: 600,
        messages: [
          {
            role: 'system',
            content: t.chefRole
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      console.log('📝 [MealPlanService] Sugerencia de comida recibida');

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        throw new Error('Respuesta del servidor no tiene el formato esperado');
      }

      const content = response.data.choices[0].message.content;
      console.log('📝 [MealPlanService] Contenido:', content);

      const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      try {
        return JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('❌ [MealPlanService] Error al parsear sugerencia:', parseError);
        console.error('❌ [MealPlanService] Contenido:', jsonContent);
        throw new Error(`Error al parsear sugerencia: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error al sugerir comida:', error);
      throw error;
    }
  },

  /**
   * Limpiar planes antiguos (más de 2 meses)
   */
  async cleanOldPlans() {
    try {
      const plans = await this.getAllPlans();
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      const filteredPlans = {};

      Object.keys(plans).forEach(key => {
        const dateStr = key.replace('weekOf_', '');
        const planDate = new Date(dateStr);

        if (planDate >= twoMonthsAgo) {
          filteredPlans[key] = plans[key];
        }
      });

      await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(filteredPlans));
      return true;
    } catch (error) {
      console.error('Error al limpiar planes antiguos:', error);
      return false;
    }
  }
};

export default MealPlanService;
