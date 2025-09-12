import { NativeModules, Platform } from 'react-native';

const { WidgetDataBridge } = NativeModules;

class WidgetService {
  static async updateWidgetFavorites(favorites) {
    if (Platform.OS !== 'ios' || !WidgetDataBridge) {
      return;
    }
    
    try {
      // Convert to array of strings if needed
      const favoritesArray = Array.isArray(favorites) ? favorites : [];
      const stringArray = favoritesArray.map(item => {
        if (typeof item === 'string') return item;
        if (item && item.text) return item.text;
        if (item && item.name) return item.name;
        return String(item);
      }).filter(item => item && item.length > 0);
      
      await WidgetDataBridge.updateWidgetData(stringArray);
    } catch (error) {
      console.log('Error updating widget data:', error);
    }
  }
  
  static async updateWidgetShoppingLists(history, isSubscribed = false) {
    if (Platform.OS !== 'ios' || !WidgetDataBridge) {
      return;
    }
    
    try {
      // Convert history to shopping lists format
      const shoppingLists = history.slice(0, 5).map(item => ({
        name: item.name || 'Shopping List',
        items: Array.isArray(item.list) ? item.list.slice(0, 10).map(listItem => {
          if (typeof listItem === 'string') return listItem;
          if (listItem && listItem.text) return listItem.text;
          if (listItem && listItem.name) return listItem.name;
          return String(listItem);
        }).filter(i => i && i.length > 0) : []
      })).filter(list => list.items.length > 0);
      
      console.log('WidgetService: Sending to widget:', JSON.stringify(shoppingLists, null, 2));
      console.log('WidgetService: User subscription status:', isSubscribed);
      
      // Store shopping lists as JSON data
      await WidgetDataBridge.updateShoppingLists(shoppingLists);
      
      // Also store subscription status
      await WidgetDataBridge.updateSubscriptionStatus(isSubscribed);
    } catch (error) {
      console.log('Error updating widget shopping lists:', error);
    }
  }
  
  static async getWidgetFavorites() {
    if (Platform.OS !== 'ios' || !WidgetDataBridge) {
      return [];
    }
    
    try {
      const favorites = await WidgetDataBridge.getWidgetData();
      return favorites || [];
    } catch (error) {
      console.log('Error getting widget data:', error);
      return [];
    }
  }
  
  static async clearWidgetFavorites() {
    if (Platform.OS !== 'ios' || !WidgetDataBridge) {
      return;
    }
    
    try {
      await WidgetDataBridge.clearWidgetData();
    } catch (error) {
      console.log('Error clearing widget data:', error);
    }
  }
}

export default WidgetService;