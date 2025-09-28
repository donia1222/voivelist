const dietRecommendationsTranslations = {
  en: {
    title: "Nutritional Recommendations",
    subtitle: "Products with detailed nutritional information",
    loading: "Loading nutritional recommendations...",
    tabLabel: "Nutrition",
    refreshList: "Refresh list",
    // AI Prompts
    dietExpertIntro: "You are a nutrition expert. RESPOND ONLY IN ENGLISH. IMPORTANT: Every product MUST include an appropriate emoji and detailed nutritional information.",
    generateDietProducts: "Generate {limit} DIFFERENT food products with detailed nutritional information for {date}.",
    considerFactors: "Consider these factors:",
    nutritionalBalance: "1) Balance of macronutrients (proteins, fats, carbohydrates)",
    healthyOptions: "2) Healthy and nutritious options",
    varietyOfProducts: "3) Variety of product types (proteins, vegetables, fruits, grains)",
    portionSizes: "4) Standard portion sizes",
    responseFormat: "Respond with one product per line in format: Product Name - Proteins: Xg, Fats: Yg, Carbs: Zg",
    exampleFormat: "Example:\nChicken breast 🍗 - Proteins: 25g, Fats: 3g, Carbs: 0g\nBroccoli 🥦 - Proteins: 3g, Fats: 0.5g, Carbs: 7g\nBrown rice 🍚 - Proteins: 3g, Fats: 1g, Carbs: 23g"
  },
  es: {
    title: "Recomendaciones Nutricionales",
    subtitle: "Productos con información nutricional detallada",
    loading: "Cargando recomendaciones nutricionales...",
    tabLabel: "Nutrición",
    refreshList: "Refrescar lista",
    // AI Prompts
    dietExpertIntro: "Eres un experto en nutrición. RESPONDE SOLO EN ESPAÑOL. IMPORTANTE: Cada producto DEBE incluir un emoji apropiado e información nutricional detallada.",
    generateDietProducts: "Genera {limit} productos alimenticios DIFERENTES con información nutricional detallada para el {date}.",
    considerFactors: "Considera estos factores:",
    nutritionalBalance: "1) Balance de macronutrientes (proteínas, grasas, carbohidratos)",
    healthyOptions: "2) Opciones saludables y nutritivas",
    varietyOfProducts: "3) Variedad de tipos de productos (proteínas, verduras, frutas, cereales)",
    portionSizes: "4) Tamaños de porción estándar",
    responseFormat: "Responde con un producto por línea en formato: Nombre del Producto - Proteínas: Xg, Grasas: Yg, Carbohidratos: Zg",
    exampleFormat: "Ejemplo:\nPechuga de pollo 🍗 - Proteínas: 25g, Grasas: 3g, Carbohidratos: 0g\nBrócoli 🥦 - Proteínas: 3g, Grasas: 0.5g, Carbohidratos: 7g\nArroz integral 🍚 - Proteínas: 3g, Grasas: 1g, Carbohidratos: 23g"
  },
  de: {
    title: "Ernährungsempfehlungen",
    subtitle: "Produkte mit detaillierten Nährwertangaben",
    loading: "Ernährungsempfehlungen werden geladen...",
    tabLabel: "Ernährung",
    refreshList: "Liste aktualisieren",
    // AI Prompts
    dietExpertIntro: "Sie sind ein Ernährungsexperte. ANTWORTEN SIE NUR AUF DEUTSCH. WICHTIG: Jedes Produkt MUSS ein passendes Emoji und detaillierte Nährwertangaben enthalten.",
    generateDietProducts: "{limit} VERSCHIEDENE Lebensmittel mit detaillierten Nährwertangaben für den {date} generieren.",
    considerFactors: "Berücksichtigen Sie diese Faktoren:",
    nutritionalBalance: "1) Ausgewogenheit der Makronährstoffe (Proteine, Fette, Kohlenhydrate)",
    healthyOptions: "2) Gesunde und nahrhafte Optionen",
    varietyOfProducts: "3) Vielfalt der Produkttypen (Proteine, Gemüse, Obst, Getreide)",
    portionSizes: "4) Standard-Portionsgrößen",
    responseFormat: "Antworten Sie mit einem Produkt pro Zeile im Format: Produktname - Proteine: Xg, Fette: Yg, Kohlenhydrate: Zg",
    exampleFormat: "Beispiel:\nHähnchenbrust 🍗 - Proteine: 25g, Fette: 3g, Kohlenhydrate: 0g\nBrokkoli 🥦 - Proteine: 3g, Fette: 0.5g, Kohlenhydrate: 7g\nVollkornreis 🍚 - Proteine: 3g, Fette: 1g, Kohlenhydrate: 23g"
  },
  fr: {
    title: "Recommandations Nutritionnelles",
    subtitle: "Produits avec informations nutritionnelles détaillées",
    loading: "Chargement des recommandations nutritionnelles...",
    tabLabel: "Nutrition",
    refreshList: "Actualiser la liste",
    // AI Prompts
    dietExpertIntro: "Vous êtes un expert en nutrition. RÉPONDEZ UNIQUEMENT EN FRANÇAIS. IMPORTANT : Chaque produit DOIT inclure un emoji approprié et des informations nutritionnelles détaillées.",
    generateDietProducts: "Générez {limit} produits alimentaires DIFFÉRENTS avec des informations nutritionnelles détaillées pour le {date}.",
    considerFactors: "Considérez ces facteurs :",
    nutritionalBalance: "1) Équilibre des macronutriments (protéines, graisses, glucides)",
    healthyOptions: "2) Options saines et nutritives",
    varietyOfProducts: "3) Variété de types de produits (protéines, légumes, fruits, céréales)",
    portionSizes: "4) Tailles de portions standard",
    responseFormat: "Répondez avec un produit par ligne au format : Nom du Produit - Protéines : Xg, Graisses : Yg, Glucides : Zg",
    exampleFormat: "Exemple :\nPoitrine de poulet 🍗 - Protéines : 25g, Graisses : 3g, Glucides : 0g\nBrocoli 🥦 - Protéines : 3g, Graisses : 0.5g, Glucides : 7g\nRiz complet 🍚 - Protéines : 3g, Graisses : 1g, Glucides : 23g"
  },
  it: {
    title: "Raccomandazioni Nutrizionali",
    subtitle: "Prodotti con informazioni nutrizionali dettagliate",
    loading: "Caricamento raccomandazioni nutrizionali...",
    tabLabel: "Nutrizione",
    refreshList: "Aggiorna lista",
    // AI Prompts
    dietExpertIntro: "Sei un esperto di nutrizione. RISPONDI SOLO IN ITALIANO. IMPORTANTE: Ogni prodotto DEVE includere un'emoji appropriata e informazioni nutrizionali dettagliate.",
    generateDietProducts: "Genera {limit} prodotti alimentari DIVERSI con informazioni nutrizionali dettagliate per il {date}.",
    considerFactors: "Considera questi fattori:",
    nutritionalBalance: "1) Equilibrio dei macronutrienti (proteine, grassi, carboidrati)",
    healthyOptions: "2) Opzioni sane e nutrienti",
    varietyOfProducts: "3) Varietà di tipi di prodotti (proteine, verdure, frutta, cereali)",
    portionSizes: "4) Dimensioni delle porzioni standard",
    responseFormat: "Rispondi con un prodotto per riga nel formato: Nome Prodotto - Proteine: Xg, Grassi: Yg, Carboidrati: Zg",
    exampleFormat: "Esempio:\nPetto di pollo 🍗 - Proteine: 25g, Grassi: 3g, Carboidrati: 0g\nBroccoli 🥦 - Proteine: 3g, Grassi: 0.5g, Carboidrati: 7g\nRiso integrale 🍚 - Proteine: 3g, Grassi: 1g, Carboidrati: 23g"
  },
  pt: {
    title: "Recomendações Nutricionais",
    subtitle: "Produtos com informações nutricionais detalhadas",
    loading: "Carregando recomendações nutricionais...",
    tabLabel: "Nutrição",
    refreshList: "Atualizar lista",
    // AI Prompts
    dietExpertIntro: "Você é um especialista em nutrição. RESPONDA APENAS EM PORTUGUÊS. IMPORTANTE: Cada produto DEVE incluir um emoji apropriado e informações nutricionais detalhadas.",
    generateDietProducts: "Gere {limit} produtos alimentícios DIFERENTES com informações nutricionais detalhadas para {date}.",
    considerFactors: "Considere estes fatores:",
    nutritionalBalance: "1) Equilíbrio de macronutrientes (proteínas, gorduras, carboidratos)",
    healthyOptions: "2) Opções saudáveis e nutritivas",
    varietyOfProducts: "3) Variedade de tipos de produtos (proteínas, vegetais, frutas, cereais)",
    portionSizes: "4) Tamanhos de porções padrão",
    responseFormat: "Responda com um produto por linha no formato: Nome do Produto - Proteínas: Xg, Gorduras: Yg, Carboidratos: Zg",
    exampleFormat: "Exemplo:\nPeito de frango 🍗 - Proteínas: 25g, Gorduras: 3g, Carboidratos: 0g\nBrócolis 🥦 - Proteínas: 3g, Gorduras: 0.5g, Carboidratos: 7g\nArroz integral 🍚 - Proteínas: 3g, Gorduras: 1g, Carboidratos: 23g"
  }
}

export default dietRecommendationsTranslations