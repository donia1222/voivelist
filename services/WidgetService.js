import { NativeModules, Platform } from 'react-native';

const { WidgetDataBridge } = NativeModules;

// Debug: Check if WidgetDataBridge is available
console.log('🔍 DEBUG: WidgetService - Platform.OS:', Platform.OS);
console.log('🔍 DEBUG: WidgetService - WidgetDataBridge available:', !!WidgetDataBridge);
console.log('🔍 DEBUG: WidgetService - Available native modules:', Object.keys(NativeModules));
if (WidgetDataBridge) {
  console.log('✅ DEBUG: WidgetService - WidgetDataBridge methods:', Object.keys(WidgetDataBridge));
} else {
  console.log('❌ DEBUG: WidgetService - WidgetDataBridge is null/undefined');
}

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
      console.log('🚫 DEBUG: WidgetService - Platform is not iOS or WidgetDataBridge not available');
      return;
    }
    
    console.log('🔍 DEBUG: WidgetService - Starting updateWidgetShoppingLists');
    console.log('🔍 DEBUG: WidgetService - Raw history:', JSON.stringify(history, null, 2));
    console.log('🔍 DEBUG: WidgetService - isSubscribed:', isSubscribed);
    
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
      
      console.log('📤 DEBUG: WidgetService - Processed shopping lists:', JSON.stringify(shoppingLists, null, 2));
      console.log('📤 DEBUG: WidgetService - Number of lists:', shoppingLists.length);
      
      // Store shopping lists as JSON data
      await WidgetDataBridge.updateShoppingLists(shoppingLists);
      
      // Also store subscription status  
      // await WidgetDataBridge.updateSubscriptionStatus(isSubscribed); // TODO: Fix this method
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