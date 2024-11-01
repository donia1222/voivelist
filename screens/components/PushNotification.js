import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const configurePushNotifications = (navigationRef) => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      navigationRef.current?.navigate('HistoryScreen');
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    popInitialNotification: true,
    requestPermissions: false,
  });

  // Create a channel for Android
  PushNotification.createChannel(
    {
      channelId: "default-channel-id", // (required)
      channelName: "Default channel", // (required)
      channelDescription: "A default channel", // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
};

const requestNotificationPermission = async () => {
  try {
    const granted = await PushNotificationIOS.requestPermissions({
      alert: true,
      badge: true,
      sound: true,
    });

    if (granted.alert || granted.badge || granted.sound) {
      console.log('Push Notification Permissions Granted:', granted);
    } else {
      console.log('Push Notification Permissions Denied');
    }
  } catch (error) {
    console.log('Error requesting push notification permissions:', error);
  }
};

export { configurePushNotifications, requestNotificationPermission };
