// Recetas por defecto en todos los idiomas
const defaultRecipes = {
  en: {
    breakfast: {
      name: 'Avocado Toast with Poached Egg',
      description: 'A healthy and delicious breakfast with creamy avocado, perfectly poached egg, and whole grain bread.',
      time: '15 min',
      calories: 320,
      difficulty: 'easy',
      servings: 2,
      ingredients: [
        { item: 'Whole grain bread', quantity: '4', unit: 'slices' },
        { item: 'Ripe avocado', quantity: '2', unit: 'pieces' },
        { item: 'Eggs', quantity: '4', unit: 'pieces' },
        { item: 'Lemon juice', quantity: '1', unit: 'tbsp' },
        { item: 'Salt', quantity: '1', unit: 'pinch' },
        { item: 'Black pepper', quantity: '1', unit: 'pinch' }
      ],
      instructions: [
        'Toast the bread slices until golden brown',
        'Mash the avocados with lemon juice, salt and pepper',
        'Poach the eggs in simmering water for 3-4 minutes',
        'Spread avocado on toast and top with poached egg',
        'Season with extra salt and pepper to taste'
      ]
    },
    lunch: {
      name: 'Mediterranean Quinoa Salad',
      description: 'A fresh and nutritious salad with quinoa, vegetables, feta cheese and lemon dressing.',
      time: '25 min',
      calories: 450,
      difficulty: 'easy',
      servings: 2,
      ingredients: [
        { item: 'Quinoa', quantity: '200', unit: 'g' },
        { item: 'Cherry tomatoes', quantity: '200', unit: 'g' },
        { item: 'Cucumber', quantity: '1', unit: 'piece' },
        { item: 'Feta cheese', quantity: '100', unit: 'g' },
        { item: 'Olive oil', quantity: '3', unit: 'tbsp' },
        { item: 'Lemon', quantity: '1', unit: 'piece' }
      ],
      instructions: [
        'Cook quinoa according to package instructions',
        'Dice tomatoes, cucumber and feta cheese',
        'Mix all ingredients in a large bowl',
        'Dress with olive oil and lemon juice',
        'Season with salt and pepper to taste'
      ]
    },
    dinner: {
      name: 'Grilled Salmon with Roasted Vegetables',
      description: 'Tender grilled salmon with a medley of colorful roasted vegetables.',
      time: '35 min',
      calories: 520,
      difficulty: 'medium',
      servings: 2,
      ingredients: [
        { item: 'Salmon fillet', quantity: '400', unit: 'g' },
        { item: 'Broccoli', quantity: '200', unit: 'g' },
        { item: 'Bell peppers', quantity: '2', unit: 'pieces' },
        { item: 'Olive oil', quantity: '3', unit: 'tbsp' },
        { item: 'Garlic', quantity: '2', unit: 'cloves' },
        { item: 'Lemon', quantity: '1', unit: 'piece' }
      ],
      instructions: [
        'Preheat oven to 200°C (400°F)',
        'Cut vegetables and toss with olive oil and garlic',
        'Roast vegetables for 20 minutes',
        'Season salmon with salt, pepper and lemon',
        'Grill salmon for 5-6 minutes per side',
        'Serve salmon with roasted vegetables'
      ]
    },
    snacks: {
      name: 'Greek Yogurt with Berries and Honey',
      description: 'A healthy and protein-rich snack with creamy yogurt, fresh berries and natural honey.',
      time: '5 min',
      calories: 180,
      difficulty: 'easy',
      servings: 2,
      ingredients: [
        { item: 'Greek yogurt', quantity: '400', unit: 'g' },
        { item: 'Mixed berries', quantity: '200', unit: 'g' },
        { item: 'Honey', quantity: '2', unit: 'tbsp' },
        { item: 'Granola', quantity: '50', unit: 'g' },
        { item: 'Almonds', quantity: '30', unit: 'g' }
      ],
      instructions: [
        'Divide yogurt into serving bowls',
        'Top with fresh berries',
        'Drizzle with honey',
        'Sprinkle granola and chopped almonds',
        'Serve immediately'
      ]
    }
  },

  es: {
    breakfast: {
      name: 'Tostada de Aguacate con Huevo Pochado',
      description: 'Un desayuno saludable y delicioso con aguacate cremoso, huevo perfectamente pochado y pan integral.',
      time: '15 min',
      calories: 320,
      difficulty: 'fácil',
      servings: 2,
      ingredients: [
        { item: 'Pan integral', quantity: '4', unit: 'rebanadas' },
        { item: 'Aguacate maduro', quantity: '2', unit: 'piezas' },
        { item: 'Huevos', quantity: '4', unit: 'piezas' },
        { item: 'Jugo de limón', quantity: '1', unit: 'cucharada' },
        { item: 'Sal', quantity: '1', unit: 'pizca' },
        { item: 'Pimienta negra', quantity: '1', unit: 'pizca' }
      ],
      instructions: [
        'Tostar las rebanadas de pan hasta dorar',
        'Machacar los aguacates con limón, sal y pimienta',
        'Pochar los huevos en agua hirviendo por 3-4 minutos',
        'Untar el aguacate en las tostadas y coronar con huevo',
        'Sazonar con sal y pimienta extra al gusto'
      ]
    },
    lunch: {
      name: 'Ensalada Mediterránea de Quinoa',
      description: 'Una ensalada fresca y nutritiva con quinoa, vegetales, queso feta y aderezo de limón.',
      time: '25 min',
      calories: 450,
      difficulty: 'fácil',
      servings: 2,
      ingredients: [
        { item: 'Quinoa', quantity: '200', unit: 'g' },
        { item: 'Tomates cherry', quantity: '200', unit: 'g' },
        { item: 'Pepino', quantity: '1', unit: 'pieza' },
        { item: 'Queso feta', quantity: '100', unit: 'g' },
        { item: 'Aceite de oliva', quantity: '3', unit: 'cucharadas' },
        { item: 'Limón', quantity: '1', unit: 'pieza' }
      ],
      instructions: [
        'Cocinar la quinoa según las instrucciones del paquete',
        'Cortar en cubos los tomates, pepino y queso feta',
        'Mezclar todos los ingredientes en un bowl grande',
        'Aderezar con aceite de oliva y jugo de limón',
        'Sazonar con sal y pimienta al gusto'
      ]
    },
    dinner: {
      name: 'Salmón a la Parrilla con Vegetales Asados',
      description: 'Tierno salmón a la parrilla con una mezcla colorida de vegetales asados.',
      time: '35 min',
      calories: 520,
      difficulty: 'medio',
      servings: 2,
      ingredients: [
        { item: 'Filete de salmón', quantity: '400', unit: 'g' },
        { item: 'Brócoli', quantity: '200', unit: 'g' },
        { item: 'Pimientos', quantity: '2', unit: 'piezas' },
        { item: 'Aceite de oliva', quantity: '3', unit: 'cucharadas' },
        { item: 'Ajo', quantity: '2', unit: 'dientes' },
        { item: 'Limón', quantity: '1', unit: 'pieza' }
      ],
      instructions: [
        'Precalentar el horno a 200°C',
        'Cortar vegetales y mezclar con aceite de oliva y ajo',
        'Asar vegetales por 20 minutos',
        'Sazonar el salmón con sal, pimienta y limón',
        'Asar el salmón 5-6 minutos por lado',
        'Servir el salmón con los vegetales asados'
      ]
    },
    snacks: {
      name: 'Yogur Griego con Frutos Rojos y Miel',
      description: 'Un snack saludable y rico en proteínas con yogur cremoso, frutos rojos frescos y miel natural.',
      time: '5 min',
      calories: 180,
      difficulty: 'fácil',
      servings: 2,
      ingredients: [
        { item: 'Yogur griego', quantity: '400', unit: 'g' },
        { item: 'Frutos rojos mixtos', quantity: '200', unit: 'g' },
        { item: 'Miel', quantity: '2', unit: 'cucharadas' },
        { item: 'Granola', quantity: '50', unit: 'g' },
        { item: 'Almendras', quantity: '30', unit: 'g' }
      ],
      instructions: [
        'Dividir el yogur en bowls individuales',
        'Cubrir con frutos rojos frescos',
        'Rociar con miel',
        'Espolvorear granola y almendras picadas',
        'Servir inmediatamente'
      ]
    }
  },

  de: {
    breakfast: {
      name: 'Avocado-Toast mit pochiertem Ei',
      description: 'Ein gesundes und leckeres Frühstück mit cremiger Avocado, perfekt pochiertem Ei und Vollkornbrot.',
      time: '15 min',
      calories: 320,
      difficulty: 'einfach',
      servings: 2,
      ingredients: [
        { item: 'Vollkornbrot', quantity: '4', unit: 'Scheiben' },
        { item: 'Reife Avocado', quantity: '2', unit: 'Stück' },
        { item: 'Eier', quantity: '4', unit: 'Stück' },
        { item: 'Zitronensaft', quantity: '1', unit: 'EL' },
        { item: 'Salz', quantity: '1', unit: 'Prise' },
        { item: 'Schwarzer Pfeffer', quantity: '1', unit: 'Prise' }
      ],
      instructions: [
        'Toast die Brotscheiben goldbraun',
        'Avocados mit Zitrone, Salz und Pfeffer zerdrücken',
        'Eier in siedendem Wasser 3-4 Minuten pochieren',
        'Avocado auf Toast streichen und mit pochiertem Ei toppen',
        'Mit zusätzlichem Salz und Pfeffer würzen'
      ]
    },
    lunch: {
      name: 'Mediterraner Quinoa-Salat',
      description: 'Ein frischer und nahrhafter Salat mit Quinoa, Gemüse, Feta-Käse und Zitronendressing.',
      time: '25 min',
      calories: 450,
      difficulty: 'einfach',
      servings: 2,
      ingredients: [
        { item: 'Quinoa', quantity: '200', unit: 'g' },
        { item: 'Kirschtomaten', quantity: '200', unit: 'g' },
        { item: 'Gurke', quantity: '1', unit: 'Stück' },
        { item: 'Feta-Käse', quantity: '100', unit: 'g' },
        { item: 'Olivenöl', quantity: '3', unit: 'EL' },
        { item: 'Zitrone', quantity: '1', unit: 'Stück' }
      ],
      instructions: [
        'Quinoa nach Packungsanweisung kochen',
        'Tomaten, Gurke und Feta würfeln',
        'Alle Zutaten in einer großen Schüssel mischen',
        'Mit Olivenöl und Zitronensaft anmachen',
        'Mit Salz und Pfeffer abschmecken'
      ]
    },
    dinner: {
      name: 'Gegrillter Lachs mit geröstetem Gemüse',
      description: 'Zarter gegrillter Lachs mit einer bunten Mischung aus geröstetem Gemüse.',
      time: '35 min',
      calories: 520,
      difficulty: 'mittel',
      servings: 2,
      ingredients: [
        { item: 'Lachsfilet', quantity: '400', unit: 'g' },
        { item: 'Brokkoli', quantity: '200', unit: 'g' },
        { item: 'Paprika', quantity: '2', unit: 'Stück' },
        { item: 'Olivenöl', quantity: '3', unit: 'EL' },
        { item: 'Knoblauch', quantity: '2', unit: 'Zehen' },
        { item: 'Zitrone', quantity: '1', unit: 'Stück' }
      ],
      instructions: [
        'Ofen auf 200°C vorheizen',
        'Gemüse schneiden und mit Olivenöl und Knoblauch mischen',
        'Gemüse 20 Minuten rösten',
        'Lachs mit Salz, Pfeffer und Zitrone würzen',
        'Lachs 5-6 Minuten pro Seite grillen',
        'Lachs mit geröstetem Gemüse servieren'
      ]
    },
    snacks: {
      name: 'Griechischer Joghurt mit Beeren und Honig',
      description: 'Ein gesunder proteinreicher Snack mit cremigem Joghurt, frischen Beeren und natürlichem Honig.',
      time: '5 min',
      calories: 180,
      difficulty: 'einfach',
      servings: 2,
      ingredients: [
        { item: 'Griechischer Joghurt', quantity: '400', unit: 'g' },
        { item: 'Gemischte Beeren', quantity: '200', unit: 'g' },
        { item: 'Honig', quantity: '2', unit: 'EL' },
        { item: 'Granola', quantity: '50', unit: 'g' },
        { item: 'Mandeln', quantity: '30', unit: 'g' }
      ],
      instructions: [
        'Joghurt auf Schalen verteilen',
        'Mit frischen Beeren toppen',
        'Mit Honig beträufeln',
        'Granola und gehackte Mandeln darüberstreuen',
        'Sofort servieren'
      ]
    }
  },

  fr: {
    breakfast: {
      name: 'Toast à l\'Avocat avec Œuf Poché',
      description: 'Un petit-déjeuner sain et délicieux avec avocat crémeux, œuf parfaitement poché et pain complet.',
      time: '15 min',
      calories: 320,
      difficulty: 'facile',
      servings: 2,
      ingredients: [
        { item: 'Pain complet', quantity: '4', unit: 'tranches' },
        { item: 'Avocat mûr', quantity: '2', unit: 'pièces' },
        { item: 'Œufs', quantity: '4', unit: 'pièces' },
        { item: 'Jus de citron', quantity: '1', unit: 'c. à soupe' },
        { item: 'Sel', quantity: '1', unit: 'pincée' },
        { item: 'Poivre noir', quantity: '1', unit: 'pincée' }
      ],
      instructions: [
        'Griller les tranches de pain jusqu\'à ce qu\'elles soient dorées',
        'Écraser les avocats avec le jus de citron, le sel et le poivre',
        'Pocher les œufs dans l\'eau frémissante pendant 3-4 minutes',
        'Étaler l\'avocat sur le toast et garnir avec l\'œuf poché',
        'Assaisonner avec du sel et du poivre supplémentaires'
      ]
    },
    lunch: {
      name: 'Salade de Quinoa Méditerranéenne',
      description: 'Une salade fraîche et nutritive avec quinoa, légumes, feta et vinaigrette au citron.',
      time: '25 min',
      calories: 450,
      difficulty: 'facile',
      servings: 2,
      ingredients: [
        { item: 'Quinoa', quantity: '200', unit: 'g' },
        { item: 'Tomates cerises', quantity: '200', unit: 'g' },
        { item: 'Concombre', quantity: '1', unit: 'pièce' },
        { item: 'Fromage feta', quantity: '100', unit: 'g' },
        { item: 'Huile d\'olive', quantity: '3', unit: 'c. à soupe' },
        { item: 'Citron', quantity: '1', unit: 'pièce' }
      ],
      instructions: [
        'Cuire le quinoa selon les instructions',
        'Couper en dés les tomates, le concombre et la feta',
        'Mélanger tous les ingrédients dans un grand bol',
        'Assaisonner avec l\'huile d\'olive et le jus de citron',
        'Saler et poivrer au goût'
      ]
    },
    dinner: {
      name: 'Saumon Grillé aux Légumes Rôtis',
      description: 'Saumon grillé tendre avec un mélange coloré de légumes rôtis.',
      time: '35 min',
      calories: 520,
      difficulty: 'moyen',
      servings: 2,
      ingredients: [
        { item: 'Filet de saumon', quantity: '400', unit: 'g' },
        { item: 'Brocoli', quantity: '200', unit: 'g' },
        { item: 'Poivrons', quantity: '2', unit: 'pièces' },
        { item: 'Huile d\'olive', quantity: '3', unit: 'c. à soupe' },
        { item: 'Ail', quantity: '2', unit: 'gousses' },
        { item: 'Citron', quantity: '1', unit: 'pièce' }
      ],
      instructions: [
        'Préchauffer le four à 200°C',
        'Couper les légumes et les mélanger avec l\'huile d\'olive et l\'ail',
        'Rôtir les légumes pendant 20 minutes',
        'Assaisonner le saumon avec sel, poivre et citron',
        'Griller le saumon 5-6 minutes de chaque côté',
        'Servir le saumon avec les légumes rôtis'
      ]
    },
    snacks: {
      name: 'Yaourt Grec aux Baies et Miel',
      description: 'Un encas sain et riche en protéines avec yaourt crémeux, baies fraîches et miel naturel.',
      time: '5 min',
      calories: 180,
      difficulty: 'facile',
      servings: 2,
      ingredients: [
        { item: 'Yaourt grec', quantity: '400', unit: 'g' },
        { item: 'Baies mélangées', quantity: '200', unit: 'g' },
        { item: 'Miel', quantity: '2', unit: 'c. à soupe' },
        { item: 'Granola', quantity: '50', unit: 'g' },
        { item: 'Amandes', quantity: '30', unit: 'g' }
      ],
      instructions: [
        'Diviser le yaourt dans des bols',
        'Garnir de baies fraîches',
        'Arroser de miel',
        'Saupoudrer de granola et d\'amandes hachées',
        'Servir immédiatement'
      ]
    }
  },

  it: {
    breakfast: {
      name: 'Toast all\'Avocado con Uovo in Camicia',
      description: 'Una colazione sana e deliziosa con avocado cremoso, uovo perfettamente in camicia e pane integrale.',
      time: '15 min',
      calories: 320,
      difficulty: 'facile',
      servings: 2,
      ingredients: [
        { item: 'Pane integrale', quantity: '4', unit: 'fette' },
        { item: 'Avocado maturo', quantity: '2', unit: 'pezzi' },
        { item: 'Uova', quantity: '4', unit: 'pezzi' },
        { item: 'Succo di limone', quantity: '1', unit: 'cucchiaio' },
        { item: 'Sale', quantity: '1', unit: 'pizzico' },
        { item: 'Pepe nero', quantity: '1', unit: 'pizzico' }
      ],
      instructions: [
        'Tostare le fette di pane fino a doratura',
        'Schiacciare gli avocado con limone, sale e pepe',
        'Cuocere le uova in camicia in acqua sobollente per 3-4 minuti',
        'Spalmare l\'avocado sul toast e guarnire con l\'uovo',
        'Condire con sale e pepe extra a piacere'
      ]
    },
    lunch: {
      name: 'Insalata Mediterranea di Quinoa',
      description: 'Un\'insalata fresca e nutriente con quinoa, verdure, feta e condimento al limone.',
      time: '25 min',
      calories: 450,
      difficulty: 'facile',
      servings: 2,
      ingredients: [
        { item: 'Quinoa', quantity: '200', unit: 'g' },
        { item: 'Pomodorini', quantity: '200', unit: 'g' },
        { item: 'Cetriolo', quantity: '1', unit: 'pezzo' },
        { item: 'Formaggio feta', quantity: '100', unit: 'g' },
        { item: 'Olio d\'oliva', quantity: '3', unit: 'cucchiai' },
        { item: 'Limone', quantity: '1', unit: 'pezzo' }
      ],
      instructions: [
        'Cuocere la quinoa secondo le istruzioni',
        'Tagliare a dadini pomodori, cetriolo e feta',
        'Mescolare tutti gli ingredienti in una ciotola grande',
        'Condire con olio d\'oliva e succo di limone',
        'Salare e pepare a piacere'
      ]
    },
    dinner: {
      name: 'Salmone alla Griglia con Verdure Arrosto',
      description: 'Salmone tenero alla griglia con un mix colorato di verdure arrosto.',
      time: '35 min',
      calories: 520,
      difficulty: 'medio',
      servings: 2,
      ingredients: [
        { item: 'Filetto di salmone', quantity: '400', unit: 'g' },
        { item: 'Broccoli', quantity: '200', unit: 'g' },
        { item: 'Peperoni', quantity: '2', unit: 'pezzi' },
        { item: 'Olio d\'oliva', quantity: '3', unit: 'cucchiai' },
        { item: 'Aglio', quantity: '2', unit: 'spicchi' },
        { item: 'Limone', quantity: '1', unit: 'pezzo' }
      ],
      instructions: [
        'Preriscaldare il forno a 200°C',
        'Tagliare le verdure e mescolare con olio e aglio',
        'Arrostire le verdure per 20 minuti',
        'Condire il salmone con sale, pepe e limone',
        'Grigliare il salmone 5-6 minuti per lato',
        'Servire il salmone con le verdure arrosto'
      ]
    },
    snacks: {
      name: 'Yogurt Greco con Frutti di Bosco e Miele',
      description: 'Uno snack sano e ricco di proteine con yogurt cremoso, frutti di bosco freschi e miele naturale.',
      time: '5 min',
      calories: 180,
      difficulty: 'facile',
      servings: 2,
      ingredients: [
        { item: 'Yogurt greco', quantity: '400', unit: 'g' },
        { item: 'Frutti di bosco misti', quantity: '200', unit: 'g' },
        { item: 'Miele', quantity: '2', unit: 'cucchiai' },
        { item: 'Granola', quantity: '50', unit: 'g' },
        { item: 'Mandorle', quantity: '30', unit: 'g' }
      ],
      instructions: [
        'Dividere lo yogurt in ciotole',
        'Guarnire con frutti di bosco freschi',
        'Irrorare con miele',
        'Cospargere di granola e mandorle tritate',
        'Servire immediatamente'
      ]
    }
  },

  pt: {
    breakfast: {
      name: 'Torrada de Abacate com Ovo Pochê',
      description: 'Um café da manhã saudável e delicioso com abacate cremoso, ovo perfeitamente pochê e pão integral.',
      time: '15 min',
      calories: 320,
      difficulty: 'fácil',
      servings: 2,
      ingredients: [
        { item: 'Pão integral', quantity: '4', unit: 'fatias' },
        { item: 'Abacate maduro', quantity: '2', unit: 'peças' },
        { item: 'Ovos', quantity: '4', unit: 'peças' },
        { item: 'Suco de limão', quantity: '1', unit: 'colher' },
        { item: 'Sal', quantity: '1', unit: 'pitada' },
        { item: 'Pimenta preta', quantity: '1', unit: 'pitada' }
      ],
      instructions: [
        'Torrar as fatias de pão até dourar',
        'Amassar os abacates com limão, sal e pimenta',
        'Fazer ovos pochê em água fervente por 3-4 minutos',
        'Espalhar abacate na torrada e cobrir com ovo',
        'Temperar com sal e pimenta extra a gosto'
      ]
    },
    lunch: {
      name: 'Salada Mediterrânea de Quinoa',
      description: 'Uma salada fresca e nutritiva com quinoa, legumes, queijo feta e molho de limão.',
      time: '25 min',
      calories: 450,
      difficulty: 'fácil',
      servings: 2,
      ingredients: [
        { item: 'Quinoa', quantity: '200', unit: 'g' },
        { item: 'Tomates cereja', quantity: '200', unit: 'g' },
        { item: 'Pepino', quantity: '1', unit: 'peça' },
        { item: 'Queijo feta', quantity: '100', unit: 'g' },
        { item: 'Azeite de oliva', quantity: '3', unit: 'colheres' },
        { item: 'Limão', quantity: '1', unit: 'peça' }
      ],
      instructions: [
        'Cozinhar a quinoa conforme instruções',
        'Cortar em cubos tomates, pepino e feta',
        'Misturar todos os ingredientes em uma tigela grande',
        'Temperar com azeite e suco de limão',
        'Adicionar sal e pimenta a gosto'
      ]
    },
    dinner: {
      name: 'Salmão Grelhado com Legumes Assados',
      description: 'Salmão macio grelhado com uma mistura colorida de legumes assados.',
      time: '35 min',
      calories: 520,
      difficulty: 'médio',
      servings: 2,
      ingredients: [
        { item: 'Filé de salmão', quantity: '400', unit: 'g' },
        { item: 'Brócolis', quantity: '200', unit: 'g' },
        { item: 'Pimentões', quantity: '2', unit: 'peças' },
        { item: 'Azeite de oliva', quantity: '3', unit: 'colheres' },
        { item: 'Alho', quantity: '2', unit: 'dentes' },
        { item: 'Limão', quantity: '1', unit: 'peça' }
      ],
      instructions: [
        'Pré-aquecer o forno a 200°C',
        'Cortar legumes e misturar com azeite e alho',
        'Assar legumes por 20 minutos',
        'Temperar o salmão com sal, pimenta e limão',
        'Grelhar o salmão 5-6 minutos de cada lado',
        'Servir o salmão com os legumes assados'
      ]
    },
    snacks: {
      name: 'Iogurte Grego com Frutas Vermelhas e Mel',
      description: 'Um lanche saudável e rico em proteínas com iogurte cremoso, frutas vermelhas frescas e mel natural.',
      time: '5 min',
      calories: 180,
      difficulty: 'fácil',
      servings: 2,
      ingredients: [
        { item: 'Iogurte grego', quantity: '400', unit: 'g' },
        { item: 'Frutas vermelhas mistas', quantity: '200', unit: 'g' },
        { item: 'Mel', quantity: '2', unit: 'colheres' },
        { item: 'Granola', quantity: '50', unit: 'g' },
        { item: 'Amêndoas', quantity: '30', unit: 'g' }
      ],
      instructions: [
        'Dividir o iogurte em tigelas',
        'Cobrir com frutas vermelhas frescas',
        'Regar com mel',
        'Polvilhar granola e amêndoas picadas',
        'Servir imediatamente'
      ]
    }
  }
};

export default defaultRecipes;
