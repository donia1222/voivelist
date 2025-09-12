import Foundation
import React
import WidgetKit

@objc(WidgetDataBridge)
class WidgetDataBridge: NSObject {
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
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
        DispatchQueue.main.async {
            let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
            
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: lists, options: [])
                sharedDefaults?.set(jsonData, forKey: "shoppingLists")
                sharedDefaults?.synchronize()
                
                // Reload widget timeline
                if #available(iOS 14.0, *) {
                    WidgetKit.WidgetCenter.shared.reloadAllTimelines()
                }
                
                resolver(true)
            } catch {
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