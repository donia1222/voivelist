import React from 'react';
import { Modal, View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as RNLocalize from 'react-native-localize';

const labels = {
  en: {
    title: "Notifications for your Shopping",
    message: "To help you stay organized. Enable notifications to create reminders for your shopping lists and never forget an item.",
    understoodButton: "Understood"
  },
  es: {
    title: "Notificaciones para tus Compras",
    message: "Para ayudarte a mantenerte organizado. Activa el envío de notificaciones para crear recordatorios para tus listas de compras y nunca olvides un artículo.",
    understoodButton: "Entendido"
  },
  de: {
    title: "Benachrichtigungen für Ihre Einkäufe",
    message: "Um Ihnen zu helfen, organisiert zu bleiben. Aktivieren Sie Benachrichtigungen, um Erinnerungen für Ihre Einkaufslisten zu erstellen und nie einen Artikel zu vergessen.",
    understoodButton: "Verstanden"
  },
  it: {
    title: "Notifiche per i tuoi acquisti",
    message: "Per aiutarti a rimanere organizzato. Abilita le notifiche per creare promemoria per le tue liste della spesa e non dimenticare mai un articolo.",
    understoodButton: "Capito"
  },
  fr: {
    title: "Notifications pour vos achats",
    message: "Pour vous aider à rester organisé. Activez les notifications pour créer des rappels pour vos listes de courses et ne manquez jamais un article.",
    understoodButton: "Compris"
  },
  tr: {
    title: "Alışverişiniz için Bildirimler",
    message: "Organize olmanıza yardımcı olmak için. Alışveriş listeleriniz için hatırlatıcılar oluşturmak ve hiçbir ürünü unutmamak için bildirimleri etkinleştirin.",
    understoodButton: "Anladım"
  },
  pt: {
    title: "Notificações para suas Compras",
    message: "Para ajudá-lo a manter-se organizado. Ative as notificações para criar lembretes para suas listas de compras e nunca esquecer um item.",
    understoodButton: "Entendido"
  },
  ru: {
    title: "Уведомления для ваших покупок",
    message: "Чтобы помочь вам оставаться организованным. Включите уведомления, чтобы создавать напоминания для ваших списков покупок и никогда не забывать товар.",
    understoodButton: "Понял"
  },
  ar: {
    title: "إشعارات لمشترياتك",
    message: "لمساعدتك على البقاء منظمًا. قم بتمكين الإشعارات لإنشاء تذكيرات لقوائم التسوق الخاصة بك ولا تنسى أي عنصر.",
    understoodButton: "مفهوم"
  },
  hu: {
    title: "Értesítések a vásárlásaihoz",
    message: "Segítünk rendszerezett maradni. Engedélyezze az értesítéseket, hogy emlékeztetőket hozzon létre a bevásárlólistáihoz, és soha ne felejtsen el semmit.",
    understoodButton: "Értettem"
  },
  ja: {
    title: "ショッピングの通知",
    message: "整理整頓をサポートするために. 通知を有効にして、買い物リストのリマインダーを作成し、項目を忘れないようにしましょう。",
    understoodButton: "了解"
  },
  hi: {
    title: "आपकी खरीदारी के लिए सूचनाएं",
    message: "आपको संगठित रहने में मदद करने के लिए. अपनी खरीदारी की सूची के लिए अनुस्मारक बनाने और किसी वस्तु को न भूलने के लिए सूचनाएं सक्षम करें।",
    understoodButton: "समझ गया"
  },
  nl: {
    title: "Meldingen voor je boodschappen",
    message: "Om je te helpen georganiseerd te blijven. Schakel meldingen in om herinneringen voor je boodschappenlijsten te maken en vergeet nooit een artikel.",
    understoodButton: "Begrepen"
  },
  // Agrega más idiomas según sea necesario
};

const NotificationPermissionModal = ({ visible, onAccept }) => {
  const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const currentLabels = labels[deviceLanguage] || labels['en'];

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onAccept}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Image 
            source={require('./assets/images/notifshop.png')} // Reemplaza con la ruta correcta a tu imagen
            style={styles.image}
          />
          <Text style={styles.title}>{currentLabels.title}</Text>
          <Text style={styles.message}>{currentLabels.message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onAccept}>
              <Text style={styles.buttonText}>{currentLabels.understoodButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>  
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    color: '#575757',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});

export default NotificationPermissionModal;
