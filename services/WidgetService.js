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
  
  static async updateWidgetShoppingLists(history, completedItems = {}) {
    if (Platform.OS !== 'ios' || !WidgetDataBridge) {
      console.log('🚫 DEBUG: WidgetService - Platform is not iOS or WidgetDataBridge not available');
      return;
    }
    
    console.log('🔍 DEBUG: WidgetService - Starting updateWidgetShoppingLists');
    console.log('🔍 DEBUG: WidgetService - Raw history:', JSON.stringify(history, null, 2));
    console.log('🔍 DEBUG: WidgetService - CompletedItems:', JSON.stringify(completedItems, null, 2));
    
    try {
      // Convert history to shopping lists format with completed items info
      const shoppingLists = history.slice(0, 5).map((item, listIndex) => ({
        name: item.name || 'Shopping List',
        items: Array.isArray(item.list) ? item.list.slice(0, 12).map((listItem, itemIndex) => {
          const itemText = typeof listItem === 'string' ? listItem : 
                          (listItem && listItem.text) ? listItem.text :
                          (listItem && listItem.name) ? listItem.name : String(listItem);
          
          const isCompleted = completedItems[listIndex] && completedItems[listIndex].includes(itemIndex);
          
          return {
            text: itemText,
            isCompleted: isCompleted
          };
        }).filter(item => item.text && item.text.length > 0) : [],
        completedItems: completedItems[listIndex] || []
      })).filter(list => list.items.length > 0);
      
      console.log('📤 DEBUG: WidgetService - Processed shopping lists with completion:', JSON.stringify(shoppingLists, null, 2));
      console.log('📤 DEBUG: WidgetService - Number of lists:', shoppingLists.length);
      
      // Store shopping lists as JSON data
      await WidgetDataBridge.updateShoppingLists(shoppingLists);
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
  
  static async syncWidgetChangesToApp() {
    if (Platform.OS !== 'ios' || !WidgetDataBridge) {
      return null;
    }
    
    try {
      const changes = await WidgetDataBridge.syncWidgetChangesToApp();
      console.log('🔄 DEBUG: WidgetService - Synced widget changes:', changes);
      return changes;
    } catch (error) {
      console.log('Error syncing widget changes:', error);
      return null;
    }
  }
}

export default WidgetService;