/**
 * 🍽️ PROMPTS DE IA PARA MEAL PLANNER
 * ===================================
 *
 * Multi-idioma: Español, Inglés, Alemán
 * 3 prompts únicos: comida individual, día completo, menú semanal
 */

// ============================================
// 1️⃣ PROMPT: COMIDA INDIVIDUAL (breakfast/lunch/dinner)
// ============================================

export const PROMPT_COMIDA_INDIVIDUAL = (mealType, preferences, context = {}) => {
  const {
    usedProteins = [],
    todayProteins = [],
    todayMeals = [],
    weeklyDishRestrictions = '',
    country = '',
    currentMonth = '',
    currentSeason = '',
    language = 'es'  // ✅ NUEVO: Idioma (es, en, de)
  } = context;

  // Detectar platos repetidos (tacos, pizza, pasta, etc.)
  const dishKeywords = ['taco', 'pizza', 'pasta', 'ensalada', 'burger', 'hamburguesa', 'bowl', 'wrap', 'sandwich', 'sushi', 'curry', 'sopa', 'guiso', 'estofado'];
  const usedDishes = [];

  dishKeywords.forEach(keyword => {
    if (todayMeals.some(meal => meal.toLowerCase().includes(keyword))) {
      usedDishes.push(keyword);
    }
  });

  // Textos traducidos
  const lang = language || 'es';

  const texts = {
    es: {
      proteinsUsedToday: 'PROTEÍNAS YA USADAS HOY',
      useDifferentProtein: 'Usar proteína DIFERENTE',
      chickenUsed: 'Pollo ya usado 2+ veces esta semana - NO USAR',
      fishUsed: 'Pescado/salmón ya usado 2+ veces esta semana - NO USAR',
      dishesUsedToday: 'PLATOS YA USADOS HOY',
      createDifferent: 'Crear plato DIFERENTE',
      breakfast: 'DESAYUNO',
      lunch: 'ALMUERZO',
      dinner: 'CENA'
    },
    en: {
      proteinsUsedToday: 'PROTEINS ALREADY USED TODAY',
      useDifferentProtein: 'Use DIFFERENT protein',
      chickenUsed: 'Chicken already used 2+ times this week - DO NOT USE',
      fishUsed: 'Fish/salmon already used 2+ times this week - DO NOT USE',
      dishesUsedToday: 'DISHES ALREADY USED TODAY',
      createDifferent: 'Create DIFFERENT dish',
      breakfast: 'BREAKFAST',
      lunch: 'LUNCH',
      dinner: 'DINNER'
    },
    de: {
      proteinsUsedToday: 'HEUTE BEREITS VERWENDETE PROTEINE',
      useDifferentProtein: 'Verwenden Sie ein ANDERES Protein',
      chickenUsed: 'Huhn bereits 2+ Mal diese Woche verwendet - NICHT VERWENDEN',
      fishUsed: 'Fisch/Lachs bereits 2+ Mal diese Woche verwendet - NICHT VERWENDEN',
      dishesUsedToday: 'HEUTE BEREITS VERWENDETE GERICHTE',
      createDifferent: 'Erstellen Sie ein ANDERES Gericht',
      breakfast: 'FRÜHSTÜCK',
      lunch: 'MITTAGESSEN',
      dinner: 'ABENDESSEN'
    },
    fr: {
      proteinsUsedToday: 'PROTÉINES DÉJÀ UTILISÉES AUJOURD\'HUI',
      useDifferentProtein: 'Utiliser une protéine DIFFÉRENTE',
      chickenUsed: 'Poulet déjà utilisé 2+ fois cette semaine - NE PAS UTILISER',
      fishUsed: 'Poisson/saumon déjà utilisé 2+ fois cette semaine - NE PAS UTILISER',
      dishesUsedToday: 'PLATS DÉJÀ UTILISÉS AUJOURD\'HUI',
      createDifferent: 'Créer un plat DIFFÉRENT',
      breakfast: 'PETIT-DÉJEUNER',
      lunch: 'DÉJEUNER',
      dinner: 'DÎNER'
    },
    it: {
      proteinsUsedToday: 'PROTEINE GIÀ UTILIZZATE OGGI',
      useDifferentProtein: 'Utilizzare una proteina DIVERSA',
      chickenUsed: 'Pollo già utilizzato 2+ volte questa settimana - NON USARE',
      fishUsed: 'Pesce/salmone già utilizzato 2+ volte questa settimana - NON USARE',
      dishesUsedToday: 'PIATTI GIÀ UTILIZZATI OGGI',
      createDifferent: 'Creare un piatto DIVERSO',
      breakfast: 'COLAZIONE',
      lunch: 'PRANZO',
      dinner: 'CENA'
    },
    pt: {
      proteinsUsedToday: 'PROTEÍNAS JÁ USADAS HOJE',
      useDifferentProtein: 'Usar proteína DIFERENTE',
      chickenUsed: 'Frango já usado 2+ vezes esta semana - NÃO USAR',
      fishUsed: 'Peixe/salmão já usado 2+ vezes esta semana - NÃO USAR',
      dishesUsedToday: 'PRATOS JÁ USADOS HOJE',
      createDifferent: 'Criar prato DIFERENTE',
      breakfast: 'CAFÉ DA MANHÃ',
      lunch: 'ALMOÇO',
      dinner: 'JANTAR'
    },
    nl: {
      proteinsUsedToday: 'VANDAAG AL GEBRUIKTE EIWITTEN',
      useDifferentProtein: 'Gebruik een ANDER eiwit',
      chickenUsed: 'Kip al 2+ keer deze week gebruikt - NIET GEBRUIKEN',
      fishUsed: 'Vis/zalm al 2+ keer deze week gebruikt - NIET GEBRUIKEN',
      dishesUsedToday: 'VANDAAG AL GEBRUIKTE GERECHTEN',
      createDifferent: 'Maak een ANDER gerecht',
      breakfast: 'ONTBIJT',
      lunch: 'LUNCH',
      dinner: 'DINER'
    },
    ja: {
      proteinsUsedToday: '今日すでに使用したタンパク質',
      useDifferentProtein: '異なるタンパク質を使用',
      chickenUsed: '鶏肉は今週すでに2回以上使用 - 使用しないでください',
      fishUsed: '魚/サーモンは今週すでに2回以上使用 - 使用しないでください',
      dishesUsedToday: '今日すでに使用した料理',
      createDifferent: '異なる料理を作成',
      breakfast: '朝食',
      lunch: '昼食',
      dinner: '夕食'
    },
    hi: {
      proteinsUsedToday: 'आज पहले से उपयोग किए गए प्रोटीन',
      useDifferentProtein: 'अलग प्रोटीन का उपयोग करें',
      chickenUsed: 'चिकन इस सप्ताह पहले से 2+ बार उपयोग किया गया - उपयोग न करें',
      fishUsed: 'मछली/सैल्मन इस सप्ताह पहले से 2+ बार उपयोग किया गया - उपयोग न करें',
      dishesUsedToday: 'आज पहले से उपयोग किए गए व्यंजन',
      createDifferent: 'अलग व्यंजन बनाएं',
      breakfast: 'नाश्ता',
      lunch: 'दोपहर का भोजन',
      dinner: 'रात का खाना'
    },
    tr: {
      proteinsUsedToday: 'BUGÜN KULLANILAN PROTEİNLER',
      useDifferentProtein: 'FARKLI protein kullanın',
      chickenUsed: 'Tavuk bu hafta 2+ kez kullanıldı - KULLANMAYIN',
      fishUsed: 'Balık/somon bu hafta 2+ kez kullanıldı - KULLANMAYIN',
      dishesUsedToday: 'BUGÜN KULLANILAN YEMEKLER',
      createDifferent: 'FARKLI yemek yapın',
      breakfast: 'KAHVALTI',
      lunch: 'ÖĞLE YEMEĞİ',
      dinner: 'AKŞAM YEMEĞİ'
    }
  };

  const t = texts[lang] || texts['es'];

  // Restricciones de proteínas
  let proteinRestrictions = '';
  if (todayProteins.length > 0) {
    proteinRestrictions += `\n❌ ${t.proteinsUsedToday}: ${todayProteins.join(', ').toUpperCase()}. ${t.useDifferentProtein}.`;
  }

  const proteinCount = {};
  usedProteins.forEach(p => {
    proteinCount[p] = (proteinCount[p] || 0) + 1;
  });

  if (proteinCount['pollo'] >= 2 || proteinCount['chicken'] >= 2 || proteinCount['huhn'] >= 2 || proteinCount['poulet'] >= 2 || proteinCount['pollo'] >= 2 || proteinCount['frango'] >= 2 || proteinCount['kip'] >= 2 || proteinCount['鶏肉'] >= 2 || proteinCount['チキン'] >= 2 || proteinCount['चिकन'] >= 2 || proteinCount['tavuk'] >= 2) {
    proteinRestrictions += `\n❌ ${t.chickenUsed}`;
  }
  if (proteinCount['salmón'] >= 2 || proteinCount['pescado'] >= 2 || proteinCount['salmon'] >= 2 || proteinCount['fish'] >= 2 || proteinCount['lachs'] >= 2 || proteinCount['fisch'] >= 2 || proteinCount['saumon'] >= 2 || proteinCount['poisson'] >= 2 || proteinCount['salmone'] >= 2 || proteinCount['pesce'] >= 2 || proteinCount['peixe'] >= 2 || proteinCount['vis'] >= 2 || proteinCount['zalm'] >= 2 || proteinCount['魚'] >= 2 || proteinCount['サーモン'] >= 2 || proteinCount['मछली'] >= 2 || proteinCount['सैल्मन'] >= 2 || proteinCount['balık'] >= 2 || proteinCount['somon'] >= 2) {
    proteinRestrictions += `\n❌ ${t.fishUsed}`;
  }

  // Restricciones de platos repetidos
  let dishRestrictions = '';
  if (usedDishes.length > 0) {
    dishRestrictions = `\n❌ ${t.dishesUsedToday}: ${usedDishes.join(', ').toUpperCase()}. ${t.createDifferent}.`;
  }

  // Reglas específicas por tipo de comida
  const mealTypeNames = {
    breakfast: t.breakfast,
    lunch: t.lunch,
    dinner: t.dinner
  };

  const mealTypeRules = {
    breakfast: lang === 'en' ?
`🌅 BREAKFAST - STRICT RULES:
- ONLY typical breakfast dishes: eggs, oatmeal, yogurt, fruits, toast, cereals, shakes, smoothies, pancakes, waffles, croissants, french toast
- ❌ NO tacos, NO burgers, NO pasta, NO pizza, NO lunch/dinner dishes
- Must be LIGHT and nutritious to start the day
- Examples: Scrambled eggs with spinach, Oatmeal with fruits and honey, French toast with strawberries, Açai smoothie bowl, Vegetable omelet, Greek yogurt with granola`
    : lang === 'de' ?
`🌅 FRÜHSTÜCK - STRENGE REGELN:
- NUR typische Frühstücksgerichte: Eier, Haferflocken, Joghurt, Obst, Toast, Müsli, Shakes, Smoothies, Pfannkuchen, Waffeln, Croissants, French Toast
- ❌ KEINE Tacos, KEINE Burger, KEINE Pasta, KEINE Pizza, KEINE Mittag-/Abendessen-Gerichte
- Muss LEICHT und nahrhaft sein, um den Tag zu beginnen
- Beispiele: Rührei mit Spinat, Haferflocken mit Früchten und Honig, French Toast mit Erdbeeren, Açai Smoothie Bowl, Gemüse-Omelett, Griechischer Joghurt mit Granola`
    : lang === 'fr' ?
`🌅 PETIT-DÉJEUNER - RÈGLES STRICTES:
- UNIQUEMENT des plats typiques du petit-déjeuner: œufs, flocons d'avoine, yaourt, fruits, pain grillé, céréales, shakes, smoothies, crêpes, gaufres, croissants, pain perdu
- ❌ PAS de tacos, PAS de burgers, PAS de pâtes, PAS de pizza, PAS de plats de déjeuner/dîner
- Doit être LÉGER et nutritif pour commencer la journée
- Exemples: Œufs brouillés aux épinards, Flocons d'avoine aux fruits et miel, Pain perdu aux fraises, Bol de smoothie açai, Omelette aux légumes, Yaourt grec au granola`
    : lang === 'it' ?
`🌅 COLAZIONE - REGOLE RIGIDE:
- SOLO piatti tipici da colazione: uova, farina d'avena, yogurt, frutta, toast, cereali, frullati, smoothie, pancake, waffle, croissant, french toast
- ❌ NO tacos, NO burger, NO pasta, NO pizza, NO piatti da pranzo/cena
- Deve essere LEGGERO e nutriente per iniziare la giornata
- Esempi: Uova strapazzate con spinaci, Farina d'avena con frutta e miele, French toast con fragole, Smoothie bowl di açai, Frittata di verdure, Yogurt greco con granola`
    : lang === 'pt' ?
`🌅 CAFÉ DA MANHÃ - REGRAS ESTRITAS:
- APENAS pratos típicos de café da manhã: ovos, aveia, iogurte, frutas, torradas, cereais, shakes, smoothies, panquecas, waffles, croissants, rabanada
- ❌ NÃO tacos, NÃO hambúrgueres, NÃO massa, NÃO pizza, NÃO pratos de almoço/jantar
- Deve ser LEVE e nutritivo para começar o dia
- Exemplos: Ovos mexidos com espinafre, Aveia com frutas e mel, Rabanada com morangos, Smoothie bowl de açaí, Omelete de vegetais, Iogurte grego com granola`
    : lang === 'nl' ?
`🌅 ONTBIJT - STRIKTE REGELS:
- ALLEEN typische ontbijtgerechten: eieren, havermout, yoghurt, fruit, toast, ontbijtgranen, shakes, smoothies, pannenkoeken, wafels, croissants, wentelteefjes
- ❌ GEEN taco's, GEEN burgers, GEEN pasta, GEEN pizza, GEEN lunch-/dinergerechten
- Moet LICHT en voedzaam zijn om de dag te beginnen
- Voorbeelden: Roerei met spinazie, Havermout met fruit en honing, Wentelteefjes met aardbeien, Açai smoothie bowl, Groentenomelet, Griekse yoghurt met granola`
    : lang === 'ja' ?
`🌅 朝食 - 厳格なルール:
- 典型的な朝食料理のみ: 卵、オートミール、ヨーグルト、フルーツ、トースト、シリアル、シェイク、スムージー、パンケーキ、ワッフル、クロワッサン、フレンチトースト
- ❌ タコス禁止、ハンバーガー禁止、パスタ禁止、ピザ禁止、昼食/夕食料理禁止
- 一日を始めるために軽くて栄養価が高くなければなりません
- 例: ほうれん草入りスクランブルエッグ、フルーツとハチミツのオートミール、イチゴのフレンチトースト、アサイースムージーボウル、野菜オムレツ、グラノーラ入りギリシャヨーグルト`
    : lang === 'hi' ?
`🌅 नाश्ता - सख्त नियम:
- केवल विशिष्ट नाश्ते के व्यंजन: अंडे, ओटमील, दही, फल, टोस्ट, अनाज, शेक, स्मूदी, पैनकेक, वैफल्स, क्रोइसैन्ट, फ्रेंच टोस्ट
- ❌ टैकोस नहीं, बर्गर नहीं, पास्ता नहीं, पिज़्ज़ा नहीं, दोपहर/रात के खाने के व्यंजन नहीं
- दिन की शुरुआत करने के लिए हल्का और पौष्टिक होना चाहिए
- उदाहरण: पालक के साथ भुर्जी, फल और शहद के साथ ओटमील, स्ट्रॉबेरी के साथ फ्रेंच टोस्ट, असाई स्मूदी बाउल, सब्जी ऑमलेट, ग्रेनोला के साथ ग्रीक दही`
    : lang === 'tr' ?
`🌅 KAHVALTI - SIKI KURALLAR:
- SADECE tipik kahvaltı yemekleri: yumurta, yulaf ezmesi, yoğurt, meyveler, tost, tahıllar, shake, smoothie, krep, waffle, kruvasan, fransız tostu
- ❌ Taco YOK, burger YOK, makarna YOK, pizza YOK, öğle/akşam yemeği yemekleri YOK
- Güne başlamak için HAFİF ve besleyici olmalı
- Örnekler: Ispanaklı çırpılmış yumurta, Meyveli ve ballı yulaf ezmesi, Çilekli fransız tostu, Açai smoothie kasesi, Sebzeli omlet, Granolalı Yunan yoğurdu`
    :
`🌅 DESAYUNO - REGLAS ESTRICTAS:
- SOLO platos típicos de desayuno: huevos, avena, yogurt, frutas, pan tostado, cereales, batidos, smoothies, tortitas, waffles, croissants, tostadas francesas
- ❌ NO tacos, NO hamburguesas, NO pasta, NO pizza, NO platos de almuerzo/cena
- Debe ser LIGERO y nutritivo para empezar el día
- Ejemplos: Huevos revueltos con espinacas, Avena con frutas y miel, Tostadas francesas con fresas, Smoothie bowl de açai, Tortilla de verduras, Yogurt griego con granola`,

    lunch: lang === 'en' ?
`☀️ LUNCH - STRICT RULES:
- COMPLETE dish (protein + carbohydrate + vegetables)
- Can be filling and satisfying
- GREAT VARIETY: pasta (carbonara, bolognese, pesto), homemade pizza, burgers, tacos, burritos, chicken rice, paella, schnitzels, empanadas, fajitas, lasagna, risotto, curry, pad thai, sushi, ramen, stews, roasts, grilled meats, fish, complete salads, bowls, wraps, hearty soups
- DO NOT repeat the same type of dish if already used at breakfast`
    : lang === 'de' ?
`☀️ MITTAGESSEN - STRENGE REGELN:
- VOLLSTÄNDIGES Gericht (Protein + Kohlenhydrate + Gemüse)
- Kann sättigend und befriedigend sein
- GROSSE VIELFALT: Pasta (Carbonara, Bolognese, Pesto), hausgemachte Pizza, Burger, Tacos, Burritos, Hühnerreis, Paella, Schnitzel, Empanadas, Fajitas, Lasagne, Risotto, Curry, Pad Thai, Sushi, Ramen, Eintöpfe, Braten, gegrilltes Fleisch, Fisch, vollständige Salate, Bowls, Wraps, herzhafte Suppen
- NICHT die gleiche Art von Gericht wiederholen, wenn es bereits beim Frühstück verwendet wurde`
    : lang === 'fr' ?
`☀️ DÉJEUNER - RÈGLES STRICTES:
- Plat COMPLET (protéine + glucides + légumes)
- Peut être copieux et satisfaisant
- GRANDE VARIÉTÉ: pâtes (carbonara, bolognaise, pesto), pizza maison, burgers, tacos, burritos, riz au poulet, paella, schnitzels, empanadas, fajitas, lasagne, risotto, curry, pad thai, sushi, ramen, ragoûts, rôtis, viandes grillées, poisson, salades complètes, bowls, wraps, soupes copieuses
- NE PAS répéter le même type de plat s'il a déjà été utilisé au petit-déjeuner`
    : lang === 'it' ?
`☀️ PRANZO - REGOLE RIGIDE:
- Piatto COMPLETO (proteine + carboidrati + verdure)
- Può essere abbondante e soddisfacente
- GRANDE VARIETÀ: pasta (carbonara, bolognese, pesto), pizza fatta in casa, burger, tacos, burritos, riso con pollo, paella, cotolette, empanadas, fajitas, lasagne, risotto, curry, pad thai, sushi, ramen, stufati, arrosti, carni alla griglia, pesce, insalate complete, bowl, wrap, zuppe abbondanti
- NON ripetere lo stesso tipo di piatto se già usato a colazione`
    : lang === 'pt' ?
`☀️ ALMOÇO - REGRAS ESTRITAS:
- Prato COMPLETO (proteína + carboidrato + vegetais)
- Pode ser farto e satisfatório
- GRANDE VARIEDADE: massa (carbonara, bolonhesa, pesto), pizza caseira, hambúrgueres, tacos, burritos, arroz com frango, paella, bifes empanados, empanadas, fajitas, lasanha, risoto, curry, pad thai, sushi, ramen, ensopados, assados, carnes grelhadas, peixe, saladas completas, bowls, wraps, sopas fartas
- NÃO repetir o mesmo tipo de prato se já foi usado no café da manhã`
    : lang === 'nl' ?
`☀️ LUNCH - STRIKTE REGELS:
- COMPLEET gerecht (eiwit + koolhydraat + groenten)
- Kan vullend en bevredigend zijn
- GROTE VARIËTEIT: pasta (carbonara, bolognese, pesto), zelfgemaakte pizza, burgers, taco's, burrito's, kiprijst, paella, schnitzels, empanadas, fajitas, lasagne, risotto, curry, pad thai, sushi, ramen, stoofschotels, gebraden vlees, gegrild vlees, vis, complete salades, bowls, wraps, hartige soepen
- NIET hetzelfde type gerecht herhalen als het al bij het ontbijt is gebruikt`
    : lang === 'ja' ?
`☀️ 昼食 - 厳格なルール:
- 完全な料理（タンパク質 + 炭水化物 + 野菜）
- ボリュームがあり満足感がある
- 大きな多様性: パスタ（カルボナーラ、ボロネーゼ、ペスト）、自家製ピザ、ハンバーガー、タコス、ブリトー、チキンライス、パエリア、シュニッツェル、エンパナーダ、ファヒータ、ラザニア、リゾット、カレー、パッタイ、寿司、ラーメン、シチュー、ロースト、グリル肉、魚、完全なサラダ、ボウル、ラップ、ボリュームのあるスープ
- 朝食で既に使用した場合は同じタイプの料理を繰り返さないでください`
    : lang === 'hi' ?
`☀️ दोपहर का भोजन - सख्त नियम:
- पूर्ण व्यंजन (प्रोटीन + कार्बोहाइड्रेट + सब्जियां)
- भरपूर और संतोषजनक हो सकता है
- बड़ी विविधता: पास्ता (कार्बोनारा, बोलोग्नीज़, पेस्टो), घर का बना पिज़्ज़ा, बर्गर, टैकोस, बरिटोस, चिकन राइस, पायला, श्नित्ज़ेल, एम्पानाडास, फजीटास, लसग्ना, रिसोट्टो, करी, पैड थाई, सुशी, रामेन, स्टू, रोस्ट, ग्रिल्ड मीट, मछली, पूर्ण सलाद, बाउल, रैप, भरपूर सूप
- यदि नाश्ते में पहले से उपयोग किया गया है तो वही प्रकार का व्यंजन दोहराएं नहीं`
    : lang === 'tr' ?
`☀️ ÖĞLE YEMEĞİ - SIKI KURALLAR:
- TAM yemek (protein + karbonhidrat + sebzeler)
- Doyurucu ve tatmin edici olabilir
- BÜYÜK ÇEŞİTLİLİK: makarna (karbonara, bolonez, pesto), ev yapımı pizza, burger, taco, burrito, tavuklu pilav, paella, schnitzel, empanada, fajita, lazanya, risotto, köri, pad thai, suşi, ramen, güveç, rosto, ızgara et, balık, tam salatalar, bowl, wrap, doyurucu çorbalar
- Kahvaltıda zaten kullanıldıysa aynı tip yemeği TEKRARLAMAYIN`
    :
`☀️ ALMUERZO - REGLAS ESTRICTAS:
- Plato COMPLETO (proteína + carbohidrato + vegetales)
- Puede ser abundante y satisfactorio
- GRAN VARIEDAD: pasta (carbonara, boloñesa, pesto), pizza casera, hamburguesas, tacos, burritos, arroz con pollo, paella, milanesas, empanadas, fajitas, lasaña, risotto, curry, pad thai, sushi, ramen, guisos, estofados, asados, carnes a la plancha, pescados, ensaladas completas, bowls, wraps, sopas abundantes
- NO repetir el mismo tipo de plato si ya se usó en desayuno`,

    dinner: lang === 'en' ?
`🌙 DINNER - STRICT RULES:
- LIGHT dish (lighter than lunch)
- Easy to digest for the evening
- OPTIONS: fish, grilled chicken, protein salads, soups, creams, omelets, baked vegetables, light tacos, wraps, sandwiches, toasts
- Avoid heavy fried or very greasy foods
- DO NOT repeat the same type of dish if already used at breakfast or lunch`
    : lang === 'de' ?
`🌙 ABENDESSEN - STRENGE REGELN:
- LEICHTES Gericht (leichter als Mittagessen)
- Leicht verdaulich für den Abend
- OPTIONEN: Fisch, gegrilltes Hähnchen, Protein-Salate, Suppen, Cremes, Omeletts, gebackenes Gemüse, leichte Tacos, Wraps, Sandwiches, Toast
- Schwere frittierte oder sehr fettige Speisen vermeiden
- NICHT die gleiche Art von Gericht wiederholen, wenn es bereits beim Frühstück oder Mittagessen verwendet wurde`
    : lang === 'fr' ?
`🌙 DÎNER - RÈGLES STRICTES:
- Plat LÉGER (plus léger que le déjeuner)
- Facile à digérer pour le soir
- OPTIONS: poisson, poulet grillé, salades protéinées, soupes, crèmes, omelettes, légumes au four, tacos légers, wraps, sandwichs, toasts
- Éviter les aliments frits lourds ou très gras
- NE PAS répéter le même type de plat s'il a déjà été utilisé au petit-déjeuner ou au déjeuner`
    : lang === 'it' ?
`🌙 CENA - REGOLE RIGIDE:
- Piatto LEGGERO (più leggero del pranzo)
- Facile da digerire per la sera
- OPZIONI: pesce, pollo alla griglia, insalate proteiche, zuppe, creme, frittate, verdure al forno, tacos leggeri, wrap, panini, toast
- Evitare cibi fritti pesanti o molto grassi
- NON ripetere lo stesso tipo di piatto se già usato a colazione o pranzo`
    : lang === 'pt' ?
`🌙 JANTAR - REGRAS ESTRITAS:
- Prato LEVE (mais leve que o almoço)
- Fácil de digerir para a noite
- OPÇÕES: peixe, frango grelhado, saladas com proteína, sopas, cremes, omeletes, vegetais assados, tacos leves, wraps, sanduíches, torradas
- Evitar frituras pesadas ou comidas muito gordurosas
- NÃO repetir o mesmo tipo de prato se já foi usado no café da manhã ou almoço`
    : lang === 'nl' ?
`🌙 DINER - STRIKTE REGELS:
- LICHT gerecht (lichter dan lunch)
- Gemakkelijk te verteren voor de avond
- OPTIES: vis, gegrilde kip, eiwitrijke salades, soepen, crèmes, omeletten, gebakken groenten, lichte taco's, wraps, broodjes, toast
- Vermijd zware gebakken of zeer vette gerechten
- NIET hetzelfde type gerecht herhalen als het al bij het ontbijt of de lunch is gebruikt`
    : lang === 'ja' ?
`🌙 夕食 - 厳格なルール:
- 軽い料理（昼食より軽い）
- 夜に消化しやすい
- オプション: 魚、グリルチキン、プロテインサラダ、スープ、クリーム、オムレツ、焼き野菜、軽いタコス、ラップ、サンドイッチ、トースト
- 重い揚げ物や非常に脂っこい食べ物は避ける
- 朝食または昼食で既に使用した場合は同じタイプの料理を繰り返さないでください`
    : lang === 'hi' ?
`🌙 रात का खाना - सख्त नियम:
- हल्का व्यंजन (दोपहर के भोजन से हल्का)
- शाम के लिए पचाने में आसान
- विकल्प: मछली, ग्रिल्ड चिकन, प्रोटीन सलाद, सूप, क्रीम, ऑमलेट, बेक्ड सब्जियां, हल्के टैकोस, रैप, सैंडविच, टोस्ट
- भारी तले हुए या बहुत चिकने खाद्य पदार्थों से बचें
- यदि नाश्ते या दोपहर के भोजन में पहले से उपयोग किया गया है तो वही प्रकार का व्यंजन दोहराएं नहीं`
    : lang === 'tr' ?
`🌙 AKŞAM YEMEĞİ - SIKI KURALLAR:
- HAFİF yemek (öğle yemeğinden daha hafif)
- Akşam için sindirimi kolay
- SEÇENEKLER: balık, ızgara tavuk, proteinli salatalar, çorbalar, kremalar, omlet, fırınlanmış sebzeler, hafif taco, wrap, sandviç, tost
- Ağır kızartılmış veya çok yağlı yiyeceklerden kaçının
- Kahvaltıda veya öğle yemeğinde zaten kullanıldıysa aynı tip yemeği TEKRARLAMAYIN`
    :
`🌙 CENA - REGLAS ESTRICTAS:
- Plato LIGERO (más liviano que almuerzo)
- Fácil de digerir para la noche
- OPCIONES: pescados, pollo a la plancha, ensaladas con proteína, sopas, cremas, tortillas, omelettes, verduras al horno, tacos ligeros, wraps, sándwiches, tostadas
- Evitar fritos pesados o comidas muy grasosas
- NO repetir el mismo tipo de plato si ya se usó en desayuno o almuerzo`
  };

  // Productos de temporada
  let seasonalInfo = '';
  if (preferences.seasonalProducts && country) {
    const seasonalText = {
      es: 'Productos de temporada',
      en: 'Seasonal products',
      de: 'Saisonale Produkte',
      fr: 'Produits de saison',
      it: 'Prodotti di stagione',
      pt: 'Produtos da estação',
      nl: 'Seizoensproducten',
      ja: '季節の食材',
      hi: 'मौसमी उत्पाद',
      tr: 'Mevsimsel ürünler'
    };
    const yesText = {
      es: 'Sí',
      en: 'Yes',
      de: 'Ja',
      fr: 'Oui',
      it: 'Sì',
      pt: 'Sim',
      nl: 'Ja',
      ja: 'はい',
      hi: 'हाँ',
      tr: 'Evet'
    };
    seasonalInfo = `\n- ${seasonalText[lang] || seasonalText['es']}: ${yesText[lang] || yesText['es']} (${country}, ${currentMonth}, ${currentSeason})`;
  }

  // Restricciones alimentarias
  let dietaryRestrictions = '';
  const allRestrictions = [...(preferences.restrictions || [])];

  if (preferences.customRestrictions && Array.isArray(preferences.customRestrictions)) {
    allRestrictions.push(...preferences.customRestrictions);
  }

  if (allRestrictions.length > 0) {
    const restrictionsText = {
      es: 'RESTRICCIONES ALIMENTARIAS (NO INCLUIR NUNCA)',
      en: 'DIETARY RESTRICTIONS (NEVER INCLUDE)',
      de: 'ERNÄHRUNGSEINSCHRÄNKUNGEN (NIEMALS EINBEZIEHEN)',
      fr: 'RESTRICTIONS ALIMENTAIRES (NE JAMAIS INCLURE)',
      it: 'RESTRIZIONI ALIMENTARI (MAI INCLUDERE)',
      pt: 'RESTRIÇÕES ALIMENTARES (NUNCA INCLUIR)',
      nl: 'VOEDINGSBEPERKINGEN (NOOIT OPNEMEN)',
      ja: '食事制限（絶対に含めないでください）',
      hi: 'आहार प्रतिबंध (कभी शामिल न करें)',
      tr: 'DİYET KISITLAMALARI (ASLA DAHİL ETMEYİN)'
    };
    dietaryRestrictions = `\n\n❌ ${restrictionsText[lang] || restrictionsText['es']}: ${allRestrictions.join(', ')}`;
  }

  // Calorías máximas
  let calorieLimit = '';
  if (preferences.maxCaloriesEnabled && preferences.maxCalories) {
    const caloriesText = {
      es: 'Máximo de calorías',
      en: 'Maximum calories',
      de: 'Maximale Kalorien',
      fr: 'Calories maximales',
      it: 'Calorie massime',
      pt: 'Calorias máximas',
      nl: 'Maximale calorieën',
      ja: '最大カロリー',
      hi: 'अधिकतम कैलोरी',
      tr: 'Maksimum kalori'
    };
    calorieLimit = `\n- ${caloriesText[lang] || caloriesText['es']}: ${preferences.maxCalories} kcal`;
  }

  // ✅ Tipo de cocina preferida
  const cuisineTypeRules = {
    es: {
      'varied': '- Variar cocinas: mediterránea, asiática, mexicana, peruana, italiana, japonesa, tailandesa, argentina, española',
      'asian': '- Enfoque PRINCIPAL en cocina asiática: japonesa (sushi, ramen, teriyaki), china (arroz frito, dim sum, wok), tailandesa (pad thai, curry), coreana (bibimbap, kimchi), india (curry, tandoori)',
      'italian': '- Enfoque PRINCIPAL en cocina italiana: pasta (carbonara, boloñesa, pesto, alfredo), pizza, risotto, lasaña, gnocchi, ossobuco, tiramisú',
      'mexican': '- Enfoque PRINCIPAL en cocina mexicana: tacos, burritos, enchiladas, quesadillas, fajitas, guacamole, mole, pozole, tamales',
      'mediterranean': '- Enfoque PRINCIPAL en cocina mediterránea: ensaladas griegas, hummus, falafel, paella, gazpacho, pescados al horno, aceite de oliva, tomates'
    },
    en: {
      'varied': '- Vary cuisines: Mediterranean, Asian, Mexican, Peruvian, Italian, Japanese, Thai, Argentinian, Spanish',
      'asian': '- MAIN focus on Asian cuisine: Japanese (sushi, ramen, teriyaki), Chinese (fried rice, dim sum, wok), Thai (pad thai, curry), Korean (bibimbap, kimchi), Indian (curry, tandoori)',
      'italian': '- MAIN focus on Italian cuisine: pasta (carbonara, bolognese, pesto, alfredo), pizza, risotto, lasagna, gnocchi, ossobuco, tiramisu',
      'mexican': '- MAIN focus on Mexican cuisine: tacos, burritos, enchiladas, quesadillas, fajitas, guacamole, mole, pozole, tamales',
      'mediterranean': '- MAIN focus on Mediterranean cuisine: Greek salads, hummus, falafel, paella, gazpacho, baked fish, olive oil, tomatoes'
    },
    de: {
      'varied': '- Küchen variieren: mediterran, asiatisch, mexikanisch, peruanisch, italienisch, japanisch, thailändisch, argentinisch, spanisch',
      'asian': '- HAUPTFOKUS auf asiatische Küche: japanisch (Sushi, Ramen, Teriyaki), chinesisch (gebratener Reis, Dim Sum, Wok), thailändisch (Pad Thai, Curry), koreanisch (Bibimbap, Kimchi), indisch (Curry, Tandoori)',
      'italian': '- HAUPTFOKUS auf italienische Küche: Pasta (Carbonara, Bolognese, Pesto, Alfredo), Pizza, Risotto, Lasagne, Gnocchi, Ossobuco, Tiramisu',
      'mexican': '- HAUPTFOKUS auf mexikanische Küche: Tacos, Burritos, Enchiladas, Quesadillas, Fajitas, Guacamole, Mole, Pozole, Tamales',
      'mediterranean': '- HAUPTFOKUS auf mediterrane Küche: griechische Salate, Hummus, Falafel, Paella, Gazpacho, gebackener Fisch, Olivenöl, Tomaten'
    },
    fr: {
      'varied': '- Varier les cuisines: méditerranéenne, asiatique, mexicaine, péruvienne, italienne, japonaise, thaïlandaise, argentine, espagnole',
      'asian': '- Focus PRINCIPAL sur la cuisine asiatique: japonaise (sushi, ramen, teriyaki), chinoise (riz frit, dim sum, wok), thaïlandaise (pad thai, curry), coréenne (bibimbap, kimchi), indienne (curry, tandoori)',
      'italian': '- Focus PRINCIPAL sur la cuisine italienne: pâtes (carbonara, bolognaise, pesto, alfredo), pizza, risotto, lasagne, gnocchi, ossobuco, tiramisu',
      'mexican': '- Focus PRINCIPAL sur la cuisine mexicaine: tacos, burritos, enchiladas, quesadillas, fajitas, guacamole, mole, pozole, tamales',
      'mediterranean': '- Focus PRINCIPAL sur la cuisine méditerranéenne: salades grecques, houmous, falafel, paella, gazpacho, poisson au four, huile d\'olive, tomates'
    },
    it: {
      'varied': '- Variare le cucine: mediterranea, asiatica, messicana, peruviana, italiana, giapponese, thailandese, argentina, spagnola',
      'asian': '- Focus PRINCIPALE sulla cucina asiatica: giapponese (sushi, ramen, teriyaki), cinese (riso fritto, dim sum, wok), thailandese (pad thai, curry), coreana (bibimbap, kimchi), indiana (curry, tandoori)',
      'italian': '- Focus PRINCIPALE sulla cucina italiana: pasta (carbonara, bolognese, pesto, alfredo), pizza, risotto, lasagne, gnocchi, ossobuco, tiramisù',
      'mexican': '- Focus PRINCIPALE sulla cucina messicana: tacos, burritos, enchiladas, quesadillas, fajitas, guacamole, mole, pozole, tamales',
      'mediterranean': '- Focus PRINCIPALE sulla cucina mediterranea: insalate greche, hummus, falafel, paella, gazpacho, pesce al forno, olio d\'oliva, pomodori'
    },
    pt: {
      'varied': '- Variar cozinhas: mediterrânea, asiática, mexicana, peruana, italiana, japonesa, tailandesa, argentina, espanhola',
      'asian': '- Foco PRINCIPAL em cozinha asiática: japonesa (sushi, ramen, teriyaki), chinesa (arroz frito, dim sum, wok), tailandesa (pad thai, curry), coreana (bibimbap, kimchi), indiana (curry, tandoori)',
      'italian': '- Foco PRINCIPAL em cozinha italiana: massa (carbonara, bolonhesa, pesto, alfredo), pizza, risoto, lasanha, gnocchi, ossobuco, tiramisu',
      'mexican': '- Foco PRINCIPAL em cozinha mexicana: tacos, burritos, enchiladas, quesadillas, fajitas, guacamole, mole, pozole, tamales',
      'mediterranean': '- Foco PRINCIPAL em cozinha mediterrânea: saladas gregas, homus, falafel, paella, gazpacho, peixe assado, azeite de oliva, tomates'
    },
    nl: {
      'varied': '- Varieer keukens: mediterraan, Aziatisch, Mexicaans, Peruaans, Italiaans, Japans, Thais, Argentijns, Spaans',
      'asian': '- HOOFDFOCUS op Aziatische keuken: Japans (sushi, ramen, teriyaki), Chinees (gebakken rijst, dim sum, wok), Thais (pad thai, curry), Koreaans (bibimbap, kimchi), Indiaas (curry, tandoori)',
      'italian': '- HOOFDFOCUS op Italiaanse keuken: pasta (carbonara, bolognese, pesto, alfredo), pizza, risotto, lasagne, gnocchi, ossobuco, tiramisu',
      'mexican': '- HOOFDFOCUS op Mexicaanse keuken: tacos, burritos, enchiladas, quesadillas, fajitas, guacamole, mole, pozole, tamales',
      'mediterranean': '- HOOFDFOCUS op mediterrane keuken: Griekse salades, hummus, falafel, paella, gazpacho, gebakken vis, olijfolie, tomaten'
    },
    ja: {
      'varied': '- 料理を変化させる：地中海料理、アジア料理、メキシコ料理、ペルー料理、イタリア料理、日本料理、タイ料理、アルゼンチン料理、スペイン料理',
      'asian': '- アジア料理に主な焦点：日本料理（寿司、ラーメン、照り焼き）、中華料理（チャーハン、点心、炒め物）、タイ料理（パッタイ、カレー）、韓国料理（ビビンバ、キムチ）、インド料理（カレー、タンドリー）',
      'italian': '- イタリア料理に主な焦点：パスタ（カルボナーラ、ボロネーゼ、ペスト、アルフレッド）、ピザ、リゾット、ラザニア、ニョッキ、オッソブーコ、ティラミス',
      'mexican': '- メキシコ料理に主な焦点：タコス、ブリトー、エンチラーダ、ケサディーヤ、ファヒータ、ワカモレ、モレ、ポソレ、タマレス',
      'mediterranean': '- 地中海料理に主な焦点：ギリシャサラダ、フムス、ファラフェル、パエリア、ガスパチョ、焼き魚、オリーブオイル、トマト'
    },
    hi: {
      'varied': '- व्यंजनों में विविधता लाएं: भूमध्यसागरीय, एशियाई, मैक्सिकन, पेरूवियन, इतालवी, जापानी, थाई, अर्जेंटीनियन, स्पेनिश',
      'asian': '- एशियाई व्यंजनों पर मुख्य ध्यान: जापानी (सुशी, रामेन, टेरियाकी), चीनी (फ्राइड राइस, डिम सम, वोक), थाई (पैड थाई, करी), कोरियाई (बिबिम्बाप, किमची), भारतीय (करी, तंदूरी)',
      'italian': '- इतालवी व्यंजनों पर मुख्य ध्यान: पास्ता (कार्बोनारा, बोलोग्नीज़, पेस्टो, अल्फ्रेडो), पिज़्ज़ा, रिसोट्टो, लसग्ना, न्योकी, ओसोबुको, तिरामिसू',
      'mexican': '- मैक्सिकन व्यंजनों पर मुख्य ध्यान: टैकोस, बरिटोस, एनचिलाडास, क्वेसाडिलस, फजीटास, गुआकामोले, मोले, पोज़ोले, तमालेस',
      'mediterranean': '- भूमध्यसागरीय व्यंजनों पर मुख्य ध्यान: ग्रीक सलाद, हुम्मस, फलाफेल, पायला, गज़पाचो, बेक्ड मछली, जैतून का तेल, टमाटर'
    },
    tr: {
      'varied': '- Mutfakları çeşitlendirin: Akdeniz, Asya, Meksika, Peru, İtalyan, Japon, Tayland, Arjantin, İspanyol',
      'asian': '- Asya mutfağına ANA ODAK: Japon (suşi, ramen, teriyaki), Çin (kızarmış pirinç, dim sum, wok), Tayland (pad thai, köri), Kore (bibimbap, kimçi), Hint (köri, tanduri)',
      'italian': '- İtalyan mutfağına ANA ODAK: makarna (karbonara, bolonez, pesto, alfredo), pizza, risotto, lazanya, gnocchi, ossobuco, tiramisu',
      'mexican': '- Meksika mutfağına ANA ODAK: taco, burrito, enchilada, quesadilla, fajita, guacamole, mole, pozole, tamale',
      'mediterranean': '- Akdeniz mutfağına ANA ODAK: Yunan salatası, humus, falafel, paella, gazpaço, fırınlanmış balık, zeytinyağı, domates'
    }
  };

  const cuisineRule = cuisineTypeRules[lang]?.[preferences.cuisineType] || cuisineTypeRules[lang]?.['varied'] || cuisineTypeRules['es']['varied'];

  // Prompt completo según idioma
  if (lang === 'en') {
    return `You are a professional chef. Suggest ONE delicious, realistic ${mealTypeNames[mealType]} APPROPRIATE for this meal type.

USER PREFERENCES:
- Diet: ${preferences.diet}
- Servings: ${preferences.servings} people
- Restrictions: ${preferences.restrictions?.join(', ') || 'none'}
- Budget: ${preferences.budget}
- Cooking level: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ CRITICAL VARIETY RULES:
- Create a UNIQUE and CREATIVE dish, but REALISTIC (not always healthy)
- If there are NO dietary restrictions, you can suggest: pasta, pizza, homemade burgers, tacos, schnitzels, chicken rice, stews, empanadas, etc.
- If diet is "normal" or "balanced", DO NOT limit to light/healthy food only
- Vary cooking method: grilled, baked, sautéed, steamed, stewed, fried
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

RESPOND ONLY WITH JSON:
{
  "name": "Dish name",
  "servings": ${preferences.servings},
  "time": "30 min",
  "difficulty": "easy",
  "calories": 450,
  "description": "Brief and attractive description of the dish in 2-3 lines",
  "instructions": [
    "Step 1: Specific action...",
    "Step 2: Next action...",
    "Step 3: Cook and serve..."
  ],
  "ingredients": [
    {"item": "Ingredient", "quantity": "100", "unit": "g"}
  ]
}`;
  } else if (lang === 'de') {
    return `Sie sind ein professioneller Koch. Schlagen Sie EIN köstliches, realistisches ${mealTypeNames[mealType]} vor, das für diese Mahlzeit GEEIGNET ist.

BENUTZERPRÄFERENZEN:
- Diät: ${preferences.diet}
- Portionen: ${preferences.servings} Personen
- Einschränkungen: ${preferences.restrictions?.join(', ') || 'keine'}
- Budget: ${preferences.budget}
- Kochniveau: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ KRITISCHE VARIETÄTSREGELN:
- Erstellen Sie ein EINZIGARTIGES und KREATIVES Gericht, aber REALISTISCH (nicht immer gesund)
- Wenn es KEINE diätetischen Einschränkungen gibt, können Sie vorschlagen: Pasta, Pizza, hausgemachte Burger, Tacos, Schnitzel, Hühnerreis, Eintöpfe, Empanadas, usw.
- Wenn die Diät "normal" oder "ausgewogen" ist, NICHT nur auf leichte/gesunde Lebensmittel beschränken
- Kochmethode variieren: gegrillt, gebacken, sautiert, gedämpft, geschmort, frittiert
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

NUR MIT JSON ANTWORTEN:
{
  "name": "Gerichtname",
  "servings": ${preferences.servings},
  "time": "30 min",
  "difficulty": "einfach",
  "calories": 450,
  "description": "Kurze und ansprechende Beschreibung des Gerichts in 2-3 Zeilen",
  "instructions": [
    "Schritt 1: Spezifische Aktion...",
    "Schritt 2: Nächste Aktion...",
    "Schritt 3: Kochen und servieren..."
  ],
  "ingredients": [
    {"item": "Zutat", "quantity": "100", "unit": "g"}
  ]
}`;
  } else if (lang === 'fr') {
    return `Vous êtes un chef professionnel. Suggérez UN ${mealTypeNames[mealType]} délicieux, réaliste et APPROPRIÉ pour ce type de repas.

PRÉFÉRENCES DE L'UTILISATEUR:
- Régime: ${preferences.diet}
- Portions: ${preferences.servings} personnes
- Restrictions: ${preferences.restrictions?.join(', ') || 'aucune'}
- Budget: ${preferences.budget}
- Niveau de cuisine: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ RÈGLES CRITIQUES DE VARIÉTÉ:
- Créer un plat UNIQUE et CRÉATIF, mais RÉALISTE (pas toujours sain)
- S'il n'y a PAS de restrictions alimentaires, vous pouvez suggérer: pâtes, pizza, burgers maison, tacos, schnitzels, riz au poulet, ragoûts, empanadas, etc.
- Si le régime est "normal" ou "équilibré", NE PAS se limiter uniquement aux aliments légers/sains
- Varier la méthode de cuisson: grillé, au four, sauté, à la vapeur, mijoté, frit
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

RÉPONDEZ UNIQUEMENT AVEC JSON:
{
  "name": "Nom du plat",
  "servings": ${preferences.servings},
  "time": "30 min",
  "difficulty": "facile",
  "calories": 450,
  "description": "Description brève et attrayante du plat en 2-3 lignes",
  "instructions": [
    "Étape 1: Action spécifique...",
    "Étape 2: Action suivante...",
    "Étape 3: Cuire et servir..."
  ],
  "ingredients": [
    {"item": "Ingrédient", "quantity": "100", "unit": "g"}
  ]
}`;
  } else if (lang === 'it') {
    return `Sei uno chef professionista. Suggerisci UNA ${mealTypeNames[mealType]} deliziosa, realistica e APPROPRIATA per questo tipo di pasto.

PREFERENZE DELL'UTENTE:
- Dieta: ${preferences.diet}
- Porzioni: ${preferences.servings} persone
- Restrizioni: ${preferences.restrictions?.join(', ') || 'nessuna'}
- Budget: ${preferences.budget}
- Livello di cucina: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ REGOLE CRITICHE DI VARIETÀ:
- Crea un piatto UNICO e CREATIVO, ma REALISTICO (non sempre sano)
- Se NON ci sono restrizioni alimentari, puoi suggerire: pasta, pizza, hamburger fatti in casa, tacos, cotolette, riso con pollo, stufati, empanadas, ecc.
- Se la dieta è "normale" o "equilibrata", NON limitare solo a cibi leggeri/sani
- Variare il metodo di cottura: grigliato, al forno, saltato, al vapore, stufato, fritto
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

RISPONDI SOLO CON JSON:
{
  "name": "Nome del piatto",
  "servings": ${preferences.servings},
  "time": "30 min",
  "difficulty": "facile",
  "calories": 450,
  "description": "Descrizione breve e attraente del piatto in 2-3 righe",
  "instructions": [
    "Passo 1: Azione specifica...",
    "Passo 2: Azione successiva...",
    "Passo 3: Cuocere e servire..."
  ],
  "ingredients": [
    {"item": "Ingrediente", "quantity": "100", "unit": "g"}
  ]
}`;
  } else if (lang === 'pt') {
    return `Você é um chef profissional. Sugira UM ${mealTypeNames[mealType]} delicioso, realista e APROPRIADO para este tipo de refeição.

PREFERÊNCIAS DO USUÁRIO:
- Dieta: ${preferences.diet}
- Porções: ${preferences.servings} pessoas
- Restrições: ${preferences.restrictions?.join(', ') || 'nenhuma'}
- Orçamento: ${preferences.budget}
- Nível de cozinha: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ REGRAS CRÍTICAS DE VARIEDADE:
- Crie um prato ÚNICO e CRIATIVO, mas REALISTA (nem sempre saudável)
- Se NÃO houver restrições alimentares, você pode sugerir: massa, pizza, hambúrgueres caseiros, tacos, bifes empanados, arroz com frango, ensopados, empanadas, etc.
- Se a dieta for "normal" ou "equilibrada", NÃO limitar apenas a comida leve/saudável
- Variar o método de cozimento: grelhado, assado, refogado, no vapor, ensopado, frito
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

RESPONDA APENAS COM JSON:
{
  "name": "Nome do prato",
  "servings": ${preferences.servings},
  "time": "30 min",
  "difficulty": "fácil",
  "calories": 450,
  "description": "Descrição breve e atraente do prato em 2-3 linhas",
  "instructions": [
    "Passo 1: Ação específica...",
    "Passo 2: Próxima ação...",
    "Passo 3: Cozinhar e servir..."
  ],
  "ingredients": [
    {"item": "Ingrediente", "quantity": "100", "unit": "g"}
  ]
}`;
  } else if (lang === 'nl') {
    return `U bent een professionele chef. Stel ÉÉN heerlijk, realistisch ${mealTypeNames[mealType]} voor dat GESCHIKT is voor dit type maaltijd.

GEBRUIKERSVOORKEUREN:
- Dieet: ${preferences.diet}
- Porties: ${preferences.servings} personen
- Beperkingen: ${preferences.restrictions?.join(', ') || 'geen'}
- Budget: ${preferences.budget}
- Kookniveau: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ KRITIEKE VARIETEITREGELS:
- Maak een UNIEK en CREATIEF gerecht, maar REALISTISCH (niet altijd gezond)
- Als er GEEN voedingsbeperkingen zijn, kunt u voorstellen: pasta, pizza, zelfgemaakte burgers, taco's, schnitzels, kiprijst, stoofschotels, empanadas, enz.
- Als het dieet "normaal" of "evenwichtig" is, NIET beperken tot alleen licht/gezond voedsel
- Varieer de bereidingswijze: gegrild, gebakken, gesauteerd, gestoomd, gesmoord, gebakken
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

ANTWOORD ALLEEN MET JSON:
{
  "name": "Gerechtnaam",
  "servings": ${preferences.servings},
  "time": "30 min",
  "difficulty": "makkelijk",
  "calories": 450,
  "description": "Korte en aantrekkelijke beschrijving van het gerecht in 2-3 regels",
  "instructions": [
    "Stap 1: Specifieke actie...",
    "Stap 2: Volgende actie...",
    "Stap 3: Koken en serveren..."
  ],
  "ingredients": [
    {"item": "Ingrediënt", "quantity": "100", "unit": "g"}
  ]
}`;
  } else if (lang === 'ja') {
    return `あなたはプロのシェフです。この食事タイプに適した、美味しくて現実的な${mealTypeNames[mealType]}を1つ提案してください。

ユーザーの好み:
- 食事: ${preferences.diet}
- 人数: ${preferences.servings}人
- 制限: ${preferences.restrictions?.join(', ') || 'なし'}
- 予算: ${preferences.budget}
- 料理レベル: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ 重要なバリエーションルール:
- ユニークで創造的な料理を作成しますが、現実的にしてください（常に健康的である必要はありません）
- 食事制限がない場合は、パスタ、ピザ、自家製バーガー、タコス、シュニッツェル、チキンライス、シチュー、エンパナーダなどを提案できます
- 食事が「普通」または「バランスの取れた」場合、軽い/健康的な食品のみに制限しないでください
- 調理方法を変える: グリル、オーブン、ソテー、蒸し、煮込み、揚げ
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

JSONのみで応答してください:
{
  "name": "料理名",
  "servings": ${preferences.servings},
  "time": "30分",
  "difficulty": "簡単",
  "calories": 450,
  "description": "2-3行で料理の簡潔で魅力的な説明",
  "instructions": [
    "ステップ1: 具体的なアクション...",
    "ステップ2: 次のアクション...",
    "ステップ3: 調理して提供..."
  ],
  "ingredients": [
    {"item": "材料", "quantity": "100", "unit": "g"}
  ]
}`;
  } else if (lang === 'hi') {
    return `आप एक पेशेवर शेफ हैं। इस भोजन प्रकार के लिए उपयुक्त एक स्वादिष्ट, यथार्थवादी ${mealTypeNames[mealType]} सुझाएं।

उपयोगकर्ता की प्राथमिकताएं:
- आहार: ${preferences.diet}
- परोसने की संख्या: ${preferences.servings} लोग
- प्रतिबंध: ${preferences.restrictions?.join(', ') || 'कोई नहीं'}
- बजट: ${preferences.budget}
- खाना पकाने का स्तर: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ महत्वपूर्ण विविधता नियम:
- एक अद्वितीय और रचनात्मक व्यंजन बनाएं, लेकिन यथार्थवादी (हमेशा स्वस्थ नहीं)
- यदि कोई आहार प्रतिबंध नहीं हैं, तो आप सुझा सकते हैं: पास्ता, पिज़्ज़ा, घर का बना बर्गर, टैकोस, श्नित्ज़ेल, चिकन राइस, स्टू, एम्पानाडास, आदि
- यदि आहार "सामान्य" या "संतुलित" है, तो केवल हल्के/स्वस्थ भोजन तक सीमित न करें
- खाना पकाने की विधि में विविधता लाएं: ग्रिल्ड, बेक्ड, सॉटेड, स्टीम्ड, स्टूड, फ्राइड
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

केवल JSON के साथ जवाब दें:
{
  "name": "व्यंजन का नाम",
  "servings": ${preferences.servings},
  "time": "30 मिनट",
  "difficulty": "आसान",
  "calories": 450,
  "description": "2-3 पंक्तियों में व्यंजन का संक्षिप्त और आकर्षक विवरण",
  "instructions": [
    "चरण 1: विशिष्ट क्रिया...",
    "चरण 2: अगली क्रिया...",
    "चरण 3: पकाएं और परोसें..."
  ],
  "ingredients": [
    {"item": "सामग्री", "quantity": "100", "unit": "g"}
  ]
}`;
  } else if (lang === 'tr') {
    return `Siz profesyonel bir şefsiniz. Bu öğün türü için uygun, lezzetli ve gerçekçi BİR ${mealTypeNames[mealType]} önerin.

KULLANICI TERCİHLERİ:
- Diyet: ${preferences.diet}
- Porsiyon: ${preferences.servings} kişi
- Kısıtlamalar: ${preferences.restrictions?.join(', ') || 'yok'}
- Bütçe: ${preferences.budget}
- Yemek pişirme seviyesi: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ KRİTİK ÇEŞİTLİLİK KURALLARI:
- BENZERSİZ ve YARATICI bir yemek oluşturun, ancak GERÇEKÇİ olsun (her zaman sağlıklı değil)
- Diyet kısıtlaması YOKSA, şunları önerebilirsiniz: makarna, pizza, ev yapımı burger, taco, schnitzel, tavuklu pilav, güveç, empanada, vb.
- Diyet "normal" veya "dengeli" ise, sadece hafif/sağlıklı yiyeceklerle SINIRLAMAYIN
- Pişirme yöntemini çeşitlendirin: ızgara, fırın, sote, buğulama, haşlama, kızartma
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

SADECE JSON İLE YANITLAYIN:
{
  "name": "Yemek adı",
  "servings": ${preferences.servings},
  "time": "30 dakika",
  "difficulty": "kolay",
  "calories": 450,
  "description": "2-3 satırda yemeğin kısa ve çekici açıklaması",
  "instructions": [
    "Adım 1: Belirli eylem...",
    "Adım 2: Sonraki eylem...",
    "Adım 3: Pişirin ve servis yapın..."
  ],
  "ingredients": [
    {"item": "Malzeme", "quantity": "100", "unit": "g"}
  ]
}`;
  } else {
    return `Eres un chef profesional. Sugiere UN ${mealTypeNames[mealType]} delicioso, realista y APROPIADO para este tipo de comida.

PREFERENCIAS DEL USUARIO:
- Dieta: ${preferences.diet}
- Porciones: ${preferences.servings} personas
- Restricciones: ${preferences.restrictions?.join(', ') || 'ninguna'}
- Presupuesto: ${preferences.budget}
- Nivel de cocina: ${preferences.cookingLevel}${calorieLimit}${seasonalInfo}

${mealTypeRules[mealType]}

⚠️ REGLAS CRÍTICAS DE VARIEDAD:
- Crear un plato ÚNICO y CREATIVO, pero REALISTA (no siempre healthy)
- Si NO hay restricciones dietéticas, puedes sugerir: pasta, pizza, hamburguesas caseras, tacos, milanesas, arroz con pollo, guisos, empanadas, etc.
- Si la dieta es "normal" o "balanced", NO limitar solo a comida light/healthy
- Variar método de cocción: grillado, al horno, salteado, al vapor, estofado, frito
${cuisineRule}${proteinRestrictions}${dishRestrictions}${weeklyDishRestrictions}${dietaryRestrictions}

RESPONDE SOLO CON JSON:
{
  "name": "Nombre del plato",
  "servings": ${preferences.servings},
  "time": "30 min",
  "difficulty": "fácil",
  "calories": 450,
  "description": "Descripción breve y atractiva del plato en 2-3 líneas",
  "instructions": [
    "Paso 1: Acción específica...",
    "Paso 2: Siguiente acción...",
    "Paso 3: Cocinar y servir..."
  ],
  "ingredients": [
    {"item": "Ingrediente", "quantity": "100", "unit": "g"}
  ]
}`;
  }
};

// ============================================
// 2️⃣ PROMPT: DÍA COMPLETO (breakfast + lunch + dinner)
// ============================================

export const PROMPT_DIA_COMPLETO = (preferences, context = {}) => {
  const {
    country = '',
    currentMonth = '',
    currentSeason = ''
  } = context;

  // Productos de temporada
  let seasonalInfo = '';
  if (preferences.seasonalProducts && country) {
    seasonalInfo = `\n- Productos de temporada: Sí (${country}, ${currentMonth}, ${currentSeason})`;
  }

  // Restricciones alimentarias
  let dietaryRestrictions = '';
  const allRestrictions = [...(preferences.restrictions || [])];

  // ✅ Agregar restricciones personalizadas
  if (preferences.customRestrictions && Array.isArray(preferences.customRestrictions)) {
    allRestrictions.push(...preferences.customRestrictions);
  }

  if (allRestrictions.length > 0) {
    dietaryRestrictions = `\n\n❌ RESTRICCIONES ALIMENTARIAS (NO INCLUIR NUNCA): ${allRestrictions.join(', ')}`;
  }

  // Calorías máximas
  let calorieLimit = '';
  if (preferences.maxCaloriesEnabled && preferences.maxCalories) {
    calorieLimit = `\n- Máximo de calorías por comida: ${preferences.maxCalories} kcal`;
  }

  // Ayuno intermitente
  let intermittentFasting = '';
  if (preferences.intermittentFasting) {
    intermittentFasting = '\n- Ayuno intermitente: Sí (ventanas de alimentación reducidas, 2 comidas principales)';
  }

  return `Eres un nutricionista experto. Genera un menú COMPLETO para UN DÍA con desayuno, almuerzo y cena.

PREFERENCIAS DEL USUARIO:
- Dieta: ${preferences.diet}
- Porciones: ${preferences.servings} personas
- Restricciones: ${preferences.restrictions?.join(', ') || 'ninguna'}
- Presupuesto: ${preferences.budget}
- Nivel de cocina: ${preferences.cookingLevel}${calorieLimit}${intermittentFasting}${seasonalInfo}

🌅 DESAYUNOS - Platos típicos de desayuno:
- Huevos (revueltos, tortilla, poché, fritos), avena, yogurt, frutas, pan tostado, cereales, batidos, smoothies, tortitas, waffles, croissants
- ❌ NO tacos, NO hamburguesas, NO pasta, NO pizza para desayuno

☀️ ALMUERZOS - Platos completos:
- Proteína + carbohidrato + vegetales
- Ejemplos: ensaladas completas, arroces, pastas, guisos, carnes a la plancha, pescados, bowls, wraps

🌙 CENAS - Platos ligeros:
- Preferir: pescados, ensaladas con proteína, sopas, verduras al horno, huevos, tofu
- Evitar comidas pesadas o grasosas

⚠️ REGLAS CRÍTICAS:
- NO repetir proteína en el mismo día (si lunch tiene pollo, dinner debe tener pescado/carne/huevos/tofu)
- NO repetir tipo de plato (si lunch tiene tacos, dinner NO puede tener tacos)
- Variar métodos de cocción: parrilla, horno, vapor, salteado, estofado
- Variar cocinas: mediterránea, asiática, mexicana, peruana, italiana, japonesa${dietaryRestrictions}

RESPONDE SOLO CON JSON:
{
  "breakfast": {
    "name": "Nombre del plato",
    "servings": ${preferences.servings},
    "time": "15 min",
    "ingredients": [
      {"item": "Ingrediente", "quantity": "100", "unit": "g"}
    ]
  },
  "lunch": {
    "name": "Nombre del plato",
    "servings": ${preferences.servings},
    "time": "30 min",
    "ingredients": [
      {"item": "Ingrediente", "quantity": "100", "unit": "g"}
    ]
  },
  "dinner": {
    "name": "Nombre del plato",
    "servings": ${preferences.servings},
    "time": "30 min",
    "ingredients": [
      {"item": "Ingrediente", "quantity": "100", "unit": "g"}
    ]
  }
}`;
};

// ============================================
// 3️⃣ PROMPT: MENÚ SEMANAL COMPLETO (7 días)
// ============================================

export const PROMPT_MENU_SEMANAL = (preferences, context = {}) => {
  const {
    country = '',
    currentMonth = '',
    currentSeason = ''
  } = context;

  // Productos de temporada
  let seasonalInfo = '';
  if (preferences.seasonalProducts && country) {
    seasonalInfo = `\n- Productos de temporada: Sí (${country}, ${currentMonth}, ${currentSeason})`;
  }

  // Restricciones alimentarias
  let dietaryRestrictions = '';
  const allRestrictions = [...(preferences.restrictions || [])];

  // ✅ Agregar restricciones personalizadas
  if (preferences.customRestrictions && Array.isArray(preferences.customRestrictions)) {
    allRestrictions.push(...preferences.customRestrictions);
  }

  if (allRestrictions.length > 0) {
    dietaryRestrictions = `\n\n❌ RESTRICCIONES ALIMENTARIAS (NO INCLUIR NUNCA): ${allRestrictions.join(', ')}`;
  }

  // Calorías máximas
  let calorieLimit = '';
  if (preferences.maxCaloriesEnabled && preferences.maxCalories) {
    calorieLimit = `\n- Máximo de calorías por comida: ${preferences.maxCalories} kcal`;
  }

  // Ayuno intermitente
  let intermittentFasting = '';
  if (preferences.intermittentFasting) {
    intermittentFasting = '\n- Ayuno intermitente: Sí (ventanas de alimentación reducidas, 2 comidas principales)';
  }

  return `Eres un nutricionista experto. Genera un menú semanal balanceado, variado y APROPIADO para cada tipo de comida.

PREFERENCIAS DEL USUARIO:
- Dieta: ${preferences.diet}
- Porciones: ${preferences.servings} personas
- Restricciones: ${preferences.restrictions?.join(', ') || 'ninguna'}
- Presupuesto: ${preferences.budget}
- Nivel de cocina: ${preferences.cookingLevel}${calorieLimit}${intermittentFasting}${seasonalInfo}

Genera 7 días (lunes a domingo) con desayuno, almuerzo y cena.

🌅 DESAYUNOS - Platos típicos de desayuno:
- Huevos (revueltos, tortilla, poché, fritos), avena, yogurt, frutas, pan tostado, cereales, batidos, smoothies, tortitas, waffles, croissants, tostadas francesas
- ❌ NO tacos, NO hamburguesas, NO pasta, NO pizza para desayuno

☀️ ALMUERZOS - Platos completos y nutritivos:
- Proteína + carbohidrato + vegetales
- Ejemplos: ensaladas completas, arroces, pastas, guisos, carnes a la plancha, pescados, bowls, wraps, sopas abundantes

🌙 CENAS - Platos ligeros y fáciles de digerir:
- Preferir: pescados, ensaladas con proteína, sopas, verduras al horno, huevos, tofu
- Evitar comidas pesadas o grasosas

REQUISITOS:
- Variedad de ingredientes (no repetir platos)
- Balance nutricional
- Ingredientes de temporada
- Recetas prácticas y realistas
- Tiempos de preparación razonables

REGLAS CRÍTICAS PARA VARIEDAD:
- NO repetir ninguna proteína principal en el mismo día (si almuerzo tiene pollo, cena debe tener pescado, carne, cerdo, legumbres, huevos u otra proteína)
- NO usar pollo más de 2 veces en toda la semana
- NO usar salmón o pescado más de 2 veces en toda la semana
- DEBE incluir al menos: 1-2 comidas de carne roja/ternera, 1-2 comidas de cerdo, 2-3 comidas de pescado (variar: atún, bacalao, lubina, etc.), 2 comidas vegetarianas/legumbres, 1-2 comidas con huevos, 1-2 comidas de pollo
- DEBE variar métodos de cocción: a la parrilla, al horno, al vapor, salteado, asado, sellado, estofado
- DEBE variar cocinas: mediterránea, asiática, latinoamericana, medio oriente, europea
- Para pasta: variar tipos (espaguetis, penne, lasaña, raviolis) y salsas (tomate, nata, pesto, carbonara, boloñesa)
- Para ensaladas: variar bases (lechuga, espinaca, rúcula, quinoa) y siempre incluir proteína
- Incluir platos diversos: guisos, cazuelas, sopas, parrillas, salteados, currys, tacos, bowls

⚠️ REGLAS ADICIONALES CRÍTICAS:
- NO repetir el mismo TIPO de plato en el mismo día (si lunch tiene tacos, dinner NO puede tener tacos)
- NO usar la misma proteína en 2 comidas del mismo día
- Máximo 2 desayunos con huevos por semana
- Máximo 1 desayuno con salmón por semana${dietaryRestrictions}

RESPONDE SOLO CON UN OBJETO JSON VÁLIDO, SIN TEXTO ADICIONAL:

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
}`;
};

// ============================================
// ROLES DEL SISTEMA
// ============================================

export const SYSTEM_ROLE_CHEF = 'Eres un chef profesional que sugiere comidas en formato JSON.';

export const SYSTEM_ROLE_NUTRITIONIST = 'Eres un nutricionista experto que genera menús semanales en formato JSON.';

export default {
  PROMPT_COMIDA_INDIVIDUAL,
  PROMPT_DIA_COMPLETO,
  PROMPT_MENU_SEMANAL,
  SYSTEM_ROLE_CHEF,
  SYSTEM_ROLE_NUTRITIONIST
};
