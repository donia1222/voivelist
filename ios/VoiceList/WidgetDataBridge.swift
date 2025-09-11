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
            let sharedDefaults = UserDefaults(suiteName: "group.com.roberto.worktrack")
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
        let sharedDefaults = UserDefaults(suiteName: "group.com.roberto.worktrack")
        let favorites = sharedDefaults?.array(forKey: "favoritesList") as? [String] ?? []
        resolver(favorites)
    }
    
    @objc
    func clearWidgetData(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        let sharedDefaults = UserDefaults(suiteName: "group.com.roberto.worktrack")
        sharedDefaults?.removeObject(forKey: "favoritesList")
        sharedDefaults?.synchronize()
        
        // Reload widget timeline
        if #available(iOS 14.0, *) {
            WidgetKit.WidgetCenter.shared.reloadAllTimelines()
        }
        
        resolver(true)
    }
}