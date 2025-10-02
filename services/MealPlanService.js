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
${t.req5}`;

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
  async suggestMeal(mealType, preferences) {
    try {
      // Obtener idioma del dispositivo
      const RNLocalize = require('react-native-localize');
      const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
      const t = promptTranslations[deviceLanguage] || promptTranslations['en'];

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
- ${t.restrictions}: ${preferences.restrictions?.join(', ') || t.none}${preferences.maxCaloriesEnabled && preferences.maxCalories ? `\n- ${t.maxCalories}: ${preferences.maxCalories} kcal` : ''}${preferences.seasonalProducts && country ? `\n- ${t.seasonalProducts} ${country} ${deviceLanguage === 'es' ? 'en' : 'in'} ${currentMonth} (${currentSeason})` : ''}

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
        model: 'gpt-4.1',
        max_tokens: 500,
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
