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
                
                // Reload widget timeline more aggressively
                if #available(iOS 14.0, *) {
                    WidgetKit.WidgetCenter.shared.reloadAllTimelines()
                    // Also reload specific widget kind
                    WidgetKit.WidgetCenter.shared.reloadTimelines(ofKind: "VoiceListWidget")
                    print("🔄 DEBUG: WidgetDataBridge - Widget timeline reload requested (both all and specific)")
                    
                    // Force additional reload after short delay
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        WidgetKit.WidgetCenter.shared.reloadAllTimelines()
                        WidgetKit.WidgetCenter.shared.reloadTimelines(ofKind: "VoiceListWidget")
                        print("🔄 DEBUG: WidgetDataBridge - Delayed widget reload executed")
                    }
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
}