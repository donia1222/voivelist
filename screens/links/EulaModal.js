import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';

// Contenido de términos moderno y adaptado para BuyVoice
const termsData = {
  header: {
    title: "Terms of Service",
    subtitle: "Last updated: September 2025"
  },
  sections: [
    {
      title: "Acceptance of Terms",
      icon: "checkmark-circle",
      color: "#2ecc71",
      content: [
        {
          text: "By downloading, installing or using BuyVoice, you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use the app."
        }
      ]
    },
    {
      title: "License to Use",
      icon: "document-text",
      color: "#3498db",
      content: [
        {
          subtitle: "✅ What you can do:",
          text: "We grant you a limited, non-exclusive, non-transferable and revocable license to use BuyVoice for your personal use on devices you control."
        },
        {
          subtitle: "❌ What you cannot do:",
          text: "• Copy, modify or distribute the app\n• Reverse engineer the app\n• Use the app for illegal purposes\n• Violate intellectual property rights"
        }
      ]
    },
    {
      title: "Premium Subscriptions",
      icon: "star",
      color: "#ff6b35",
      content: [
        {
          subtitle: "🌟 Premium Features:",
          text: "Premium subscription unlocks unlimited voice lists, image analysis (limited to 10 analyses every 10 hours), advanced AI processing, and priority support."
        },
        {
          subtitle: "💳 Billing:",
          text: "Subscriptions are billed through your app store. Payment is charged upon purchase confirmation."
        },
        {
          subtitle: "🔄 Cancellation:",
          text: "You can cancel your subscription anytime from your app store settings. Cancellation will be effective at the end of the current period."
        }
      ]
    },
    {
      title: "AI Services",
      icon: "mic",
      color: "#9b59b6",
      content: [
        {
          subtitle: "🤖 Voice Processing:",
          text: "The voice recognition uses ChatGPT API. By using this feature, you understand that AI responses are generated automatically and may not always be accurate."
        },
        {
          subtitle: "📸 Image Analysis:",
          text: "Image processing uses AI to recognize shopping lists from photos. Subscribers are limited to 10 image analyses every 10 hours to maintain affordable pricing and ensure fair usage. We are not responsible for decisions made based on AI responses."
        }
      ]
    },
    {
      title: "User Responsibilities",
      icon: "person",
      color: "#e74c3c",
      content: [
        {
          subtitle: "📱 You are responsible for:",
          text: "• Maintaining the confidentiality of your device\n• All activity that occurs on your device\n• Making regular backups of your data\n• Using the app in accordance with applicable laws"
        }
      ]
    },
    {
      title: "Prohibited Uses",
      icon: "ban",
      color: "#95a5a6",
      content: [
        {
          subtitle: "🚫 You must not:",
          text: "• Use the app for illegal or fraudulent activities\n• Attempt to hack or compromise app security\n• Use the app to track others without consent\n• Violate privacy or data protection laws"
        }
      ]
    },
    {
      title: "Disclaimer",
      icon: "warning",
      color: "#f39c12",
      content: [
        {
          subtitle: "⚠️ \"AS IS\" Provision:",
          text: "THE APP IS PROVIDED \"AS IS\" WITHOUT WARRANTIES. We do not guarantee that the app will be uninterrupted, error-free or completely secure. You use the app at your own risk."
        }
      ]
    },
    {
      title: "Limitation of Liability",
      icon: "shield-checkmark",
      color: "#e74c3c",
      content: [
        {
          text: "We shall not be liable for indirect, incidental, special or consequential damages arising from the use or inability to use the app, even if we have been advised of the possibility of such damages."
        }
      ]
    },
    {
      title: "Applicable Law",
      icon: "library",
      color: "#34495e",
      content: [
        {
          text: "These terms shall be governed and interpreted in accordance with the laws of the European Union, without regard to its conflicts of legal provisions."
        }
      ]
    },
    {
      title: "Changes to Terms",
      icon: "refresh",
      color: "#1abc9c",
      content: [
        {
          text: "We reserve the right to modify these terms at any time. Changes will take effect immediately after publication in the app."
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
          text: "If you have questions about these Terms of Service, contact us at: info@lweb.ch"
        }
      ]
    }
  ]
};

const EulaModal = ({ visible, onClose }) => {
    return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>

                    {/* Sections */}
                    {termsData.sections.map((section, sectionIndex) => (
                        <View key={sectionIndex} style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}20` }]}>
                                    <Ionicons name={section.icon} size={24} color={section.color} />
                                </View>
                                <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title}</Text>
                            </View>
                            
                            {section.content.map((content, contentIndex) => (
                                <View key={contentIndex} style={styles.contentBlock}>
                                    {content.subtitle && (
                                        <Text style={styles.contentSubtitle}>{content.subtitle}</Text>
                                    )}
                                    <Text style={styles.contentText}>{content.text}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                    
                    {/* Bottom padding */}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
      backgroundColor: '#e7ead2',
        paddingTop: 30
    },
    handleBar: {
        width: 40,
        height: 4,

        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8
    },
    closeButton: {
        position: 'absolute',
        top: 6,
        right: 16,
        zIndex: 10,
        width: 30,
        height: 30,
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
        backgroundColor: '#dbeafe', // Azul muy claro
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1e40af', // Azul oscuro
        textAlign: 'center',
        marginBottom: 4
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        fontStyle: 'italic'
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

export default EulaModal;