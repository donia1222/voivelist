const imageListScreenTranslations = {
  en: {
    // UI Labels
    creatingList: "Creating list",
    analyzingImage: "Analyzing your image...",
    uploadImage: "Upload an image",
    uploadImageDescription: "Take a photo or select an image of your shopping list to analyze it automatically",
    saveList: "Save List",
    listSaved: "List Saved!",
    selectCountry: "Select Country",
    cityNamePlaceholder: "Enter city or country name",
    viewCost: "View cost in",
    subscriptionRequired: "Subscription Required",
    costOfList: "Cost of list",
    imageListPrefix: "Image List",
    
    // Modal Texts
    modalTitle: "Select or take a photo of your shopping list",
    gallery: "Select from gallery", 
    takePhoto: "Take a photo",
    cancel: "Cancel",
    
    // Subscription Texts
    subscribeToAnalyze: "Subscribe to analyze shopping lists",
    
    // Alert Messages
    subscriptionMessage: "You must be subscribed to calculate the estimated cost.",
    subscribe: "Subscribe",
    error: "Error",
    enterCountry: "Please enter a country.",
    couldNotFetchCost: "Could not fetch the estimated cost.",
    noValidAnalysis: "No valid analysis received.",
    couldNotAnalyze: "Could not analyze the image.",
    errorLoadingCountry: "Error loading country: ",
    errorSavingCountry: "Error saving country: ",
    errorSavingList: "Error saving shopping list: ",
    errorSavingHistory: "Error saving to history: ",
    failedCameraPermission: "Failed to request camera permission",
    failedGalleryPermission: "Failed to request gallery permission",
    errorAnalyzingImage: "Error analyzing the image: ",
    errorGettingCustomerInfo: "Error getting customer information:",
    
    // System Prompts
    analyzePrompt: "You are a helpful assistant that analyzes images of shopping lists. Respond in English and do not comment on anything, just add the items seen in the shopping list, and if the image does not contain items to generate a list, always look for the texts to make a list, if it is in another language, translate the products to the language you are asked.",
    costEstimatePrompt: "You are an assistant that calculates the estimated cost of a shopping list in ${country}. Respond with the total cost.",
  },
  es: {
    // UI Labels
    creatingList: "Creando lista",
    analyzingImage: "Analizando tu imagen...",
    uploadImage: "Sube una imagen",
    uploadImageDescription: "Toma una foto o selecciona una imagen de tu lista de compras para analizarla automáticamente",
    saveList: "Guardar Lista",
    listSaved: "¡Lista Guardada!",
    selectCountry: "Seleccionar País",
    cityNamePlaceholder: "Ingresa el nombre de la ciudad o país",
    viewCost: "Ver costo en",
    subscriptionRequired: "Suscripción Requerida",
    costOfList: "Costo de la lista",
    imageListPrefix: "Lista por Imagen",
    
    // Modal Texts
    modalTitle: "Seleccionar o tomar una foto de tu lista de compras",
    gallery: "Seleccionar de la galería",
    takePhoto: "Tomar una foto", 
    cancel: "Cancelar",
    
    // Subscription Texts
    subscribeToAnalyze: "Suscríbete para poder analizar listas de compras",
    
    // Alert Messages
    subscriptionMessage: "Debes estar suscrito para calcular el costo estimado.",
    subscribe: "Suscribirse",
    error: "Error",
    enterCountry: "Por favor ingresa un país.",
    couldNotFetchCost: "No se pudo obtener el costo estimado.",
    noValidAnalysis: "No se recibió un análisis válido.",
    couldNotAnalyze: "No se pudo analizar la imagen.",
    errorLoadingCountry: "Error al cargar el país: ",
    errorSavingCountry: "Error al guardar el país: ",
    errorSavingList: "Error al guardar la lista de compras: ",
    errorSavingHistory: "Error al guardar en el historial: ",
    failedCameraPermission: "Error al solicitar permiso de cámara",
    failedGalleryPermission: "Error al solicitar permiso de galería",
    errorAnalyzingImage: "Error al analizar la imagen: ",
    errorGettingCustomerInfo: "Error al obtener la información del comprador:",
    
    // System Prompts
    analyzePrompt: "Eres un asistente útil que analiza imágenes de listas de compras. Responde en español y no comentes nada, solo añade los ítems vistos en la lista de la compra, y si la imagen no contiene ítems para generar una lista, busca siempre los textos para hacer una lista, si está en otro idioma traduce los productos al idioma que se te ha preguntado.",
    costEstimatePrompt: "Eres un asistente que calcula el costo estimado de una lista de compras en ${country}. Responde siempre con el costo total o aproximado.",
  },
  de: {
    // UI Labels  
    creatingList: "Liste wird erstellt",
    analyzingImage: "Bild wird analysiert...",
    uploadImage: "Bild hochladen",
    uploadImageDescription: "Mache ein Foto oder wähle ein Bild deiner Einkaufsliste, um es automatisch zu analysieren",
    saveList: "Liste speichern",
    listSaved: "Liste gespeichert!",
    selectCountry: "Land auswählen",
    cityNamePlaceholder: "Stadt- oder Landesname eingeben",
    viewCost: "Kosten anzeigen in",
    subscriptionRequired: "Abonnement erforderlich",
    costOfList: "Kosten der Liste",
    imageListPrefix: "Bildliste",
    
    // Modal Texts
    modalTitle: "Wähle oder mache ein Foto deiner Einkaufsliste",
    gallery: "Aus der Galerie auswählen",
    takePhoto: "Ein Foto machen",
    cancel: "Abbrechen",
    
    // Subscription Texts
    subscribeToAnalyze: "Abonniere, um Einkaufslisten zu analysieren",
    
    // Alert Messages
    subscriptionMessage: "Du musst abonniert sein, um die geschätzten Kosten zu berechnen.",
    subscribe: "Abonnieren",
    error: "Fehler",
    enterCountry: "Bitte gib ein Land ein.",
    couldNotFetchCost: "Geschätzte Kosten konnten nicht abgerufen werden.",
    noValidAnalysis: "Keine gültige Analyse erhalten.",
    couldNotAnalyze: "Bild konnte nicht analysiert werden.",
    errorLoadingCountry: "Fehler beim Laden des Landes: ",
    errorSavingCountry: "Fehler beim Speichern des Landes: ",
    errorSavingList: "Fehler beim Speichern der Einkaufsliste: ",
    errorSavingHistory: "Fehler beim Speichern im Verlauf: ",
    failedCameraPermission: "Kameraberechtigung konnte nicht angefordert werden",
    failedGalleryPermission: "Galerieberechtigung konnte nicht angefordert werden",
    errorAnalyzingImage: "Fehler beim Analysieren des Bildes: ",
    errorGettingCustomerInfo: "Fehler beim Abrufen der Kundendaten:",
    
    // System Prompts
    analyzePrompt: "Du bist ein hilfreicher Assistent, der Bilder von Einkaufslisten analysiert. Antworte auf Deutsch und kommentiere nichts, füge nur die Artikel hinzu, die in der Einkaufsliste zu sehen sind. Wenn das Bild keine Artikel enthält, suche immer nach Texten, um eine Liste zu erstellen. Wenn sie in einer anderen Sprache sind, übersetze die Produkte in die angeforderte Sprache.",
    costEstimatePrompt: "Du bist ein Assistent, der die geschätzten Kosten einer Einkaufsliste in ${country} berechnet. Antworte mit den Gesamtkosten.",
  },
  it: {
    // UI Labels
    creatingList: "Creazione della lista",
    analyzingImage: "Analisi dell'immagine...",
    uploadImage: "Carica un'immagine",
    uploadImageDescription: "Scatta una foto o seleziona un'immagine della tua lista della spesa per analizzarla automaticamente",
    saveList: "Salva Lista",
    listSaved: "Lista Salvata!",
    selectCountry: "Seleziona Paese",
    cityNamePlaceholder: "Inserisci il nome della città o del paese",
    viewCost: "Visualizza costo in",
    subscriptionRequired: "Abbonamento Richiesto",
    costOfList: "Costo della lista",
    imageListPrefix: "Lista Immagine",
    
    // Modal Texts
    modalTitle: "Seleziona o scatta una foto della tua lista della spesa",
    gallery: "Seleziona dalla galleria",
    takePhoto: "Scatta una foto",
    cancel: "Annulla",
    
    // Subscription Texts
    subscribeToAnalyze: "Iscriviti per analizzare le liste della spesa",
    
    // Alert Messages
    subscriptionMessage: "Devi essere abbonato per calcolare il costo stimato.",
    subscribe: "Abbonati",
    error: "Errore",
    enterCountry: "Inserisci un paese.",
    couldNotFetchCost: "Impossibile recuperare il costo stimato.",
    noValidAnalysis: "Nessuna analisi valida ricevuta.",
    couldNotAnalyze: "Impossibile analizzare l'immagine.",
    errorLoadingCountry: "Errore nel caricamento del paese: ",
    errorSavingCountry: "Errore nel salvataggio del paese: ",
    errorSavingList: "Errore nel salvataggio della lista della spesa: ",
    errorSavingHistory: "Errore nel salvataggio nella cronologia: ",
    failedCameraPermission: "Richiesta di autorizzazione alla fotocamera non riuscita",
    failedGalleryPermission: "Richiesta di autorizzazione alla galleria non riuscita",
    errorAnalyzingImage: "Errore nell'analisi dell'immagine: ",
    errorGettingCustomerInfo: "Errore nel recupero delle informazioni del cliente:",
    
    // System Prompts
    analyzePrompt: "Sei un assistente utile che analizza immagini di liste della spesa. Rispondi in italiano e non fare commenti, aggiungi solo gli articoli presenti nella lista della spesa. Se l'immagine non contiene articoli per generare una lista, cerca sempre i testi per farne una. Se sono in un'altra lingua, traduci i prodotti nella lingua richiesta.",
    costEstimatePrompt: "Sei un assistente che calcola il costo stimato di una lista della spesa in ${country}. Rispondi con il costo totale.",
  },
  fr: {
    // UI Labels
    creatingList: "Création de la liste",
    analyzingImage: "Analyse de votre image...",
    uploadImage: "Téléverser une image",
    uploadImageDescription: "Prenez une photo ou sélectionnez une image de votre liste de courses pour l'analyser automatiquement",
    saveList: "Enregistrer la liste",
    listSaved: "Liste enregistrée !",
    selectCountry: "Sélectionner un pays",
    cityNamePlaceholder: "Entrez le nom de la ville ou du pays",
    viewCost: "Voir le coût en",
    subscriptionRequired: "Abonnement requis",
    costOfList: "Coût de la liste",
    imageListPrefix: "Liste d'image",
    
    // Modal Texts
    modalTitle: "Sélectionner ou prendre une photo de votre liste de courses",
    gallery: "Choisir depuis la galerie",
    takePhoto: "Prendre une photo",
    cancel: "Annuler",
    
    // Subscription Texts
    subscribeToAnalyze: "Abonne-toi pour analyser des listes de courses",
    
    // Alert Messages
    subscriptionMessage: "Vous devez être abonné pour calculer le coût estimé.",
    subscribe: "S'abonner",
    error: "Erreur",
    enterCountry: "Veuillez entrer un pays.",
    couldNotFetchCost: "Impossible d'obtenir le coût estimé.",
    noValidAnalysis: "Aucune analyse valide reçue.",
    couldNotAnalyze: "Impossible d'analyser l'image.",
    errorLoadingCountry: "Erreur lors du chargement du pays : ",
    errorSavingCountry: "Erreur lors de l'enregistrement du pays : ",
    errorSavingList: "Erreur lors de l'enregistrement de la liste de courses : ",
    errorSavingHistory: "Erreur lors de l'enregistrement de l'historique : ",
    failedCameraPermission: "Échec de la demande d'autorisation de la caméra",
    failedGalleryPermission: "Échec de la demande d'autorisation de la galerie",
    errorAnalyzingImage: "Erreur lors de l'analyse de l'image : ",
    errorGettingCustomerInfo: "Erreur lors de la récupération des informations du client :",
    
    // System Prompts
    analyzePrompt: "Tu es un assistant utile qui analyse des images de listes de courses. Réponds en français sans faire de commentaires, ajoute simplement les articles vus sur la liste de courses. Si l'image ne contient pas d'articles pour générer une liste, cherche toujours les textes pour en créer une. S'ils sont dans une autre langue, traduis les produits dans la langue demandée.",
    costEstimatePrompt: "Tu es un assistant qui calcule le coût estimé d'une liste de courses en ${country}. Réponds avec le coût total.",
  },
  tr: {
    // UI Labels
    creatingList: "Liste oluşturuluyor",
    analyzingImage: "Resminiz analiz ediliyor...",
    uploadImage: "Bir resim yükle",
    uploadImageDescription: "Alışveriş listenizin bir fotoğrafını çekin veya seçin, otomatik olarak analiz edelim",
    saveList: "Liste Kaydet",
    listSaved: "Liste Kaydedildi!",
    selectCountry: "Ülke Seç",
    cityNamePlaceholder: "Şehir veya ülke adını girin",
    viewCost: "Maliyeti görüntüle",
    subscriptionRequired: "Abonelik Gerekli",
    costOfList: "Listenin maliyeti",
    imageListPrefix: "Resim Listesi",
    
    // Modal Texts
    modalTitle: "Alışveriş listenin fotoğrafını seç veya çek",
    gallery: "Galeriden seç",
    takePhoto: "Fotoğraf çek",
    cancel: "İptal",
    
    // Subscription Texts  
    subscribeToAnalyze: "Alışveriş listelerini analiz etmek için abone ol",
    
    // Alert Messages
    subscriptionMessage: "Tahmini maliyeti hesaplamak için abone olmalısınız.",
    subscribe: "Abone Ol",
    error: "Hata",
    enterCountry: "Lütfen bir ülke girin.",
    couldNotFetchCost: "Tahmini maliyet alınamadı.",
    noValidAnalysis: "Geçerli analiz alınamadı.",
    couldNotAnalyze: "Görüntü analiz edilemedi.",
    errorLoadingCountry: "Ülke yüklenirken hata: ",
    errorSavingCountry: "Ülke kaydedilirken hata: ",
    errorSavingList: "Alışveriş listesi kaydedilirken hata: ",
    errorSavingHistory: "Geçmişe kaydedilirken hata: ",
    failedCameraPermission: "Kamera izni istenemedi",
    failedGalleryPermission: "Galeri izni istenemedi", 
    errorAnalyzingImage: "Görüntü analiz edilirken hata: ",
    errorGettingCustomerInfo: "Müşteri bilgileri alınırken hata:",
    
    // System Prompts
    analyzePrompt: "Sen, alışveriş listesi görüntülerini analiz eden yardımcı bir asistansın. Türkçe yanıt ver ve hiçbir yorum yapma, sadece alışveriş listesinde görülen ürünleri ekle. Görüntüde liste oluşturacak ürünler yoksa, her zaman metinleri ara ve bir liste oluştur. Eğer metin başka bir dildeyse, ürünleri istenilen dile çevir.",
    costEstimatePrompt: "${country} ülkesindeki bir alışveriş listesinin tahmini maliyetini hesaplayan bir asistansın. Toplam maliyeti belirterek yanıt ver.",
  },
  ptru: {
    // UI Labels
    creatingList: "Criando lista",
    analyzingImage: "Analisando sua imagem...",
    uploadImage: "Carregar uma imagem",
    uploadImageDescription: "Tire uma foto ou selecione uma imagem da sua lista de compras para analisá-la automaticamente",
    saveList: "Salvar Lista",
    listSaved: "Lista Salva!",
    selectCountry: "Selecionar País",
    cityNamePlaceholder: "Digite o nome da cidade ou país",
    viewCost: "Ver custo em",
    subscriptionRequired: "Assinatura Necessária",
    costOfList: "Custo da lista",
    imageListPrefix: "Lista por Imagem",
    
    // Modal Texts
    modalTitle: "Selecione ou tire uma foto da sua lista de compras",
    gallery: "Selecionar da galeria",
    takePhoto: "Tirar uma foto",
    cancel: "Cancelar",
    
    // Subscription Texts
    subscribeToAnalyze: "Assine para analisar listas de compras",
    
    // Alert Messages
    subscriptionMessage: "Você precisa estar assinado para calcular o custo estimado.",
    subscribe: "Assinar",
    error: "Erro",
    enterCountry: "Por favor, insira um país.",
    couldNotFetchCost: "Não foi possível obter o custo estimado.",
    noValidAnalysis: "Nenhuma análise válida recebida.",
    couldNotAnalyze: "Não foi possível analisar a imagem.",
    errorLoadingCountry: "Erro ao carregar o país: ",
    errorSavingCountry: "Erro ao salvar o país: ",
    errorSavingList: "Erro ao salvar a lista de compras: ",
    errorSavingHistory: "Erro ao salvar no histórico: ",
    failedCameraPermission: "Falha ao solicitar permissão da câmera",
    failedGalleryPermission: "Falha ao solicitar permissão da galeria",
    errorAnalyzingImage: "Erro ao analisar a imagem: ",
    errorGettingCustomerInfo: "Erro ao obter informações do cliente:",
    
    // System Prompts
    analyzePrompt: "Você é um assistente útil que analiza imagens de listas de compras. Responda em português e não comente nada, apenas adicione os itens vistos na lista de compras. Se a imagem não contiver itens para gerar uma lista, sempre procure os textos para criar uma. Se estiver em outro idioma, traduza os produtos para o idioma solicitado.",
    costEstimatePrompt: "Você é um assistente que calcula o custo estimado de uma lista de compras em ${country}. Responda com o custo total.",
  },
  arhu: {
    // UI Labels
    creatingList: "إنشاء القائمة",
    analyzingImage: "تحليل صورتك...",
    uploadImage: "رفع صورة",
    uploadImageDescription: "التقط صورة أو اختر صورة لقائمة التسوق الخاصة بك لتحليلها تلقائياً",
    saveList: "حفظ القائمة",
    listSaved: "تم حفظ القائمة!",
    selectCountry: "اختر البلد",
    cityNamePlaceholder: "أدخل اسم المدينة أو البلد",
    viewCost: "عرض التكلفة في",
    subscriptionRequired: "الاشتراك مطلوب",
    costOfList: "تكلفة القائمة",
    imageListPrefix: "قائمة الصورة",
    
    // Modal Texts
    modalTitle: "اختر أو التقط صورة لقائمة التسوق الخاصة بك",
    gallery: "اختر من المعرض",
    takePhoto: "التقط صورة",
    cancel: "إلغاء",
    
    // Subscription Texts
    subscribeToAnalyze: "اشترك لتحليل قوائم التسوق",
    
    // Alert Messages
    subscriptionMessage: "يجب أن تكون مشتركًا لحساب التكلفة التقديرية.",
    subscribe: "اشترك",
    error: "خطأ",
    enterCountry: "يرجى إدخال دولة.",
    couldNotFetchCost: "تعذر الحصول على التكلفة التقديرية.",
    noValidAnalysis: "لم يتم استلام تحليل صالح.",
    couldNotAnalyze: "تعذر تحليل الصورة.",
    errorLoadingCountry: "خطأ في تحميل الدولة: ",
    errorSavingCountry: "خطأ في حفظ الدولة: ",
    errorSavingList: "خطأ في حفظ قائمة التسوق: ",
    errorSavingHistory: "خطأ في الحفظ في السجل: ",
    failedCameraPermission: "فشل في طلب إذن الكاميرا",
    failedGalleryPermission: "فشل في طلب إذن المعرض",
    errorAnalyzingImage: "خطأ في تحليل الصورة: ",
    errorGettingCustomerInfo: "خطأ في الحصول على معلومات العميل:",
    
    // System Prompts
    analyzePrompt: "أنت مساعد مفيد يحلل صور قوائم التسوق. أجب باللغة العربية ولا تعلق على أي شيء، فقط أضف العناصر الموجودة في قائمة التسوق. إذا لم تحتوي الصورة على عناصر لإنشاء قائمة، فابحث دائمًا عن النصوص لإنشاء قائمة. إذا كانت بلغة أخرى، ترجم المنتجات إلى اللغة المطلوبة.",
    costEstimatePrompt: "أنت مساعد يحسب التكلفة التقديرية لقائمة التسوق في ${country}. أجب بالتكلفة الإجمالية.",
  },
  jahi: {
    // UI Labels
    creatingList: "リストを作成中",
    analyzingImage: "画像を分析しています...",
    uploadImage: "画像をアップロード",
    uploadImageDescription: "買い物リストの写真を撮るか選択して、自動的に分析します",
    saveList: "リストを保存",
    listSaved: "リストが保存されました!",
    selectCountry: "国を選択",
    cityNamePlaceholder: "都市または国名を入力",
    viewCost: "コストを表示",
    subscriptionRequired: "サブスクリプションが必要です",
    costOfList: "リストのコスト",
    imageListPrefix: "画像リスト",
    
    // Modal Texts
    modalTitle: "買い物リストの写真を選択または撮影してください",
    gallery: "ギャラリーから選択",
    takePhoto: "写真を撮る",
    cancel: "キャンセル",
    
    // Subscription Texts
    subscribeToAnalyze: "買い物リストを分析するには購読してください",
    
    // Alert Messages
    subscriptionMessage: "推定費用を計算するにはサブスクリプションが必要です。",
    subscribe: "購読する",
    error: "エラー",
    enterCountry: "国名を入力してください。",
    couldNotFetchCost: "推定費用を取得できませんでした。",
    noValidAnalysis: "有効な分析が受信されませんでした。",
    couldNotAnalyze: "画像を分析できませんでした。",
    errorLoadingCountry: "国の読み込みエラー: ",
    errorSavingCountry: "国の保存エラー: ",
    errorSavingList: "買い物リストの保存エラー: ",
    errorSavingHistory: "履歴の保存エラー: ",
    failedCameraPermission: "カメラの許可リクエストに失敗しました",
    failedGalleryPermission: "ギャラリーの許可リクエストに失敗しました",
    errorAnalyzingImage: "画像の分析エラー: ",
    errorGettingCustomerInfo: "顧客情報の取得エラー:",
    
    // System Prompts
    analyzePrompt: "あなたは買い物リストの画像を分析する有能なアシスタントです。日本語で回答し、コメントは一切せず、買い物リストに表示されている商品を追加してください。画像にリストを生成する商品が含まれていない場合は、常にテキストを探してリストを作成してください。別の言語で書かれている場合は、求められた言語に翻訳してください。",
    costEstimatePrompt: "あなたは${country}における買い物リストの推定費用を計算するアシスタントです。合計金額を答えてください。",
  },
  nl: {
    // UI Labels
    creatingList: "Lijst maken",
    analyzingImage: "Je afbeelding analyseren...",
    uploadImage: "Een afbeelding uploaden",
    uploadImageDescription: "Maak een foto of selecteer een afbeelding van je boodschappenlijst om deze automatisch te analyseren",
    saveList: "Lijst opslaan",
    listSaved: "Lijst opgeslagen!",
    selectCountry: "Land selecteren",
    cityNamePlaceholder: "Voer stad- of landnaam in",
    viewCost: "Kosten bekijken in",
    subscriptionRequired: "Abonnement vereist",
    costOfList: "Kosten van lijst",
    imageListPrefix: "Afbeelding Lijst",
    
    // Modal Texts
    modalTitle: "Selecteer of maak een foto van je boodschappenlijst",
    gallery: "Selecteren uit galerij",
    takePhoto: "Een foto maken",
    cancel: "Annuleren",
    
    // Subscription Texts
    subscribeToAnalyze: "Abonneer je om boodschappenlijsten te analyseren",
    
    // Alert Messages
    subscriptionMessage: "Je moet een abonnement hebben om de geschatte kosten te berekenen.",
    subscribe: "Abonneren",
    error: "Fout",
    enterCountry: "Voer een land in.",
    couldNotFetchCost: "Kon de geschatte kosten niet ophalen.",
    noValidAnalysis: "Geen geldige analyse ontvangen.",
    couldNotAnalyze: "Afbeelding kon niet worden geanalyseerd.",
    errorLoadingCountry: "Fout bij laden van land: ",
    errorSavingCountry: "Fout bij opslaan van land: ",
    errorSavingList: "Fout bij opslaan van boodschappenlijst: ",
    errorSavingHistory: "Fout bij opslaan in geschiedenis: ",
    failedCameraPermission: "Kon geen cameratoestemming aanvragen",
    failedGalleryPermission: "Kon geen galerijtoestemming aanvragen",
    errorAnalyzingImage: "Fout bij analyseren van afbeelding: ",
    errorGettingCustomerInfo: "Fout bij ophalen van klantinformatie:",
    
    // System Prompts
    analyzePrompt: "Je bent een behulpzame assistent die afbeeldingen van boodschappenlijsten analyseert. Antwoord in het Nederlands en geef geen commentaar, voeg alleen de items toe die op de boodschappenlijst staan. Als de afbeelding geen items bevat om een lijst te genereren, zoek dan altijd naar teksten om een lijst te maken. Als deze in een andere taal zijn, vertaal de producten naar de gevraagde taal.",
    costEstimatePrompt: "Je bent een assistent die de geschatte kosten van een boodschappenlijst in ${country} berekent. Antwoord met de totale kosten.",
  },
  hu: {
    // UI Labels
    creatingList: "Lista létrehozása",
    analyzingImage: "Kép elemzése...",
    uploadImage: "Kép feltöltése",
    uploadImageDescription: "Készítsen egy fényképet vagy válasszon egy képet a bevásárlólistájáról az automatikus elemzéshez",
    saveList: "Lista mentése",
    listSaved: "Lista elmentve!",
    selectCountry: "Ország kiválasztása",
    cityNamePlaceholder: "Adja meg a város vagy ország nevét",
    viewCost: "Költség megtekintése",
    subscriptionRequired: "Előfizetés szükséges",
    costOfList: "Lista költsége",
    imageListPrefix: "Kép Lista",
    
    // Modal Texts
    modalTitle: "Válassza ki vagy készítsen fényképet a bevásárlólistájáról",
    gallery: "Kiválasztás a galériából",
    takePhoto: "Fénykép készítése",
    cancel: "Mégse",
    
    // Subscription Texts
    subscribeToAnalyze: "Iratkozzon fel a bevásárlólisták elemzéséhez",
    
    // Alert Messages
    subscriptionMessage: "Előfizetéssel kell rendelkeznie a becsült költség kiszámításához.",
    subscribe: "Előfizetés",
    error: "Hiba",
    enterCountry: "Kérjük, adjon meg egy országot.",
    couldNotFetchCost: "Nem sikerült lekérni a becsült költséget.",
    noValidAnalysis: "Nem érkezett érvényes elemzés.",
    couldNotAnalyze: "Nem sikerült elemezni a képet.",
    errorLoadingCountry: "Hiba az ország betöltésekor: ",
    errorSavingCountry: "Hiba az ország mentésekor: ",
    errorSavingList: "Hiba a bevásárlólista mentésekor: ",
    errorSavingHistory: "Hiba a történet mentésekor: ",
    failedCameraPermission: "Nem sikerült a kamera engedélyt kérni",
    failedGalleryPermission: "Nem sikerült a galéria engedélyt kérni",
    errorAnalyzingImage: "Hiba a kép elemzésekor: ",
    errorGettingCustomerInfo: "Hiba az ügyfél információk lekérésekor:",
    
    // System Prompts
    analyzePrompt: "Ön egy hasznos asszisztens, aki a bevásárlólisták képeit elemzi. Válaszoljon magyarul, és ne kommentáljon semmit, csak adja hozzá a bevásárlólistán látható tételeket. Ha a kép nem tartalmaz tételeket egy lista generálásához, mindig keressen szövegeket egy lista létrehozásához. Ha más nyelven van, fordítsa le a termékeket a kért nyelvre.",
    costEstimatePrompt: "Ön egy asszisztens, aki kiszámítja egy bevásárlólista becsült költségét ${country} országban. Válaszoljon a teljes költséggel.",
  },
  hi: {
    // UI Labels
    creatingList: "सूची बना रहे हैं",
    analyzingImage: "आपकी छवि का विश्लेषण कर रहे हैं...",
    uploadImage: "एक छवि अपलोड करें",
    uploadImageDescription: "अपनी खरीदारी सूची की एक तस्वीर लें या चुनें ताकि इसका स्वचालित विश्लेषण हो सके",
    saveList: "सूची सहेजें",
    listSaved: "सूची सहेजी गई!",
    selectCountry: "देश चुनें",
    cityNamePlaceholder: "शहर या देश का नाम दर्ज करें",
    viewCost: "लागत देखें",
    subscriptionRequired: "सदस्यता आवश्यक",
    costOfList: "सूची की लागत",
    imageListPrefix: "छवि सूची",
    
    // Modal Texts
    modalTitle: "अपनी खरीदारी सूची की तस्वीर चुनें या लें",
    gallery: "गैलरी से चुनें",
    takePhoto: "तस्वीर लें",
    cancel: "रद्द करें",
    
    // Subscription Texts
    subscribeToAnalyze: "खरीदारी सूचियों का विश्लेषण करने के लिए सदस्यता लें",
    
    // Alert Messages
    subscriptionMessage: "अनुमानित लागत की गणना के लिए आपको सदस्यता लेनी होगी।",
    subscribe: "सदस्यता लें",
    error: "त्रुटि",
    enterCountry: "कृपया एक देश दर्ज करें।",
    couldNotFetchCost: "अनुमानित लागत प्राप्त नहीं कर सके।",
    noValidAnalysis: "कोई वैध विश्लेषण प्राप्त नहीं हुआ।",
    couldNotAnalyze: "छवि का विश्लेषण नहीं कर सके।",
    errorLoadingCountry: "देश लोड करने में त्रुटि: ",
    errorSavingCountry: "देश सहेजने में त्रुटि: ",
    errorSavingList: "खरीदारी सूची सहेजने में त्रुटि: ",
    errorSavingHistory: "इतिहास में सहेजने में त्रुटि: ",
    failedCameraPermission: "कैमरा अनुमति का अनुरोध असफल",
    failedGalleryPermission: "गैलरी अनुमति का अनुरोध असफल",
    errorAnalyzingImage: "छवि विश्लेषण में त्रुटि: ",
    errorGettingCustomerInfo: "ग्राहक जानकारी प्राप्त करने में त्रुटि:",
    
    // System Prompts
    analyzePrompt: "आप एक सहायक सहायक हैं जो खरीदारी सूचियों की छवियों का विश्लेषण करते हैं। हिंदी में जवाब दें और किसी भी चीज़ पर टिप्पणी न करें, बस खरीदारी सूची में दिखाई देने वाली वस्तुओं को जोड़ें। यदि छवि में सूची बनाने के लिए वस्तुएं नहीं हैं, तो हमेशा एक सूची बनाने के लिए पाठ खोजें। यदि यह किसी अन्य भाषा में है, तो उत्पादों को आवश्यक भाषा में अनुवादित करें।",
    costEstimatePrompt: "आप एक सहायक हैं जो ${country} में एक खरीदारी सूची की अनुमानित लागत की गणना करते हैं। कुल लागत के साथ जवाब दें।",
  },
};

export default imageListScreenTranslations;