import Foundation
import React
import WidgetKit

@objc(WidgetDataBridge)
class WidgetDataBridge: NSObject, RCTBridgeModule {
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc
    static func moduleName() -> String {
        return "WidgetDataBridge"
    }
    
    @objc
    func updateWidgetData(_ favorites: [String], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
            sharedDefaults?.set(favorites, forKey: "favoritesList")
            sharedDefaults?.synchronize()
            
            // Reload widget timeline
            if #available(iOS 14.0, *) {
                WidgetKit.WidgetCenter.shared.reloadAllTimelines()
            }
            
            resolver(true)
        }
    }
    
    @objc
    func getWidgetData(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
        let favorites = sharedDefaults?.array(forKey: "favoritesList") as? [String] ?? []
        resolver(favorites)
    }
    
    @objc
    func updateShoppingLists(_ lists: [[String: Any]], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        print("💾 DEBUG: WidgetDataBridge - Received lists to store: \(lists)")
        print("💾 DEBUG: WidgetDataBridge - Number of lists received: \(lists.count)")
        
        DispatchQueue.main.async {
            let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
            print("💾 DEBUG: WidgetDataBridge - App Group UserDefaults created: \(sharedDefaults != nil)")
            
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: lists, options: [])
                print("💾 DEBUG: WidgetDataBridge - JSON serialized successfully, size: \(jsonData.count) bytes")
                
                sharedDefaults?.set(jsonData, forKey: "shoppingLists")
                let success = sharedDefaults?.synchronize() ?? false
                print("💾 DEBUG: WidgetDataBridge - Data stored and synchronized: \(success)")
                
                // Test immediate readback
                if let testData = sharedDefaults?.data(forKey: "shoppingLists") {
                    print("✅ DEBUG: WidgetDataBridge - Can immediately read back data: \(testData.count) bytes")
                } else {
                    print("❌ DEBUG: WidgetDataBridge - ERROR - Cannot read back data immediately!")
                }
                
                // Reload widget timeline
                if #available(iOS 14.0, *) {
                    WidgetKit.WidgetCenter.shared.reloadAllTimelines()
                    print("🔄 DEBUG: WidgetDataBridge - Widget timeline reload requested")
                }
                
                resolver(true)
            } catch {
                print("❌ DEBUG: WidgetDataBridge - Serialization error: \(error)")
                rejecter("SERIALIZATION_ERROR", "Failed to serialize shopping lists", error)
            }
        }
    }
    
    @objc
    func updateSubscriptionStatus(_ isSubscribed: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
            sharedDefaults?.set(isSubscribed, forKey: "isSubscribed")
            sharedDefaults?.synchronize()
            
            // Reload widget timeline
            if #available(iOS 14.0, *) {
                WidgetKit.WidgetCenter.shared.reloadAllTimelines()
            }
            
            resolver(true)
        }
    }
    
    @objc
    func clearWidgetData(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
        sharedDefaults?.removeObject(forKey: "favoritesList")
        sharedDefaults?.removeObject(forKey: "shoppingLists")
        sharedDefaults?.removeObject(forKey: "isSubscribed")
        sharedDefaults?.synchronize()
        
        // Reload widget timeline
        if #available(iOS 14.0, *) {
            WidgetKit.WidgetCenter.shared.reloadAllTimelines()
        }
        
        resolver(true)
    }
    
    @objc
    func syncWidgetChangesToApp(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
        print("🔍 DEBUG: syncWidgetChangesToApp - Starting sync process")
        print("🔍 DEBUG: syncWidgetChangesToApp - SharedDefaults created: \(sharedDefaults != nil)")
        
        // Let's always check what keys exist in UserDefaults for debugging
        if let defaults = sharedDefaults {
            let allKeys = defaults.dictionaryRepresentation().keys
            print("🔍 DEBUG: syncWidgetChangesToApp - Available keys in UserDefaults: \(Array(allKeys))")
            
            // Try to read widgetChanges directly
            if let data = defaults.data(forKey: "widgetChanges") {
                print("✅ DEBUG: Found widgetChanges data: \(data.count) bytes")
            } else {
                print("❌ DEBUG: No widgetChanges key found")
            }
        }
        
        // Check if there are widget changes to sync
        guard let changeData = sharedDefaults?.data(forKey: "widgetChanges") else {
            print("❌ DEBUG: syncWidgetChangesToApp - No widget changes found in UserDefaults")
            resolver(nil) // No changes to sync
            return
        }
        
        print("✅ DEBUG: syncWidgetChangesToApp - Found widget changes data: \(changeData.count) bytes")
        
        do {
            // Parse the widget changes - now it's an array of changes
            let changes = try JSONSerialization.jsonObject(with: changeData, options: []) as? [[String: Any]]
            
            // Clear the changes after reading (prevent double processing)
            sharedDefaults?.removeObject(forKey: "widgetChanges")
            sharedDefaults?.synchronize()
            
            print("🔄 DEBUG: WidgetDataBridge - Synced \(changes?.count ?? 0) widget changes to app")
            resolver(changes)
        } catch {
            print("❌ DEBUG: WidgetDataBridge - Error parsing widget changes: \(error)")
            rejecter("PARSE_ERROR", "Failed to parse widget changes", error)
        }
    }
}