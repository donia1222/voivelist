import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// Contenido de privacidad actualizado y moderno
const privacyData = {
  header: {
    title: "Privacy Policy",
    subtitle: "Your Privacy is Our Priority",
    lastUpdated: "September 2025"
  },
  summary: {
    title: "Summary: We Don't Store Anything",
    subtitle: "Your privacy in 4 clear points:",
    points: [
      { icon: "close-circle", color: "#e74c3c", text: "No accounts created" },
      { icon: "lock-closed", color: "#9b59b6", text: "No personal data requested (name, email, phone, addresses)" },
      { icon: "eye-off", color: "#3498db", text: "No behavioral analytics or personalized advertising" },
      { icon: "cash", color: "#ff6b35", text: "No data sales" }
    ],
    footer: "Everything remains on your device. We store absolutely nothing."
  },
  sections: [
    {
      title: "Data Storage",
      icon: "home",
      color: "#9b59b6",
      content: [
        {
          subtitle: "🏠 100% Local Storage",
          text: "All your shopping lists, voice recordings processing, and settings are stored exclusively on your device. We have no access to this information."
        },
        {
          subtitle: "☁️ No Cloud Servers",
          text: "We don't have databases or cloud servers that store your personal information. Your data never leaves your device unless you choose to export or share it."
        },
        {
          subtitle: "👤 No User Accounts", 
          text: "The app works without creating user accounts, meaning we don't collect or store personal identification information like names, email addresses, or phone numbers."
        }
      ]
    },
    {
      title: "Voice Processing with AI",
      icon: "mic",
      color: "#ff6b35",
      content: [
        {
          subtitle: "🤖 Anonymous Processing",
          text: "Voice messages sent to AI are processed anonymously through ChatGPT API. No personal information is included in these requests."
        },
        {
          subtitle: "💬 No Voice Storage",
          text: "We don't store voice recordings or conversation history on our servers. All voice data remains on your device."
        },
        {
          subtitle: "📸 Image Analysis",
          text: "Images analyzed by AI are processed temporarily and are not stored on external servers."
        }
      ]
    },
    {
      title: "Subscriptions",
      icon: "card",
      color: "#3498db",
      content: [
        {
          subtitle: "💳 Purchase Management",
          text: "Purchases are managed by Apple App Store / Google Play. To validate your subscription we use RevenueCat, sending only:"
        },
        {
          subtitle: "📊 RevenueCat Data:",
          text: "• A random identifier, limited to the app (app-scoped, doesn't personally identify you)\n• Purchase receipt provided by Apple/Google\n\nPurpose: This ID is used exclusively to manage subscription (activate/restore) and is not linked to your real identity."
        }
      ]
    },
    {
      title: "Third Party Services",
      icon: "link",
      color: "#2ecc71",
      content: [
        {
          subtitle: "🔗 External Services",
          text: "The app may send data to external services (e.g. ChatGPT for voice processing, RevenueCat for subscriptions). This data is processed anonymously and doesn't allow personal identification."
        },
        {
          subtitle: "📋 Privacy Policies:",
          text: "• OpenAI: https://openai.com/policies\n• RevenueCat: https://www.revenuecat.com/privacy\n• App stores for distribution and payments"
        }
      ]
    },
    {
      title: "Data Security",
      icon: "shield-checkmark",
      color: "#e74c3c",
      content: [
        {
          subtitle: "🔒 Device Security",
          text: "Since all data is stored locally on your device, data security depends on your device's security measures. We recommend using device encryption and secure lock screens."
        }
      ]
    },
    {
      title: "Contact",
      icon: "mail",
      color: "#95a5a6",
      content: [
        {
          subtitle: "📧 Questions?",
          text: "If you have questions about this Privacy Policy, contact us at: info@lweb.ch"
        }
      ]
    }
  ]
};

const PrivacyModal = ({ visible, onClose }) => {
    return (
<Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={onClose}
>
    <GestureHandlerRootView style={styles.container}>
        <PanGestureHandler
            onGestureEvent={(event) => {
                if (event.nativeEvent.translationY > 50 && event.nativeEvent.velocityY > 0) {
                    onClose();
                }
            }}
            onHandlerStateChange={(event) => {
                if (event.nativeEvent.state === State.END) {
                    // Puedes añadir lógica adicional aquí si es necesario
                }
            }}
        >
            <View style={styles.container}>
                {/* Handle bar */}
                <View style={styles.handleBar} />
                
                {/* Close button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
                
                <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerIconContainer}>
                            <Ionicons name="shield-checkmark" size={32} color="#9b59b6" />
                        </View>
                        <Text style={styles.headerTitle}>{privacyData.header.title}</Text>
                        <Text style={styles.headerSubtitle}>{privacyData.header.subtitle}</Text>
                        <Text style={styles.lastUpdated}>Last updated: {privacyData.header.lastUpdated}</Text>
                    </View>

                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>{privacyData.summary.title}</Text>
                        <Text style={styles.summarySubtitle}>{privacyData.summary.subtitle}</Text>
                        
                        {privacyData.summary.points.map((point, index) => (
                            <View key={index} style={styles.summaryPoint}>
                                <View style={[styles.summaryIcon, { backgroundColor: `${point.color}20` }]}>
                                    <Ionicons name={point.icon} size={20} color={point.color} />
                                </View>
                                <Text style={styles.summaryPointText}>{point.text}</Text>
                            </View>
                        ))}
                        
                        <Text style={styles.summaryFooter}>{privacyData.summary.footer}</Text>
                    </View>

                    {/* Sections */}
                    {privacyData.sections.map((section, sectionIndex) => (
                        <View key={sectionIndex} style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}20` }]}>
                                    <Ionicons name={section.icon} size={24} color={section.color} />
                                </View>
                                <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title}</Text>
                            </View>
                            
                            {section.content.map((content, contentIndex) => (
                                <View key={contentIndex} style={styles.contentBlock}>
                                    <Text style={styles.contentSubtitle}>{content.subtitle}</Text>
                                    <Text style={styles.contentText}>{content.text}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                    
                    {/* Bottom padding */}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </PanGestureHandler>
    </GestureHandlerRootView>
</Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9ff', // Fondo lila muy suave
        paddingTop: 30
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#e5e7eb',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    modalContent: {
        padding: 20,
        paddingTop: 20
    },
    header: {
        alignItems: 'center',
        marginBottom: 24
    },
    headerIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f3e8ff', // Lila muy claro
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#4c1d95', // Morado oscuro
        textAlign: 'center',
        marginBottom: 4
    },
    headerSubtitle: {
        fontSize: 18,
        color: '#7c3aed', // Lila medio
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 8
    },
    lastUpdated: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        fontStyle: 'italic'
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#9b59b6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#9b59b6'
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4c1d95',
        marginBottom: 4
    },
    summarySubtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 16
    },
    summaryPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    summaryIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    summaryPointText: {
        flex: 1,
        fontSize: 15,
        color: '#374151',
        fontWeight: '500'
    },
    summaryFooter: {
        fontSize: 16,
        color: '#4c1d95',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb'
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1
    },
    contentBlock: {
        marginBottom: 16
    },
    contentSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 6
    },
    contentText: {
        fontSize: 15,
        color: '#4b5563',
        lineHeight: 22
    }
});

export default PrivacyModal;