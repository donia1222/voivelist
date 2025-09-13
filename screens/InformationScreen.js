import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Animated, Linking, Platform } from 'react-native';
import { useTheme } from '../ThemeContext'; // Importa el hook useTheme
import * as RNLocalize from 'react-native-localize';
import { Ionicons } from 'react-native-vector-icons';
import Purchases from 'react-native-purchases';
import RNRestart from 'react-native-restart'; // Importa para reiniciar la app (si es necesario)
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const isSmallIPhone = Platform.OS === 'ios' && (screenWidth <= 375 || screenHeight <= 667);
import LinearGradient from 'react-native-linear-gradient';
const GradientText = ({ text }) => (
  <View style={styles.textContainer}>
    <LinearGradient
      colors={['#009688', '#3f51b5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <Text style={styles.text}>{text}</Text>
    </LinearGradient>
  </View>
);

const labels = {
  en: {
    slide1Title: "Create Your Shopping List by Voice",
    slide1Subtitle: "Organize your shopping quickly.",
    slide1Description: "Speak and we'll do the rest. Say phrases like 'tomorrow I'm going to buy chicken, tomatoes, and onions' and our AI will select the ingredients for your list. Forget typing! Plus, receive push notifications to remind you of your purchases.",
    slide2Title: "Know the Prices in Your City",
    slide2Subtitle: "Calculate the cost of your shopping.",
    slide2Description: "Want to know how much your list will cost in Zurich, New York, or any other city? Our app offers price estimates to plan your budget. Always be prepared!",
    slide3Title: "Total Management of Your Shopping Lists",
    slide3Subtitle: "Save, edit, share, and print your lists.",
    slide3Description: "Create lists by voice, save, edit, and share them. Take a photo of a handwritten list and we'll digitize it for you. Organize your shopping easily! You can also create push notifications to remember everything.",
    slide4Title: "Without barriers!",

    slide4Description: "You can create voice lists completely free, but to analyze images, you need a subscription. Your support is invaluable!",
    slide5Title: "Your Privacy Matters",
    slide5Subtitle: "We prioritize your privacy.",
    slide5Description: "Our users' privacy is our top priority. No user is associated with data transmission. The data we send to OpenAI and for subscription management is handled using an anonymous ID, and responses are also sent to that anonymous ID. At no point is any of your data shared with third parties.",
    startButton: "Create a Shopping List",
    nextButton: "Next",
    finishButton: "Finish",
    loginPrompt: "Already have an account?",
    loginLink: "Sign in",
    welcomeMessageTitle: "Language for Voice Lists",
    welcomeMessage: "The default language for creating shopping lists is set to: ",
    changeLanguageNote: "If you want to create shopping lists in another language, please change the language in your device settings.",
    changeLanguageButton: "Open Settings",
  },
  es: {
    slide1Title: "¡Crea tu Lista de Compras por Voz!",
    slide1Subtitle: "Organiza tus compras rápidamente.",
    slide1Description: "Habla y nosotros haremos el resto. Di frases como 'mañana voy a comprar pollo, tomate y cebollas' y nuestra IA seleccionará los ingredientes para tu lista. ¡Olvídate de teclear! Además, recibe notificaciones push para recordar tus compras.",
    slide2Title: "Conoce los Precios en tu Ciudad",
    slide2Subtitle: "Calcula el costo de tus compras.",
    slide2Description: "¿Quieres saber cuánto costará tu lista en Zurich, Nueva York o cualquier otra ciudad? Nuestra app te ofrece estimaciones de precios para planificar tu presupuesto. ¡Siempre estarás preparado!",
    slide3Title: "Gestión Total de tus Listas de Compras",
    slide3Subtitle: "Guarda, edita, comparte e imprime tus listas.",
    slide3Description: "Crea listas por voz, guárdalas, edítalas y compártelas. Toma una foto de una lista escrita y nosotros la digitalizamos por ti. ¡Organiza tus compras fácilmente! También puedes crear notificaciones push para no olvidar nada.",
    slide4Title: "Sin barreras!",

    slide4Description: "Puedes crear listas por voz completamente gratis, pero para analizar imágenes necesitas una suscripción. ¡Tu apoyo es invaluable!",
    slide5Title: "Tu Privacidad Nos Importa",
    slide5Subtitle: "Priorizamos tu privacidad.",
    slide5Description: "La privacidad de nuestros usuarios es nuestra prioridad. Por eso, ningún usuario se relaciona con el envío de datos. Los datos que enviamos a OpenAI y para la suscripción se manejan con un ID anónimo y se reciben también a ese ID anónimo. En ningún momento se comparte ningún dato de usted con terceros.",
    startButton: "Crear una lista de compras",
    nextButton: "Siguiente",
    finishButton: "Terminar",
    loginPrompt: "¿Ya tienes una cuenta?",
    loginLink: "Iniciar sesión",
    welcomeMessageTitle: "Idioma para las listas de voz",
    welcomeMessage: "El idioma predeterminado para crear listas de compras está configurado en: ",
    changeLanguageNote: "Si deseas crear listas de compras en otro idioma, por favor cambia el idioma en los ajustes de tu dispositivo.",
    changeLanguageButton: "Abrir Configuración",
  },
  de: {
    slide1Title: "Erstellen Sie Ihre Voice Einkaufsliste!",
    slide1Subtitle: "Organisieren Sie Ihren Einkauf schnell.",
    slide1Description: "Sprechen Sie und wir erledigen den Rest. Sagen Sie Sätze wie 'morgen kaufe ich Huhn, Tomaten und Zwiebeln' und unsere KI wählt die Zutaten für Ihre Liste aus. Vergessen Sie das Tippen! Außerdem erhalten Sie Push-Benachrichtigungen, um an Ihre Einkäufe zu erinnern.",
    slide2Title: "Kennen Sie die Preise in Ihrer Stadt",
    slide2Subtitle: "Berechnen Sie die Kosten für Ihren Einkauf.",
    slide2Description: "Möchten Sie wissen, wie viel Ihre Liste in Zürich, New York oder einer anderen Stadt kostet? Unsere App bietet Kostenschätzungen, um Ihr Budget zu planen. Seien Sie immer vorbereitet!",
    slide3Title: "Gesamtverwaltung Ihrer Einkaufslisten",
    slide3Subtitle: "Speichern, bearbeiten, teilen und drucken Sie Ihre Listen.",
    slide3Description: "Erstellen Sie Listen per Sprache, speichern, bearbeiten und teilen Sie sie. Machen Sie ein Foto von einer handgeschriebenen Liste und wir digitalisieren sie für Sie. Organisieren Sie Ihren Einkauf ganz einfach! Sie können auch Push-Benachrichtigungen erstellen, um an alles zu denken.",
    slide4Title: "Ohne Barrieren!",

    slide4Description: "Sie können Sprachlisten völlig kostenlos erstellen, aber für die Bildanalyse benötigen Sie ein Abonnement. Ihre Unterstützung ist von unschätzbarem Wert!",
    slide5Title: "Ihre Privatsphäre ist uns wichtig",
    slide5Subtitle: "Wir priorisieren Ihre Privatsphäre.",
    slide5Description: "Die Privatsphäre unserer Nutzer hat für uns oberste Priorität. Kein Benutzer wird mit der Datenübertragung in Verbindung gebracht. Die Daten, die wir an OpenAI und für das Abonnement-Management senden, werden anonymisiert verarbeitet und Antworten werden ebenfalls an diese anonyme ID gesendet. Ihre Daten werden zu keinem Zeitpunkt an Dritte weitergegeben.",
    startButton: "Erstellen Sie eine Einkaufsliste",
    nextButton: "Weiter",
    finishButton: "Beenden",
    loginPrompt: "Haben Sie bereits ein Konto?",
    loginLink: "Anmelden",
    welcomeMessageTitle: "Sprache für Sprachlisten",
    welcomeMessage: "Die Standardsprache zum Erstellen von Einkaufslisten ist eingestellt auf: ",
    changeLanguageNote: "Wenn Sie Einkaufslisten in einer anderen Sprache erstellen möchten, ändern Sie bitte die Sprache in den Einstellungen Ihres Geräts.",
    changeLanguageButton: "Einstellungen öffnen",
  },
  it: {
    slide1Title: "Crea la tua Lista della Spesa con la Voce",
    slide1Subtitle: "Organizza la tua spesa rapidamente.",
    slide1Description: "Parla e faremo il resto. Dì frasi come 'domani vado a comprare pollo, pomodori e cipolle' e la nostra IA selezionerà gli ingredienti per la tua lista. Dimentica la digitazione! Inoltre, ricevi notifiche push per ricordarti dei tuoi acquisti.",
    slide2Title: "Conosci i Prezzi nella Tua Città",
    slide2Subtitle: "Calcola il costo della tua spesa.",
    slide2Description: "Vuoi sapere quanto costerà la tua lista a Zurigo, New York o in un'altra città? La nostra app offre stime dei prezzi per pianificare il tuo budget. Sii sempre preparato!",
    slide3Title: "Gestione Totale delle Tue Liste della Spesa",
    slide3Subtitle: "Salva, modifica, condividi e stampa le tue liste.",
    slide3Description: "Crea liste con la voce, salvale, modificale e condividile. Scatta una foto di una lista scritta a mano e la digitalizzeremo per te. Organizza facilmente la tua spesa! Puoi anche creare notifiche push per ricordarti tutto.",
    slide4Title: "Senza barriere!",

    slide4Description: "Puoi creare liste vocali completamente gratis, ma per analizzare immagini è necessario un abbonamento. Il tuo supporto è inestimabile!",
    slide5Title: "La tua privacy è importante",
    slide5Subtitle: "Diamo priorità alla tua privacy.",
    slide5Description: "La privacy dei nostri utenti è la nostra massima priorità. Nessun utente è associato alla trasmissione dei dati. I dati che inviamo a OpenAI e per la gestione degli abbonamenti sono gestiti utilizzando un ID anonimo e le risposte vengono inviate a tale ID anonimo. In nessun momento i tuoi dati vengono condivisi con terze parti.",
    startButton: "Crea una Lista della Spesa",
    nextButton: "Avanti",
    finishButton: "Finisci",
    loginPrompt: "Hai già un account?",
    loginLink: "Accedi",
    welcomeMessageTitle: "Lingua per le Liste Vocali",
    welcomeMessage: "La lingua predefinita per creare liste della spesa è impostata su: ",
    changeLanguageNote: "Se desideri creare liste della spesa in un'altra lingua, cambia la lingua nelle impostazioni del tuo dispositivo.",
    changeLanguageButton: "Apri Impostazioni",
  },
  fr: {
    slide1Title: "Créez votre Liste de Courses par Voix",
    slide1Subtitle: "Organisez vos courses rapidement.",
    slide1Description: "Parlez et nous ferons le reste. Dites des phrases comme 'demain je vais acheter du poulet, des tomates et des oignons' et notre IA sélectionnera les ingrédients pour votre liste. Oubliez la saisie! De plus, recevez des notifications push pour vous rappeler vos achats.",
    slide2Title: "Connaître les Prix dans Votre Ville",
    slide2Subtitle: "Calculez le coût de vos courses.",
    slide2Description: "Vous voulez savoir combien coûtera votre liste à Zurich, New York ou dans une autre ville? Notre application propose des estimations de prix pour planifier votre budget. Soyez toujours préparé!",
    slide3Title: "Gestion Totale de Vos Listes de Courses",
    slide3Subtitle: "Enregistrez, modifiez, partagez et imprimez vos listes.",
    slide3Description: "Créez des listes par voix, enregistrez-les, modifiez-les et partagez-les. Prenez une photo d'une liste manuscrite et nous la numériserons pour vous. Organisez vos courses facilement! Vous pouvez également créer des notifications push pour tout vous rappeler.",
    slide4Title: "Sans barrières!",

    slide4Description: "Vous pouvez créer des listes vocales gratuitement, mais pour analyser les images, un abonnement est nécessaire. Votre soutien est inestimable!",
    slide5Title: "Votre vie privée est importante",
    slide5Subtitle: "Nous priorisons votre vie privée.",
    slide5Description: "La vie privée de nos utilisateurs est notre priorité absolue. Aucun utilisateur n'est associé à la transmission de données. Les données que nous envoyons à OpenAI et pour la gestion des abonnements sont traitées à l'aide d'un ID anonyme, et les réponses sont également envoyées à cet ID anonyme. À aucun moment vos données ne sont partagées avec des tiers.",
    startButton: "Créer une Liste de Courses",
    nextButton: "Suivant",
    finishButton: "Terminer",
    loginPrompt: "Vous avez déjà un compte?",
    loginLink: "Se connecter",
    welcomeMessageTitle: "Langue pour les Listes Vocales",
    welcomeMessage: "La langue par défaut pour créer des listes de courses est réglée sur: ",
    changeLanguageNote: "Si vous souhaitez créer des listes de courses dans une autre langue, veuillez changer la langue dans les paramètres de votre appareil.",
    changeLanguageButton: "Ouvrir les Paramètres",
  },
  tr: {
    slide1Title: "Sesli Alışveriş Listenizi Oluşturun",
    slide1Subtitle: "Alışverişinizi hızlıca düzenleyin.",
    slide1Description: "Konuşun, gerisini biz hallederiz. 'Yarın tavuk, domates ve soğan alacağım' gibi cümleler söyleyin ve yapay zekamız listeniz için malzemeleri seçsin. Yazmayı unutun! Ayrıca, alışverişlerinizi hatırlatmak için push bildirimleri alın.",
    slide2Title: "Şehrinizdeki Fiyatları Bilin",
    slide2Subtitle: "Alışverişinizin maliyetini hesaplayın.",
    slide2Description: "Zürih, New York veya başka bir şehirde listenizin ne kadar tutacağını mı bilmek istiyorsunuz? Uygulamamız bütçenizi planlamak için fiyat tahminleri sunar. Her zaman hazırlıklı olun!",
    slide3Title: "Alışveriş Listelerinizin Tam Yönetimi",
    slide3Subtitle: "Listelerinizi kaydedin, düzenleyin, paylaşın ve yazdırın.",
    slide3Description: "Sesli listeler oluşturun, kaydedin, düzenleyin ve paylaşın. El yazısıyla yazılmış bir listenin fotoğrafını çekin, biz sizin için dijital hale getirelim. Alışverişinizi kolayca organize edin! Ayrıca, her şeyi hatırlamak için push bildirimleri oluşturabilirsiniz.",
    slide4Title: "Engelsiz!",

    slide4Description: "Sesli listeler oluşturmak tamamen ücretsizdir, ancak görüntü analizi için abonelik gereklidir. Desteğiniz paha biçilemez!",
    slide5Title: "Gizliliğiniz Önemlidir",
    slide5Subtitle: "Gizliliğinize öncelik veriyoruz.",
    slide5Description: "Kullanıcılarımızın gizliliği en önemli önceliğimizdir. Hiçbir kullanıcı veri iletimine bağlanmaz. OpenAI'ye ve abonelik yönetimi için gönderdiğimiz veriler anonim bir kimlik kullanılarak işlenir ve yanıtlar da bu anonim kimliğe gönderilir. Hiçbir zaman verileriniz üçüncü şahıslarla paylaşılmaz.",
    startButton: "Bir Alışveriş Listesi Oluşturun",
    nextButton: "İleri",
    finishButton: "Bitir",
    loginPrompt: "Zaten bir hesabınız var mı?",
    loginLink: "Giriş yap",
    welcomeMessageTitle: "Sesli Listeler için Dil",
    welcomeMessage: "Alışveriş listeleri oluşturmak için varsayılan dil olarak ayarlanmıştır: ",
    changeLanguageNote: "Başka bir dilde alışveriş listeleri oluşturmak istiyorsanız, lütfen cihazınızın ayarlarında dili değiştirin.",
    changeLanguageButton: "Ayarları Aç",
  },
  pt: {
    slide1Title: "Crie Sua Lista de Compras por Voz",
    slide1Subtitle: "Organize suas compras rapidamente.",
    slide1Description: "Fale e nós faremos o resto. Diga frases como 'amanhã vou comprar frango, tomates e cebolas' e nossa IA selecionará os ingredientes para sua lista. Esqueça a digitação! Além disso, receba notificações push para lembrá-lo de suas compras.",
    slide2Title: "Saiba os Preços na Sua Cidade",
    slide2Subtitle: "Calcule o custo das suas compras.",
    slide2Description: "Quer saber quanto custará sua lista em Zurique, Nova York ou qualquer outra cidade? Nosso aplicativo oferece estimativas de preços para planejar seu orçamento. Esteja sempre preparado!",
    slide3Title: "Gestão Total de Suas Listas de Compras",
    slide3Subtitle: "Salve, edite, compartilhe e imprima suas listas.",
    slide3Description: "Crie listas por voz, salve, edite e compartilhe-as. Tire uma foto de uma lista manuscrita e nós a digitalizaremos para você. Organize suas compras facilmente! Você também pode criar notificações push para lembrar de tudo.",
    slide4Title: "Sem barreiras!",

    slide4Description: "Você pode criar listas de voz gratuitamente, mas para analisar imagens, é necessário um plano de assinatura. Seu apoio é inestimável!",
    slide5Title: "Sua Privacidade Importa",
    slide5Subtitle: "Nós priorizamos sua privacidade.",
    slide5Description: "A privacidade de nossos usuários é nossa principal prioridade. Nenhum usuário está associado à transmissão de dados. Os dados que enviamos para a OpenAI e para a gestão de assinaturas são tratados usando um ID anônimo, e as respostas também são enviadas para esse ID anônimo. Em nenhum momento os seus dados são compartilhados com terceiros.",
    startButton: "Crie uma Lista de Compras",
    nextButton: "Próximo",
    finishButton: "Terminar",
    loginPrompt: "Já tem uma conta?",
    loginLink: "Entrar",
    welcomeMessageTitle: "Idioma para Listas de Voz",
    welcomeMessage: "O idioma padrão para criar listas de compras está definido como: ",
    changeLanguageNote: "Se você quiser criar listas de compras em outro idioma, altere o idioma nas configurações do seu dispositivo.",
    changeLanguageButton: "Abrir Configurações",
  },
  ru: {
    slide1Title: "Создайте свой список покупок голосом",
    slide1Subtitle: "Быстро организуйте свои покупки.",
    slide1Description: "Говорите, и мы сделаем остальное. Скажите фразы, например 'завтра я куплю курицу, помидоры и лук', и наш ИИ выберет ингредиенты для вашего списка. Забудьте о печати! Кроме того, получайте push-уведомления, чтобы напомнить вам о покупках.",
    slide2Title: "Узнайте цены в вашем городе",
    slide2Subtitle: "Рассчитайте стоимость ваших покупок.",
    slide2Description: "Хотите узнать, сколько будет стоить ваш список в Цюрихе, Нью-Йорке или любом другом городе? Наше приложение предлагает оценку стоимости для планирования вашего бюджета. Всегда будьте готовы!",
    slide3Title: "Полное управление вашими списками покупок",
    slide3Subtitle: "Сохраняйте, редактируйте, делитесь и распечатывайте свои списки.",
    slide3Description: "Создавайте списки голосом, сохраняйте, редактируйте и делитесь ими. Сделайте фото написанного от руки списка, и мы его оцифруем. Легко организуйте свои покупки! Вы также можете создавать push-уведомления, чтобы помнить обо всем.",
    slide4Title: "Без барьеров!",

    slide4Description: "Вы можете создавать голосовые списки бесплатно, но для анализа изображений требуется подписка. Ваша поддержка бесценна!",
    slide5Title: "Ваша конфиденциальность важна",
    slide5Subtitle: "Мы придаем первостепенное значение вашей конфиденциальности.",
    slide5Description: "Конфиденциальность наших пользователей является нашим главным приоритетом. Ни один пользователь не связан с передачей данных. Данные, которые мы отправляем в OpenAI и для управления подписками, обрабатываются с использованием анонимного идентификатора, и ответы также отправляются на этот анонимный идентификатор. В любой момент ваши данные не передаются третьим лицам.",
    startButton: "Создать список покупок",
    nextButton: "Далее",
    finishButton: "Закончить",
    loginPrompt: "Уже есть аккаунт?",
    loginLink: "Войти",
    welcomeMessageTitle: "Язык для голосовых списков",
    welcomeMessage: "Язык по умолчанию для создания списков покупок установлен на: ",
    changeLanguageNote: "Если вы хотите создавать списки покупок на другом языке, измените язык в настройках устройства.",
    changeLanguageButton: "Открыть настройки",
  },
  ar: {
    slide1Title: "أنشئ قائمة التسوق الخاصة بك بالصوت",
    slide1Subtitle: "نظم تسوقك بسرعة.",
    slide1Description: "تحدث وسنقوم بالباقي. قل عبارات مثل 'غداً سأشتري دجاج، طماطم وبصل' وسيقوم الذكاء الاصطناعي الخاص بنا باختيار المكونات لقائمتك. انسَ الكتابة! بالإضافة إلى ذلك، احصل على إشعارات لتذكيرك بمشترياتك.",
    slide2Title: "تعرف على الأسعار في مدينتك",
    slide2Subtitle: "احسب تكلفة التسوق الخاص بك.",
    slide2Description: "هل تريد معرفة تكلفة قائمتك في زيورخ، نيويورك أو أي مدينة أخرى؟ يوفر تطبيقنا تقديرات الأسعار لتخطيط ميزانيتك. كن دائماً مستعداً!",
    slide3Title: "الإدارة الكاملة لقوائم التسوق الخاصة بك",
    slide3Subtitle: "احفظ، حرر، شارك واطبع قوائمك.",
    slide3Description: "أنشئ قوائم بالصوت، احفظها، حررها وشاركها. التقط صورة لقائمة مكتوبة بخط اليد وسنقوم برقمنتها من أجلك. نظم تسوقك بسهولة! يمكنك أيضًا إنشاء إشعارات لتذكيرك بكل شيء.",
    slide4Title: "بدون حواجز!",

    slide4Description: "يمكنك إنشاء قوائم صوتية مجانًا، لكن يتطلب تحليل الصور اشتراكًا. دعمك لا يقدر بثمن!",
    slide5Title: "خصوصيتك تهمنا",
    slide5Subtitle: "نحن نعطي الأولوية لخصوصيتك.",
    slide5Description: "خصوصية مستخدمينا هي أولويتنا القصوى. لا يرتبط أي مستخدم بنقل البيانات. تتم معالجة البيانات التي نرسلها إلى OpenAI ولإدارة الاشتراكات باستخدام معرف مجهول، ويتم إرسال الردود أيضًا إلى هذا المعرف المجهول. في أي وقت، لا يتم مشاركة بياناتك مع أطراف ثالثة.",
    startButton: "أنشئ قائمة التسوق",
    nextButton: "التالي",
    finishButton: "إنهاء",
    loginPrompt: "هل لديك حساب بالفعل؟",
    loginLink: "تسجيل الدخول",
    welcomeMessageTitle: "اللغة لقوائم الصوت",
    welcomeMessage: "تم تعيين اللغة الافتراضية لإنشاء قوائم التسوق على: ",
    changeLanguageNote: "إذا كنت ترغب في إنشاء قوائم التسوق بلغة أخرى، يرجى تغيير اللغة في إعدادات جهازك.",
    changeLanguageButton: "فتح الإعدادات",
  },
  hu: {
    slide1Title: "Hozzon létre bevásárlólistát hanggal",
    slide1Subtitle: "Szervezze meg gyorsan a vásárlást.",
    slide1Description: "Beszéljen, és mi megcsináljuk a többit. Mondjon például ilyen mondatokat: 'holnap csirkét, paradicsomot és hagymát veszek', és az AI kiválasztja az összetevőket a listájához. Felejtse el a gépelést! Ezenkívül push értesítéseket is kaphat, hogy emlékeztesse Önt a vásárlásokra.",
    slide2Title: "Ismerje meg az árakat a városában",
    slide2Subtitle: "Számolja ki a vásárlás költségét.",
    slide2Description: "Szeretné tudni, mennyibe fog kerülni a listája Zürichben, New Yorkban vagy bármely más városban? Az alkalmazásunk árbecsléseket kínál a költségvetés megtervezéséhez. Mindig legyen felkészülve!",
    slide3Title: "Teljes körű bevásárlólistakezelés",
    slide3Subtitle: "Mentse, szerkessze, ossza meg és nyomtassa ki a listáit.",
    slide3Description: "Hozzon létre listákat hanggal, mentse el, szerkessze és ossza meg őket. Készítsen fényképet egy kézzel írt listáról, és mi digitalizáljuk Önnek. Könnyen szervezze meg a vásárlást! Push értesítéseket is létrehozhat, hogy mindenre emlékezzen.",
    slide4Title: "Nincs akadály!",

    slide4Description: "A hangalapú lista készítés teljesen ingyenes, de a képelemzéshez előfizetés szükséges. Támogatása felbecsülhetetlen!",
    slide5Title: "A magánéleted számít",
    slide5Subtitle: "Elsődleges szempont számunkra a magánéleted.",
    slide5Description: "Felhasználóink magánélete a legfontosabb számunkra. Egyetlen felhasználó sem kapcsolódik az adatok továbbításához. Az OpenAI-nak és az előfizetés kezeléséhez küldött adatokat anonim azonosítóval kezeljük, és a válaszokat is erre az anonim azonosítóra küldjük. Az Ön adatait soha nem adjuk át harmadik feleknek.",
    startButton: "Hozzon létre bevásárlólistát",
    nextButton: "Következő",
    finishButton: "Befejezés",
    loginPrompt: "Van már fiókja?",
    loginLink: "Bejelentkezés",
    welcomeMessageTitle: "Nyelv a hanglistákhoz",
    welcomeMessage: "A bevásárlólisták létrehozásához alapértelmezett nyelv: ",
    changeLanguageNote: "Ha más nyelven szeretne bevásárlólistákat létrehozni, kérjük, változtassa meg a nyelvet az eszköz beállításaiban.",
    changeLanguageButton: "Beállítások megnyitása",
  },
  ja: {
    slide1Title: "音声で買い物リストを作成する",
    slide1Subtitle: "素早く買い物を整理する。",
    slide1Description: "話すだけで、後はお任せください。例えば「明日鶏肉、トマト、玉ねぎを買います」と言えば、AIがリストに必要な材料を選んでくれます。タイピングを忘れましょう！さらに、購入をリマインドするプッシュ通知を受け取ることができます。",
    slide2Title: "あなたの街の価格を知る",
    slide2Subtitle: "買い物の費用を計算する。",
    slide2Description: "チューリッヒ、ニューヨーク、または他の都市でリストの費用がいくらになるか知りたいですか？アプリは予算を計画するための価格見積もりを提供します。常に準備を整えてください！",
    slide3Title: "買い物リストの完全管理",
    slide3Subtitle: "リストを保存、編集、共有、および印刷する。",
    slide3Description: "音声でリストを作成し、保存、編集、共有します。手書きのリストの写真を撮り、それをデジタル化します。買い物を簡単に整理しましょう！また、すべてを覚えておくためにプッシュ通知を作成することもできます。",
    slide4Title: "障害なし！",

    slide4Description: "音声リスト作成は無料ですが、画像解析にはサブスクリプションが必要です。サポートをお願いします！",
    slide5Title: "プライバシーが重要です",
    slide5Subtitle: "プライバシーを最優先します。",
    slide5Description: "ユーザーのプライバシーは最優先事項です。データ送信にユーザーは関連付けられていません。OpenAIおよびサブスクリプション管理に送信するデータは匿名IDを使用して処理され、応答もその匿名IDに送信されます。お客様のデータが第三者と共有されることはありません。",
    startButton: "買い物リストを作成する",
    nextButton: "次へ",
    finishButton: "終了",
    loginPrompt: "すでにアカウントをお持ちですか？",
    loginLink: "サインイン",
    welcomeMessageTitle: "音声リストの言語",
    welcomeMessage: "買い物リストを作成するためのデフォルトの言語は次のように設定されています: ",
    changeLanguageNote: "別の言語で買い物リストを作成したい場合は、デバイスの設定で言語を変更してください。",
    changeLanguageButton: "設定を開く",
  },
  he: {
    slide1Title: "צור את רשימת הקניות שלך בקול",
    slide1Subtitle: "ארגן את הקניות שלך במהירות.",
    slide1Description: "דבר ואנחנו נעשה את השאר. אמור משפטים כמו 'מחר אני אקנה עוף, עגבניות ובצל' וה-AI שלנו יבחר את המרכיבים לרשימה שלך. שכח מהקלדה! בנוסף, קבל התראות דחיפה כדי להזכיר לך את הקניות שלך.",
    slide2Title: "דע את המחירים בעיר שלך",
    slide2Subtitle: "חשב את עלות הקניות שלך.",
    slide2Description: "רוצה לדעת כמה תעלה הרשימה שלך בציריך, ניו יורק או בכל עיר אחרת? האפליקציה שלנו מציעה הערכות מחיר לתכנון התקציב שלך. היה מוכן תמיד!",
    slide3Title: "ניהול מלא של רשימות הקניות שלך",
    slide3Subtitle: "שמור, ערוך, שתף והדפס את הרשימות שלך.",
    slide3Description: "צור רשימות בקול, שמור, ערוך ושתף אותן. צלם תמונה של רשימה כתובה ביד ואנחנו נדפיס אותה עבורך. ארגן את הקניות שלך בקלות! תוכל גם ליצור התראות דחיפה כדי לזכור הכל.",
    slide4Title: "ללא מחסומים!",

    slide4Description: "תוכל ליצור רשימות קוליות בחינם, אך נדרש מנוי לניתוח תמונות. התמיכה שלך היא לא יסולא בפז!",
    slide5Title: "הפרטיות שלך חשובה",
    slide5Subtitle: "אנו נותנים עדיפות לפרטיות שלך.",
    slide5Description: "הפרטיות של המשתמשים שלנו היא בראש סדר העדיפויות שלנו. אף משתמש לא מקושר להעברת נתונים. הנתונים שאנו שולחים ל-OpenAI ולניהול המנויים מטופלים באמצעות מזהה אנונימי, והתגובות נשלחות גם למזהה אנונימי זה. בשום שלב הנתונים שלך לא משותפים עם צדדים שלישיים.",
    startButton: "צור רשימת קניות",
    nextButton: "הבא",
    finishButton: "סיום",
    loginPrompt: "כבר יש לך חשבון?",
    loginLink: "התחבר",
    welcomeMessageTitle: "שפה עבור רשימות קוליות",
    welcomeMessage: "שפת ברירת המחדל ליצירת רשימות קניות מוגדרת ל: ",
    changeLanguageNote: "אם ברצונך ליצור רשימות קניות בשפה אחרת, שנה את השפה בהגדרות המכשיר שלך.",
    changeLanguageButton: "פתח הגדרות",
  },
};



const slides = [
  {
    id: '1',
    titleKey: 'slide1Title',
    subtitleKey: 'slide1Subtitle',
    descriptionKey: 'slide1Description',
    image: require('../assets/images/boca-a-boca.png'), // Reemplaza con la ruta correcta
  },
  {
    id: '2',
    titleKey: 'slide2Title',
    subtitleKey: 'slide2Subtitle',
    descriptionKey: 'slide2Description',
    image: require('../assets/images/lista-de-precios.png'), // Reemplaza con la ruta correcta
  },
  {
    id: '3',
    titleKey: 'slide3Title',
    subtitleKey: 'slide3Subtitle',
    descriptionKey: 'slide3Description',
    image: require('../assets/images/lista-de-quehacerescopia.png'), // Reemplaza con la ruta correcta
  },
  {
    id: '4',
    titleKey: 'slide4Title',
    subtitleKey: 'slide4Subtitle',
    descriptionKey: 'slide4Description',
    image: require('../assets/images/App-Icon-1024x1024@1x copia.png'), // Reemplaza con la ruta correcta
  },
  {
    id: '5',
    titleKey: 'slide5Title',
    subtitleKey: 'slide5Subtitle',
    descriptionKey: 'slide5Description',
    image: require('../assets/images/seguro.png'), // Reemplaza con la ruta correcta
  },
];

const { width } = Dimensions.get('window');
const OnboardingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const currentLabels = labels[deviceLanguage] || labels['en'];
  const styles = getStyles(theme);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const filteredSlides = isSubscribed ? slides.slice(0, 3) : slides;
  const [buttonVisible, setButtonVisible] = useState(true); // Estado para manejar la visibilidad del botón
  const [showCloseIcon, setShowCloseIcon] = useState(false); // Estado para manejar la visibilidad del icono de cerrar

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        if (customerInfo.entitlements.active['12981']) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    };

    checkSubscription();
  }, []);

  useEffect(() => {
    const checkButtonVisibility = async () => {
      const hasButtonShown = await AsyncStorage.getItem('hasButtonShown');
      if (hasButtonShown !== null) {
        setButtonVisible(false); // Si ya se ha mostrado, no mostrar el botón
        setShowCloseIcon(true); // Mostrar el icono de cerrar
      }
    };

    checkButtonVisibility();
  }, []);

  const navigate = async () => {
    await AsyncStorage.setItem('hasButtonShown', 'true'); // Guardar que el botón ya se mostró
    RNRestart.Restart(); // Esto reiniciará la app
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);

    // Reiniciar y ejecutar animación
    translateY.setValue(-400);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
        {!isSmallIPhone && ( // No mostrar imágenes en iPhone SE
        <Animated.Image source={item.image} style={[styles.image, { transform: [{ translateY }] }]} />
      )}

      <Text style={[styles.subtitle, isSmallIPhone && {fontSize: 16, marginVertical: 3, padding: 15}]}>{currentLabels[item.subtitleKey]}</Text>
      <Text style={[styles.description, isSmallIPhone && {fontSize: 14, marginHorizontal: 15}]}>{currentLabels[item.descriptionKey]}</Text>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < filteredSlides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={filteredSlides}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        ref={flatListRef}
      />
      <View style={styles.paginationContainer}>
        {filteredSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index ? styles.paginationDotActive : styles.paginationDotInactive
            ]}
          />
        ))}
      </View>
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color='#009688' />
          </View>
        </View>
      )}
      {buttonVisible && (
        currentIndex === filteredSlides.length - 1 ? (
          <TouchableOpacity style={styles.buttonterminar} onPress={navigate}>
            <Ionicons name="mic-outline" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>{currentLabels.startButton}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{currentLabels.nextButton}</Text>
            <Ionicons name="arrow-forward-outline" size={24} color="white" style={styles.iconRight} />
          </TouchableOpacity>
        )
      )}

    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
   paddingBottom:40,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  image: {
    width: isSmallIPhone ? 100 : 150,
    height: isSmallIPhone ? 100 : 150,
    resizeMode: 'contain',
    marginBottom: isSmallIPhone ? 20 : 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginVertical: 10,
    color: theme.text,
    padding: 20,
  },
  subtitle: {
    fontSize: isSmallIPhone ? 16 : 18,
    textAlign: 'center',
    color: theme.text,
    marginVertical: isSmallIPhone ? 3 : 5,
    padding: isSmallIPhone ? 15 : 20,
    fontFamily: 'Poppins-Bold',

  },
  description: {
    fontSize: isSmallIPhone ? 14 : 16,
    textAlign: 'center',
    color: theme.text,
    marginHorizontal: isSmallIPhone ? 15 : 20,
    fontFamily: 'Poppins-Regular',

  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: -10,
  },
  paginationDotActive: {
    width: 12,
    height: 12,
    backgroundColor: '#3f51b5',
  },
  paginationDotInactive: {
    backgroundColor: 'gray',
  },
  button: {
    backgroundColor: '#3f51b5',
    padding: isSmallIPhone ? 8 : 10,
    borderRadius: 50,
marginBottom: isSmallIPhone ? -5 : -10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isSmallIPhone ? 5 : 10,
    // Sombras para Android
    elevation: 5,
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width: isSmallIPhone ? 160 : 180,
  },
  buttonterminar: {
    backgroundColor: '#009688',
    padding: isSmallIPhone ? 12 : 15,
    borderRadius: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isSmallIPhone ? 5 : 10,
    // Sombras para Android
    elevation: 5,
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  
  
  buttonText: {
    color: 'white',
    fontSize: isSmallIPhone ? 16 : 18,
    fontFamily: 'Poppins-Regular',
  },
  icon: {
    marginRight: 10,
  },
  loginText: {
    marginTop: 20,
    color: theme.text,
  },
  loginLink: {
    color: 'blue',
    fontWeight: 'bold',
  },
  iconRight: {
    marginLeft: 10,
  },
  homeButtonText: {
position: 'absolute',
top:10,
right:20,
  },

});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width:'90%',
  },
  gradientBackground: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,

  },
  text: {
    fontSize: 21,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign:'center',
    marginTop:10,
    marginBottom: 10,
  },
});


export default OnboardingScreen;
