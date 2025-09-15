import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  Linking,
  Alert,
  Animated,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import * as RNLocalize from 'react-native-localize';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallIPhone = Platform.OS === 'ios' && (screenWidth <= 375 || screenHeight <= 667);

const translations = {
  en: {
    title: "Contact Us",
    subtitle: "We'd love to hear from you",
    selectType: "What would you like to tell us?",
    bug: "Report a Bug",
    bugDesc: "Something not working right?",
    improvement: "Suggest Improvement",
    improvementDesc: "Have an idea to make the app better?",
    comment: "General Comment",
    commentDesc: "Share your thoughts with us",
    subject: "Subject",
    subjectPlaceholder: "Brief description...",
    message: "Message",
    messagePlaceholder: "Tell us more details...",
    send: "Send Message",
    sending: "Sending...",
    success: "Message sent successfully!",
    error: "Failed to send message",
    emailError: "Could not open email app",
    nameLabel: "Your Name (optional)",
    namePlaceholder: "John Doe",
    emailLabel: "Your Email (optional)",
    emailPlaceholder: "john@example.com"
  },
  es: {
    title: "Contáctanos",
    subtitle: "Nos encantaría saber de ti",
    selectType: "¿Qué te gustaría decirnos?",
    bug: "Reportar un Error",
    bugDesc: "¿Algo no funciona bien?",
    improvement: "Sugerir Mejora",
    improvementDesc: "¿Tienes una idea para mejorar la app?",
    comment: "Comentario General",
    commentDesc: "Comparte tus pensamientos con nosotros",
    subject: "Asunto",
    subjectPlaceholder: "Breve descripción...",
    message: "Mensaje",
    messagePlaceholder: "Cuéntanos más detalles...",
    send: "Enviar Mensaje",
    sending: "Enviando...",
    success: "¡Mensaje enviado exitosamente!",
    error: "Error al enviar mensaje",
    emailError: "No se pudo abrir la app de correo",
    nameLabel: "Tu Nombre (opcional)",
    namePlaceholder: "Juan Pérez",
    emailLabel: "Tu Correo (opcional)",
    emailPlaceholder: "juan@ejemplo.com"
  },
  de: {
    title: "Kontaktieren Sie uns",
    subtitle: "Wir freuen uns von Ihnen zu hören",
    selectType: "Was möchten Sie uns mitteilen?",
    bug: "Fehler melden",
    bugDesc: "Funktioniert etwas nicht richtig?",
    improvement: "Verbesserung vorschlagen",
    improvementDesc: "Haben Sie eine Idee zur Verbesserung der App?",
    comment: "Allgemeiner Kommentar",
    commentDesc: "Teilen Sie Ihre Gedanken mit uns",
    subject: "Betreff",
    subjectPlaceholder: "Kurze Beschreibung...",
    message: "Nachricht",
    messagePlaceholder: "Erzählen Sie uns mehr Details...",
    send: "Nachricht senden",
    sending: "Senden...",
    success: "Nachricht erfolgreich gesendet!",
    error: "Fehler beim Senden der Nachricht",
    emailError: "E-Mail-App konnte nicht geöffnet werden",
    nameLabel: "Ihr Name (optional)",
    namePlaceholder: "Max Mustermann",
    emailLabel: "Ihre E-Mail (optional)",
    emailPlaceholder: "max@beispiel.de"
  },
  fr: {
    title: "Contactez-nous",
    subtitle: "Nous aimerions avoir de vos nouvelles",
    selectType: "Que souhaitez-vous nous dire?",
    bug: "Signaler un Bug",
    bugDesc: "Quelque chose ne fonctionne pas?",
    improvement: "Suggérer une Amélioration",
    improvementDesc: "Avez-vous une idée pour améliorer l'app?",
    comment: "Commentaire Général",
    commentDesc: "Partagez vos pensées avec nous",
    subject: "Sujet",
    subjectPlaceholder: "Brève description...",
    message: "Message",
    messagePlaceholder: "Donnez-nous plus de détails...",
    send: "Envoyer le Message",
    sending: "Envoi...",
    success: "Message envoyé avec succès!",
    error: "Échec de l'envoi du message",
    emailError: "Impossible d'ouvrir l'app de messagerie",
    nameLabel: "Votre Nom (optionnel)",
    namePlaceholder: "Jean Dupont",
    emailLabel: "Votre Email (optionnel)",
    emailPlaceholder: "jean@exemple.fr"
  },
  it: {
    title: "Contattaci",
    subtitle: "Ci piacerebbe sentirti",
    selectType: "Cosa vorresti dirci?",
    bug: "Segnala un Bug",
    bugDesc: "Qualcosa non funziona?",
    improvement: "Suggerisci Miglioramento",
    improvementDesc: "Hai un'idea per migliorare l'app?",
    comment: "Commento Generale",
    commentDesc: "Condividi i tuoi pensieri con noi",
    subject: "Oggetto",
    subjectPlaceholder: "Breve descrizione...",
    message: "Messaggio",
    messagePlaceholder: "Raccontaci più dettagli...",
    send: "Invia Messaggio",
    sending: "Invio...",
    success: "Messaggio inviato con successo!",
    error: "Errore nell'invio del messaggio",
    emailError: "Impossibile aprire l'app email",
    nameLabel: "Il tuo Nome (opzionale)",
    namePlaceholder: "Mario Rossi",
    emailLabel: "La tua Email (opzionale)",
    emailPlaceholder: "mario@esempio.it"
  },
  pt: {
    title: "Contate-nos",
    subtitle: "Adoraríamos ouvir você",
    selectType: "O que você gostaria de nos dizer?",
    bug: "Reportar Bug",
    bugDesc: "Algo não está funcionando?",
    improvement: "Sugerir Melhoria",
    improvementDesc: "Tem uma ideia para melhorar o app?",
    comment: "Comentário Geral",
    commentDesc: "Compartilhe seus pensamentos conosco",
    subject: "Assunto",
    subjectPlaceholder: "Breve descrição...",
    message: "Mensagem",
    messagePlaceholder: "Conte-nos mais detalhes...",
    send: "Enviar Mensagem",
    sending: "Enviando...",
    success: "Mensagem enviada com sucesso!",
    error: "Falha ao enviar mensagem",
    emailError: "Não foi possível abrir o app de email",
    nameLabel: "Seu Nome (opcional)",
    namePlaceholder: "João Silva",
    emailLabel: "Seu Email (opcional)",
    emailPlaceholder: "joao@exemplo.com"
  },
  tr: {
    title: "Bize Ulaşın",
    subtitle: "Sizden haber almak isteriz",
    selectType: "Bize ne söylemek istersiniz?",
    bug: "Hata Bildir",
    bugDesc: "Bir şey çalışmıyor mu?",
    improvement: "İyileştirme Öner",
    improvementDesc: "Uygulamayı geliştirmek için bir fikriniz var mı?",
    comment: "Genel Yorum",
    commentDesc: "Düşüncelerinizi bizimle paylaşın",
    subject: "Konu",
    subjectPlaceholder: "Kısa açıklama...",
    message: "Mesaj",
    messagePlaceholder: "Bize daha fazla detay verin...",
    send: "Mesaj Gönder",
    sending: "Gönderiliyor...",
    success: "Mesaj başarıyla gönderildi!",
    error: "Mesaj gönderilemedi",
    emailError: "E-posta uygulaması açılamadı",
    nameLabel: "Adınız (isteğe bağlı)",
    namePlaceholder: "Ali Yılmaz",
    emailLabel: "E-postanız (isteğe bağlı)",
    emailPlaceholder: "ali@ornek.com"
  },
  ru: {
    title: "Свяжитесь с нами",
    subtitle: "Мы будем рады услышать вас",
    selectType: "Что вы хотите нам сказать?",
    bug: "Сообщить об ошибке",
    bugDesc: "Что-то не работает?",
    improvement: "Предложить улучшение",
    improvementDesc: "Есть идея по улучшению приложения?",
    comment: "Общий комментарий",
    commentDesc: "Поделитесь своими мыслями с нами",
    subject: "Тема",
    subjectPlaceholder: "Краткое описание...",
    message: "Сообщение",
    messagePlaceholder: "Расскажите нам больше...",
    send: "Отправить сообщение",
    sending: "Отправка...",
    success: "Сообщение успешно отправлено!",
    error: "Ошибка отправки сообщения",
    emailError: "Не удалось открыть почтовое приложение",
    nameLabel: "Ваше имя (необязательно)",
    namePlaceholder: "Иван Иванов",
    emailLabel: "Ваш email (необязательно)",
    emailPlaceholder: "ivan@example.ru"
  },
  ar: {
    title: "اتصل بنا",
    subtitle: "نحب أن نسمع منك",
    selectType: "ماذا تريد أن تخبرنا؟",
    bug: "الإبلاغ عن خطأ",
    bugDesc: "شيء لا يعمل بشكل صحيح؟",
    improvement: "اقتراح تحسين",
    improvementDesc: "هل لديك فكرة لتحسين التطبيق؟",
    comment: "تعليق عام",
    commentDesc: "شارك أفكارك معنا",
    subject: "الموضوع",
    subjectPlaceholder: "وصف موجز...",
    message: "الرسالة",
    messagePlaceholder: "أخبرنا المزيد من التفاصيل...",
    send: "إرسال الرسالة",
    sending: "جاري الإرسال...",
    success: "تم إرسال الرسالة بنجاح!",
    error: "فشل إرسال الرسالة",
    emailError: "لا يمكن فتح تطبيق البريد الإلكتروني",
    nameLabel: "اسمك (اختياري)",
    namePlaceholder: "محمد أحمد",
    emailLabel: "بريدك الإلكتروني (اختياري)",
    emailPlaceholder: "mohamed@example.com"
  },
  hu: {
    title: "Kapcsolat",
    subtitle: "Szeretnénk hallani Önről",
    selectType: "Mit szeretne elmondani nekünk?",
    bug: "Hiba jelentése",
    bugDesc: "Valami nem működik megfelelően?",
    improvement: "Fejlesztési javaslat",
    improvementDesc: "Van ötlete az alkalmazás jobbá tételéhez?",
    comment: "Általános megjegyzés",
    commentDesc: "Ossza meg gondolatait velünk",
    subject: "Tárgy",
    subjectPlaceholder: "Rövid leírás...",
    message: "Üzenet",
    messagePlaceholder: "Mondjon el többet...",
    send: "Üzenet küldése",
    sending: "Küldés...",
    success: "Az üzenet sikeresen elküldve!",
    error: "Nem sikerült elküldeni az üzenetet",
    emailError: "Nem sikerült megnyitni az e-mail alkalmazást",
    nameLabel: "Az Ön neve (opcionális)",
    namePlaceholder: "Kovács János",
    emailLabel: "Az Ön e-mail címe (opcionális)",
    emailPlaceholder: "janos@example.hu"
  },
  ja: {
    title: "お問い合わせ",
    subtitle: "ご意見をお聞かせください",
    selectType: "どのようなご用件ですか？",
    bug: "バグを報告",
    bugDesc: "何か正しく動作していませんか？",
    improvement: "改善提案",
    improvementDesc: "アプリを改善するアイデアがありますか？",
    comment: "一般的なコメント",
    commentDesc: "ご意見をお聞かせください",
    subject: "件名",
    subjectPlaceholder: "簡単な説明...",
    message: "メッセージ",
    messagePlaceholder: "詳細をお聞かせください...",
    send: "メッセージを送信",
    sending: "送信中...",
    success: "メッセージが正常に送信されました！",
    error: "メッセージの送信に失敗しました",
    emailError: "メールアプリを開けませんでした",
    nameLabel: "お名前（任意）",
    namePlaceholder: "山田太郎",
    emailLabel: "メールアドレス（任意）",
    emailPlaceholder: "taro@example.jp"
  },
  hi: {
    title: "हमसे संपर्क करें",
    subtitle: "हम आपसे सुनना चाहेंगे",
    selectType: "आप हमें क्या बताना चाहेंगे?",
    bug: "बग की रिपोर्ट करें",
    bugDesc: "कुछ ठीक से काम नहीं कर रहा?",
    improvement: "सुधार सुझाएं",
    improvementDesc: "ऐप को बेहतर बनाने का कोई विचार है?",
    comment: "सामान्य टिप्पणी",
    commentDesc: "अपने विचार हमारे साथ साझा करें",
    subject: "विषय",
    subjectPlaceholder: "संक्षिप्त विवरण...",
    message: "संदेश",
    messagePlaceholder: "हमें अधिक विवरण बताएं...",
    send: "संदेश भेजें",
    sending: "भेज रहे हैं...",
    success: "संदेश सफलतापूर्वक भेजा गया!",
    error: "संदेश भेजने में विफल",
    emailError: "ईमेल ऐप नहीं खोल सका",
    nameLabel: "आपका नाम (वैकल्पिक)",
    namePlaceholder: "राज कुमार",
    emailLabel: "आपका ईमेल (वैकल्पिक)",
    emailPlaceholder: "raj@example.com"
  },
  nl: {
    title: "Neem contact op",
    subtitle: "We horen graag van u",
    selectType: "Wat wilt u ons vertellen?",
    bug: "Meld een bug",
    bugDesc: "Werkt er iets niet goed?",
    improvement: "Stel verbetering voor",
    improvementDesc: "Heeft u een idee om de app te verbeteren?",
    comment: "Algemene opmerking",
    commentDesc: "Deel uw gedachten met ons",
    subject: "Onderwerp",
    subjectPlaceholder: "Korte beschrijving...",
    message: "Bericht",
    messagePlaceholder: "Vertel ons meer details...",
    send: "Verstuur bericht",
    sending: "Verzenden...",
    success: "Bericht succesvol verzonden!",
    error: "Kon bericht niet verzenden",
    emailError: "Kon e-mail app niet openen",
    nameLabel: "Uw naam (optioneel)",
    namePlaceholder: "Jan Jansen",
    emailLabel: "Uw e-mail (optioneel)",
    emailPlaceholder: "jan@example.nl"
  }
};

const ContactScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const t = translations[deviceLanguage] || translations.en;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const contactTypes = [
    {
      id: 'bug',
      label: 'Bug',
      desc: 'Report issue',
      icon: 'bug-outline',
      color: '#a855f7',
      gradient: ['#a855f7', '#9333ea']
    },
    {
      id: 'improvement',
      label: 'Idea',
      desc: 'Suggest feature',
      icon: 'bulb-outline',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#2563eb']
    },
    {
      id: 'comment',
      label: 'Comment',
      desc: 'Share thoughts',
      icon: 'chatbubble-outline',
      color: '#10b981',
      gradient: ['#10b981', '#059669']
    }
  ];

  const handleSend = async () => {
    if (!selectedType || !subject || !message) {
      Alert.alert(t.error, 'Please fill all required fields');
      return;
    }

    setSending(true);

    const typeLabel = contactTypes.find(t => t.id === selectedType)?.label || selectedType;
    const emailSubject = `[Voice Grocery - ${typeLabel}] ${subject}`;
    const emailBody = `
Type: ${typeLabel}
Name: ${name || 'Not provided'}
Email: ${email || 'Not provided'}

Message:
${message}

---
Sent from Voice Grocery App
Device: ${Platform.OS} ${Platform.Version}
Language: ${deviceLanguage}
    `;

    const mailtoUrl = `mailto:support@voicegrocery.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        setTimeout(() => {
          setSending(false);
          Alert.alert(t.success, '', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        }, 1000);
      } else {
        setSending(false);
        Alert.alert(t.emailError);
      }
    } catch (error) {
      setSending(false);
      Alert.alert(t.error, error.message);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#111827' : '#e7ead2',
    },
    header: {
      paddingTop: Platform.OS === 'ios' ? 20 : 10,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#374151' : '#e5e7eb',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    headerContent: {
      alignItems: 'center',
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: isSmallIPhone ? 24 : 28,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#ffffff' : '#111827',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: isSmallIPhone ? 14 : 16,
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    },
    scrollContent: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: isSmallIPhone ? 16 : 18,
      fontWeight: '600',
      color: theme === 'dark' ? '#e5e7eb' : '#374151',
      marginBottom: 12,
    },
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    typeCard: {
      width: '31%',
      aspectRatio: 1,
      marginBottom: 12,
      borderRadius: 16,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    typeCardSelected: {
      borderColor: '#3b82f6',
      transform: [{ scale: 0.95 }],
    },
    typeIcon: {
      marginBottom: 8,
    },
    typeLabel: {
      fontSize: isSmallIPhone ? 11 : 13,
      fontWeight: '600',
      textAlign: 'center',
    },
    typeDesc: {
      fontSize: isSmallIPhone ? 9 : 10,
      textAlign: 'center',
      marginTop: 2,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: isSmallIPhone ? 14 : 16,
      fontWeight: '500',
      color: theme === 'dark' ? '#d1d5db' : '#4b5563',
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
      borderRadius: 12,
      padding: isSmallIPhone ? 12 : 16,
      fontSize: isSmallIPhone ? 14 : 16,
      color: theme === 'dark' ? '#ffffff' : '#111827',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
    },
    textArea: {
      height: isSmallIPhone ? 100 : 120,
      textAlignVertical: 'top',
    },
    sendButton: {
      borderRadius: 16,
      padding: isSmallIPhone ? 14 : 18,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      marginBottom: 30,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    sendButtonText: {
      color: '#ffffff',
      fontSize: isSmallIPhone ? 16 : 18,
      fontWeight: '700',
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Contact Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.selectType}</Text>
            <View style={styles.typeContainer}>
              {contactTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  style={[
                    styles.typeCard,
                    {
                      backgroundColor: selectedType === type.id ? type.color : 'rgba(255, 255, 255, 0.4)',
                      borderColor: selectedType === type.id ? type.color : 'rgba(229, 231, 235, 0.5)',
                    },
                    selectedType === type.id && styles.typeCardSelected
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={type.icon}
                    size={isSmallIPhone ? 24 : 32}
                    color={selectedType === type.id ? '#ffffff' : type.color}
                    style={styles.typeIcon}
                  />
                  <Text style={{
                    fontSize: isSmallIPhone ? 11 : 13,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: selectedType === type.id ? '#ffffff' : '#1f2937'
                  }}>
                    {type.label}
                  </Text>
                  {!isSmallIPhone && (
                    <Text style={{
                      fontSize: isSmallIPhone ? 9 : 10,
                      textAlign: 'center',
                      marginTop: 2,
                      color: selectedType === type.id ? 'rgba(255,255,255,0.8)' : '#6b7280'
                    }}>
                      {type.desc}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Contact Form */}
          <View style={styles.section}>
            {/* Name (Optional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.nameLabel}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.namePlaceholder}
                placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email (Optional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.emailLabel}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.emailPlaceholder}
                placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Subject */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.subject} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t.subjectPlaceholder}
                placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            {/* Message */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.message} *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t.messagePlaceholder}
                placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={sending || !selectedType || !subject || !message}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3b82f6', '#8b5cf6']}
              style={[
                styles.sendButton,
                (sending || !selectedType || !subject || !message) && styles.sendButtonDisabled
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons
                name={sending ? "hourglass-outline" : "send"}
                size={20}
                color="#ffffff"
              />
              <Text style={styles.sendButtonText}>
                {sending ? t.sending : t.send}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactScreen;