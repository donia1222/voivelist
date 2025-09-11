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