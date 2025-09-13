import WidgetKit
import SwiftUI
import AppIntents

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), favoritesList: [], shoppingLists: [], isEmpty: true, isSubscribed: false)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let sampleLists = [
            ShoppingList(name: "Grocery", items: [
                ShoppingListItem(text: "Milk", isCompleted: false),
                ShoppingListItem(text: "Bread", isCompleted: true),
                ShoppingListItem(text: "Eggs", isCompleted: false)
            ]),
            ShoppingList(name: "Market", items: [
                ShoppingListItem(text: "Tomatoes", isCompleted: false),
                ShoppingListItem(text: "Cheese", isCompleted: false),
                ShoppingListItem(text: "Apples", isCompleted: true)
            ])
        ]
        let entry = SimpleEntry(date: Date(), favoritesList: getSampleData(), shoppingLists: sampleLists, isEmpty: false, isSubscribed: true)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        print("⏰ DEBUG: Widget getTimeline() called")
        var entries: [SimpleEntry] = []
        
        let favorites = loadFavorites()
        let shoppingLists = loadShoppingLists()
        let isSubscribed = loadSubscriptionStatus()
        let currentDate = Date()
        let isEmpty = shoppingLists.isEmpty && favorites.isEmpty
        
        print("⏰ DEBUG: Widget timeline - \(shoppingLists.count) shopping lists, isEmpty: \(isEmpty)")
        
        let entry = SimpleEntry(date: currentDate, favoritesList: favorites, shoppingLists: shoppingLists, isEmpty: isEmpty, isSubscribed: isSubscribed)
        entries.append(entry)
        
        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
    
    func loadFavorites() -> [String] {
        let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
        return sharedDefaults?.array(forKey: "favoritesList") as? [String] ?? []
    }
    
    func loadSubscriptionStatus() -> Bool {
        let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
        return sharedDefaults?.bool(forKey: "isSubscribed") ?? false
    }
    
    func loadShoppingLists() -> [ShoppingList] {
        let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
        print("🔍 DEBUG: Widget - Starting loadShoppingLists()")
        print("🔍 DEBUG: Widget - App Group UserDefaults created: \(sharedDefaults != nil)")
        
        // Try to load shopping lists from shared storage
        if let listsData = sharedDefaults?.data(forKey: "shoppingLists") {
            print("✅ DEBUG: Widget - Found shoppingLists data, size: \(listsData.count) bytes")
            
            // Try to decode as raw JSON first to see structure
            if let jsonObject = try? JSONSerialization.jsonObject(with: listsData, options: []) {
                print("🔍 DEBUG: Widget - Raw JSON data: \(jsonObject)")
            }
            
            if let lists = try? JSONDecoder().decode([ShoppingListData].self, from: listsData) {
                print("✅ DEBUG: Widget - Successfully decoded \(lists.count) shopping lists")
                for (index, list) in lists.enumerated() {
                    print("📋 DEBUG: Widget - List \(index): '\(list.name)' with \(list.items.count) items")
                    for item in list.items {
                        print("  📝 DEBUG: Widget - Item: '\(item.text)', completed: \(item.isCompleted)")
                    }
                }
                let result = lists.map { listData in
                    ShoppingList(name: listData.name, items: listData.items.map { itemData in
                        ShoppingListItem(text: itemData.text, isCompleted: itemData.isCompleted)
                    })
                }
                print("🎯 DEBUG: Widget - Returning \(result.count) shopping lists to display")
                return result
            } else {
                print("❌ DEBUG: Widget - ERROR - Failed to decode JSON data with JSONDecoder")
                
                // Try manual parsing as fallback - legacy format
                if let jsonArray = try? JSONSerialization.jsonObject(with: listsData, options: []) as? [[String: Any]] {
                    print("🔄 DEBUG: Widget - Attempting manual JSON parsing...")
                    let manualLists = jsonArray.compactMap { dict -> ShoppingList? in
                        guard let name = dict["name"] as? String else { return nil }
                        
                        // Check for new format with item objects
                        if let itemsData = dict["items"] as? [[String: Any]] {
                            let items = itemsData.compactMap { itemDict -> ShoppingListItem? in
                                guard let text = itemDict["text"] as? String else { return nil }
                                let isCompleted = itemDict["isCompleted"] as? Bool ?? false
                                return ShoppingListItem(text: text, isCompleted: isCompleted)
                            }
                            return ShoppingList(name: name, items: items)
                        }
                        // Fallback to old format with string array
                        else if let items = dict["items"] as? [String] {
                            let shoppingItems = items.map { ShoppingListItem(text: $0, isCompleted: false) }
                            return ShoppingList(name: name, items: shoppingItems)
                        }
                        
                        return nil
                    }
                    print("🔄 DEBUG: Widget - Manual parsing result: \(manualLists.count) lists")
                    return manualLists
                }
            }
        } else {
            print("❌ DEBUG: Widget - No shoppingLists data found in App Group")
        }
        
        // Fallback to favorites if no lists available
        let favorites = loadFavorites()
        print("🔄 DEBUG: Widget - Fallback to favorites - found \(favorites.count) favorites")
        
        if !favorites.isEmpty {
            print("🔄 DEBUG: Widget - Using favorites as fallback list")
            let favoriteItems = favorites.map { ShoppingListItem(text: $0, isCompleted: false) }
            return [ShoppingList(name: "Favorites", items: favoriteItems)]
        }
        
        print("⚠️ DEBUG: Widget - No data found - widget will show empty state")
        return []
    }
    
    func getSampleData() -> [String] {
        return ["Milk", "Bread", "Eggs", "Tomatoes", "Cheese"]
    }
}

struct ShoppingList {
    let name: String
    let items: [ShoppingListItem]
}

struct ShoppingListItem {
    let text: String
    let isCompleted: Bool
}

struct ShoppingListData: Codable {
    let name: String
    var items: [ShoppingListItemData]
    let completedItems: [Int]
}

struct ShoppingListItemData: Codable {
    let text: String
    let isCompleted: Bool
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let favoritesList: [String] // Para compatibilidad
    let shoppingLists: [ShoppingList] // Nueva estructura para múltiples listas
    let isEmpty: Bool
    let isSubscribed: Bool // Estado de suscripción
}

struct VoiceListWidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family
    
    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

struct SmallWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        if !entry.shoppingLists.isEmpty {
            // Show shopping list
            let currentList = entry.shoppingLists.first!
            VStack(alignment: .leading, spacing: 5) {
                HStack(spacing: 5) {
                    if let ui = UIImage(named: "icono34") {
                        Image(uiImage: ui)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 32, height: 32)
                    }
                    Text(currentList.name)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "1F2937"))
                    Spacer()
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    ForEach(Array(currentList.items.prefix(4).enumerated()), id: \.offset) { index, item in
                        if #available(iOS 16.0, *) {
                            Button(intent: ToggleItemIntent(listIndex: 0, itemIndex: index)) {
                            HStack(spacing: 6) {
                                Circle()
                                    .fill(item.isCompleted ? Color.red : Color(hex: "8B5CF6"))
                                    .frame(width: 6, height: 6)
                                Text(item.text)
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(item.isCompleted ? Color.red.opacity(0.6) : Color(hex: "4B5563"))
                                    .strikethrough(item.isCompleted)
                                    .lineLimit(1)
                                Spacer()
                            }
                        }
                        .buttonStyle(PlainButtonStyle())
                        } else {
                            // Fallback for iOS < 16 - opens app
                            Link(destination: URL(string: "voicelist://toggle-item/0/\(index)")!) {
                                HStack(spacing: 6) {
                                    Circle()
                                        .fill(item.isCompleted ? Color.red : Color(hex: "8B5CF6"))
                                        .frame(width: 6, height: 6)
                                    Text(item.text)
                                        .font(.system(size: 13))
                                        .foregroundColor(item.isCompleted ? Color.red.opacity(0.6) : Color(hex: "374151"))
                                        .strikethrough(item.isCompleted)
                                        .lineLimit(1)
                                    Spacer()
                                }
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    
                    if currentList.items.count > 4 {
                        Text("... and \(currentList.items.count - 4) more")
                            .font(.system(size: 10))
                            .foregroundColor(Color(hex: "6B7280"))
                            .italic()
                    }
                }
                
                Spacer()
            }
            .padding(.horizontal, 10)
            .padding(.top, 0)
            .padding(.bottom, 10)
            // Removed .widgetURL to allow individual button interactions
        } else {
            // Show buttons when no lists
            VStack(spacing: 12) {
            HStack {
                if let ui = UIImage(named: "icono34") {
                    Image(uiImage: ui)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                } else {
                    Image(systemName: "mic.circle.fill")
                        .font(.system(size: 24, weight: .semibold))
                        .foregroundColor(Color(hex: "8B5CF6"))
                }
                Text("Voice Grocery")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                Spacer()
            }
            .padding(.horizontal, 6)
            .shadow(color: .black.opacity(0.05), radius: 1, x: 0, y: 1)
            
            VStack(spacing: 10) {
                Link(destination: URL(string: "voicelist://home")!) {
                    VStack(spacing: 6) {
                        Image(systemName: "mic.fill")
                            .font(.system(size: 22, weight: .medium))
                            .foregroundColor(Color(hex: "8B5CF6"))
                    }
                    .frame(maxWidth: .infinity, minHeight: 48)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(hex: "8B5CF6").opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "8B5CF6"), lineWidth: 2)
                            )
                    )
                    .cornerRadius(12)
                    .shadow(color: Color(hex: "8B5CF6").opacity(0.2), radius: 3, x: 0, y: 1)
                }
                
                Link(destination: URL(string: "voicelist://upload")!) {
                    VStack(spacing: 6) {
                        Image(systemName: "photo.badge.plus")
                            .font(.system(size: 22, weight: .medium))
                            .foregroundColor(Color(hex: "F59E0B"))
                    }
                    .frame(maxWidth: .infinity, minHeight: 48)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(hex: "F59E0B").opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "F59E0B"), lineWidth: 2)
                            )
                    )
                    .cornerRadius(12)
                    .shadow(color: Color(hex: "F59E0B").opacity(0.2), radius: 3, x: 0, y: 1)
                }
            }
            .padding(.horizontal, 4)
            }
            .padding(12)
            .widgetURL(URL(string: "voicelist://create"))
        }
    }
}

struct MediumWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        if !entry.shoppingLists.isEmpty {
            // Show shopping list
            let currentList = entry.shoppingLists.first!
            VStack(spacing: 0) {
                // Header fijo arriba
                HStack {
                    if let ui = UIImage(named: "icono34") {
                        Image(uiImage: ui)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 32, height: 32)
                    }
                    Text(currentList.name)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "1F2937"))
                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.top, 4)
                .padding(.bottom, 12)
                
                // Lista de items (scrollable content)
                VStack(alignment: .leading, spacing: 3) {
                    ForEach(Array(currentList.items.prefix(4).enumerated()), id: \.offset) { index, item in
                        if #available(iOS 16.0, *) {
                            Button(intent: ToggleItemIntent(listIndex: 0, itemIndex: index)) {
                            HStack(spacing: 8) {
                                Circle()
                                    .fill(item.isCompleted ? Color.red : Color(hex: "8B5CF6"))
                                    .frame(width: 7, height: 7)
                                Text(item.text)
                                    .font(.system(size: 15, weight: .semibold))
                                    .foregroundColor(item.isCompleted ? Color.red.opacity(0.6) : Color(hex: "4B5563"))
                                    .strikethrough(item.isCompleted)
                                    .lineLimit(1)
                                Spacer()
                            }
                        }
                        .buttonStyle(PlainButtonStyle())
                        } else {
                            // Fallback for iOS < 16 - opens app
                            Link(destination: URL(string: "voicelist://toggle-item/0/\(index)")!) {
                                HStack(spacing: 6) {
                                    Circle()
                                        .fill(item.isCompleted ? Color.red : Color(hex: "8B5CF6"))
                                        .frame(width: 6, height: 6)
                                    Text(item.text)
                                        .font(.system(size: 13))
                                        .foregroundColor(item.isCompleted ? Color.red.opacity(0.6) : Color(hex: "374151"))
                                        .strikethrough(item.isCompleted)
                                        .lineLimit(1)
                                    Spacer()
                                }
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    
                    if currentList.items.count > 4 {
                        Text("... and \(currentList.items.count - 4) more")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "6B7280"))
                            .italic()
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, -2)
                
                Spacer()
            }
            // Removed .widgetURL to allow individual button interactions
        } else {
            // Show buttons when no lists
            VStack(spacing: 12) {
            HStack {
                if let ui = UIImage(named: "icono34") {
                    Image(uiImage: ui)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                } else {
                    Image(systemName: "mic.circle.fill")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "8B5CF6"))
                }
                Text("Voice Grocery")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)
            
            HStack(spacing: 8) {
                Link(destination: URL(string: "voicelist://home")!) {
                    VStack(spacing: 4) {
                        Image(systemName: "mic.fill")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color(hex: "8B5CF6"))
                        Text("Voice")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "8B5CF6"))
                    }
                    .frame(maxWidth: .infinity, minHeight: 50)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color(hex: "8B5CF6").opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color(hex: "8B5CF6"), lineWidth: 2)
                            )
                    )
                    .cornerRadius(10)
                    .shadow(color: Color(hex: "8B5CF6").opacity(0.2), radius: 2, x: 0, y: 1)
                }
                
                Link(destination: URL(string: "voicelist://upload")!) {
                    VStack(spacing: 4) {
                        Image(systemName: "photo.badge.plus")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color(hex: "F59E0B"))
                        Text("Upload")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "F59E0B"))
                    }
                    .frame(maxWidth: .infinity, minHeight: 50)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color(hex: "F59E0B").opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color(hex: "F59E0B"), lineWidth: 2)
                            )
                    )
                    .cornerRadius(10)
                    .shadow(color: Color(hex: "F59E0B").opacity(0.2), radius: 2, x: 0, y: 1)
                }
                
                Link(destination: URL(string: "voicelist://calculate")!) {
                    VStack(spacing: 4) {
                        Image(systemName: "plus.forwardslash.minus")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color(hex: "10B981"))
                        Text("Calculate")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                    .frame(maxWidth: .infinity, minHeight: 50)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color(hex: "10B981").opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color(hex: "10B981"), lineWidth: 2)
                            )
                    )
                    .cornerRadius(10)
                    .shadow(color: Color(hex: "10B981").opacity(0.2), radius: 2, x: 0, y: 1)
                }
            }
            .padding(.horizontal, 16)
            
            VStack(spacing: 6) {
                Text("Get started by creating your first list")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                
            }
            .padding(.horizontal, 16)
            
            Spacer()
        }
        .padding(.bottom, 8)
        .widgetURL(URL(string: "voicelist://create"))
        }
    }
}

struct LargeWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        if !entry.shoppingLists.isEmpty {
            // Show shopping list
            let currentList = entry.shoppingLists.first!
            VStack(spacing: 0) {
                // Header fijo arriba
                HStack(spacing: 5) {
                    if let ui = UIImage(named: "icono34") {
                        Image(uiImage: ui)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 37, height: 37)
                    }
                    Text(currentList.name)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Color(hex: "1F2937"))
                    Spacer()
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 6)
                
                // Lista de items (scrollable content)
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(Array(currentList.items.prefix(12).enumerated()), id: \.offset) { index, item in
                        if #available(iOS 16.0, *) {
                            Button(intent: ToggleItemIntent(listIndex: 0, itemIndex: index)) {
                            HStack(spacing: 10) {
                                Circle()
                                    .fill(item.isCompleted ? Color.red : Color(hex: "8B5CF6"))
                                    .frame(width: 12, height: 12)
                                Text(item.text)
                                    .font(.system(size: 16, weight: .semibold))
                                    .foregroundColor(item.isCompleted ? Color.red.opacity(0.6) : Color(hex: "4B5563"))
                                    .strikethrough(item.isCompleted)
                                    .lineLimit(1)
                                Spacer()
                            }
                        }
                        .buttonStyle(PlainButtonStyle())
                        } else {
                            // Fallback for iOS < 16 - opens app
                            Link(destination: URL(string: "voicelist://toggle-item/0/\(index)")!) {
                                HStack(spacing: 6) {
                                    Circle()
                                        .fill(item.isCompleted ? Color.red : Color(hex: "8B5CF6"))
                                        .frame(width: 6, height: 6)
                                    Text(item.text)
                                        .font(.system(size: 13))
                                        .foregroundColor(item.isCompleted ? Color.red.opacity(0.6) : Color(hex: "374151"))
                                        .strikethrough(item.isCompleted)
                                        .lineLimit(1)
                                    Spacer()
                                }
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    
                    if currentList.items.count > 10 {
                        Text("... and \(currentList.items.count - 10) more")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                            .italic()
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 5)
                
                Spacer()
            }
            // Removed .widgetURL to allow individual button interactions
        } else {
            // Show buttons when no lists
            VStack(spacing: 24) {
            HStack {
                if let ui = UIImage(named: "icono34") {
                    Image(uiImage: ui)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 32, height: 32)
                } else {
                    Image(systemName: "mic.circle.fill")
                        .font(.system(size: 28, weight: .semibold))
                        .foregroundColor(Color(hex: "8B5CF6"))
                }
                Text("Voice Grocery")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                Spacer()
            }
            .padding(.horizontal, 24)
            .padding(.top, 16)
            
            VStack(spacing: 12) {
                HStack(spacing: 12) {
                    Link(destination: URL(string: "voicelist://home")!) {
                        VStack(spacing: 4) {
                            Image(systemName: "mic.fill")
                                .font(.system(size: 26, weight: .medium))
                                .foregroundColor(Color(hex: "8B5CF6"))
                            Text("Voice")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "8B5CF6"))
                        }
                        .frame(width: 120, height: 120)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color(hex: "8B5CF6").opacity(0.1))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color(hex: "8B5CF6"), lineWidth: 2)
                                )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "8B5CF6").opacity(0.2), radius: 3, x: 0, y: 2)
                    }
                    
                    Link(destination: URL(string: "voicelist://upload")!) {
                        VStack(spacing: 4) {
                            Image(systemName: "photo.badge.plus")
                                .font(.system(size: 26, weight: .medium))
                                .foregroundColor(Color(hex: "F59E0B"))
                            Text("Upload")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "F59E0B"))
                        }
                        .frame(width: 120, height: 120)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color(hex: "F59E0B").opacity(0.1))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color(hex: "F59E0B"), lineWidth: 2)
                                )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "F59E0B").opacity(0.2), radius: 3, x: 0, y: 2)
                    }
                }
                
                HStack(spacing: 12) {
                    Link(destination: URL(string: "voicelist://calculate")!) {
                        VStack(spacing: 4) {
                            Image(systemName: "plus.forwardslash.minus")
                                .font(.system(size: 26, weight: .medium))
                                .foregroundColor(Color(hex: "10B981"))
                            Text("Calculate")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "10B981"))
                        }
                        .frame(width: 120, height: 120)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color(hex: "10B981").opacity(0.1))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color(hex: "10B981"), lineWidth: 2)
                                )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "10B981").opacity(0.2), radius: 3, x: 0, y: 2)
                    }
                    
                    Link(destination: URL(string: "voicelist://calendar")!) {
                        VStack(spacing: 4) {
                            Image(systemName: "calendar")
                                .font(.system(size: 26, weight: .medium))
                                .foregroundColor(Color(hex: "EF4444"))
                            Text("ShopCalendar")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "EF4444"))
                        }
                        .frame(width: 120, height: 120)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color(hex: "EF4444").opacity(0.1))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color(hex: "EF4444"), lineWidth: 2)
                                )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "EF4444").opacity(0.2), radius: 3, x: 0, y: 2)
                    }
                }
            }
            .padding(.horizontal, 24)
            
            Spacer()
        }
        .frame(maxHeight: .infinity)
        .widgetURL(URL(string: "voicelist://create"))
        }
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

struct VoiceListWidget: Widget {
    let kind: String = "VoiceListWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                VoiceListWidgetEntryView(entry: entry)
                    .containerBackground(
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color(hex: "FEF3C7"),
                                Color(hex: "F3E8FF")
                            ]),
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        for: .widget
                    )
            } else {
                VoiceListWidgetEntryView(entry: entry)
                    .background(
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color(hex: "FEF3C7"),
                                Color(hex: "F3E8FF")
                            ]),
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }
        }
        .configurationDisplayName("Voice Grocery")
        .description("Quick access to your shopping lists")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

#Preview(as: .systemSmall) {
    VoiceListWidget()
} timeline: {
    SimpleEntry(date: .now, favoritesList: ["Milk", "Bread", "Eggs"], shoppingLists: [ShoppingList(name: "Grocery", items: [ShoppingListItem(text: "Milk", isCompleted: false), ShoppingListItem(text: "Bread", isCompleted: true), ShoppingListItem(text: "Eggs", isCompleted: false)])], isEmpty: false, isSubscribed: true)
    SimpleEntry(date: .now, favoritesList: [], shoppingLists: [], isEmpty: true, isSubscribed: false)
}

// MARK: - Widget Helper Functions
@available(iOS 16.0, *)
func toggleItemInWidget(listIndex: Int, itemIndex: Int) {
    print("🎯 DEBUG: toggleItemInWidget - Toggle item \(itemIndex) in list \(listIndex)")
    
    // Access shared UserDefaults
    let sharedDefaults = UserDefaults(suiteName: "group.com.lwebch.VoiceList")
    
    // Load current shopping lists
    guard let listsData = sharedDefaults?.data(forKey: "shoppingLists"),
          let lists = try? JSONDecoder().decode([ShoppingListData].self, from: listsData) else {
        print("❌ DEBUG: toggleItemInWidget - Could not load shopping lists")
        return
    }
    
    var updatedLists = lists
    
    // Check if indices are valid
    guard listIndex >= 0 && listIndex < updatedLists.count,
          itemIndex >= 0 && itemIndex < updatedLists[listIndex].items.count else {
        print("❌ DEBUG: toggleItemInWidget - Invalid indices")
        return
    }
    
    // Toggle the item completion status
    let currentStatus = updatedLists[listIndex].items[itemIndex].isCompleted
    updatedLists[listIndex].items[itemIndex] = ShoppingListItemData(
        text: updatedLists[listIndex].items[itemIndex].text,
        isCompleted: !currentStatus
    )
    
    print("✅ DEBUG: toggleItemInWidget - Item '\(updatedLists[listIndex].items[itemIndex].text)' toggled to: \(!currentStatus)")
    
    // Save updated lists back to UserDefaults
    do {
        let updatedData = try JSONEncoder().encode(updatedLists)
        sharedDefaults?.set(updatedData, forKey: "shoppingLists")
        
        // Also save the change for React Native to sync
        let widgetChange: [String: Any] = [
            "type": "itemToggle",
            "listIndex": listIndex,
            "itemIndex": itemIndex,
            "isCompleted": !currentStatus,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        if let changeData = try? JSONSerialization.data(withJSONObject: widgetChange) {
            sharedDefaults?.set(changeData, forKey: "widgetChanges")
            print("📱 DEBUG: toggleItemInWidget - Saved change for app sync: \(widgetChange)")
        }
        
        sharedDefaults?.synchronize()
        
        print("💾 DEBUG: toggleItemInWidget - Successfully saved updated lists")
        
        // Reload all widget timelines
        WidgetCenter.shared.reloadAllTimelines()
        print("🔄 DEBUG: toggleItemInWidget - Widget timelines reloaded")
        
    } catch {
        print("❌ DEBUG: toggleItemInWidget - Error saving: \(error)")
    }
}

// MARK: - App Intents for iOS 16+
@available(iOS 16.0, *)
struct ToggleItemIntent: AppIntent {
    static var title: LocalizedStringResource = "Toggle Item"
    static var description = IntentDescription("Toggle item completion in widget")
    static var openAppWhenRun: Bool = false // KEY: This prevents opening the app
    
    @Parameter(title: "List Index")
    var listIndex: Int
    
    @Parameter(title: "Item Index") 
    var itemIndex: Int
    
    static var parameterSummary: some ParameterSummary {
        Summary("Toggle item \(\.$itemIndex)")
    }
    
    init() {
        self.listIndex = 0
        self.itemIndex = 0
    }
    
    init(listIndex: Int, itemIndex: Int) {
        self.listIndex = listIndex
        self.itemIndex = itemIndex
    }
    
    func perform() async throws -> some IntentResult {
        print("🎯 DEBUG: ToggleItemIntent.perform() - List: \(listIndex), Item: \(itemIndex)")
        toggleItemInWidget(listIndex: listIndex, itemIndex: itemIndex)
        return .result()
    }
}

