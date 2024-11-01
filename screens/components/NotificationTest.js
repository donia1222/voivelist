// NotificationTest.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import PushNotification from 'react-native-push-notification';

const NotificationTest = () => {
  const sendScheduledNotification = () => {
    const date = new Date(Date.now() + 60 * 1000); // 60 * 1000 ms = 1 minute
    PushNotification.localNotificationSchedule({
      title: 'Scheduled Test Notification', // (optional)
      message: 'This notification was scheduled to show after 1 minute', // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown, default: 'default'
      date, // Schedule notification for 1 minute later
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Send Scheduled Notification" onPress={sendScheduledNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationTest;
