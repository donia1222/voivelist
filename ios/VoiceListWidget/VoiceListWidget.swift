import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), favoritesList: [], shoppingLists: [], isEmpty: true, isSubscribed: false)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let sampleLists = [
            ShoppingList(name: "Grocery", items: ["Milk", "Bread", "Eggs"]),
            ShoppingList(name: "Market", items: ["Tomatoes", "Cheese", "Apples"])
        ]
        let entry = SimpleEntry(date: Date(), favoritesList: getSampleData(), shoppingLists: sampleLists, isEmpty: false, isSubscribed: true)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []
        
        let favorites = loadFavorites()
        let shoppingLists = loadShoppingLists()
        let isSubscribed = loadSubscriptionStatus()
        let currentDate = Date()
        let isEmpty = shoppingLists.isEmpty && favorites.isEmpty
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
        print("🔍 Widget: Checking App Group data...")
        
        // Try to load shopping lists from shared storage
        if let listsData = sharedDefaults?.data(forKey: "shoppingLists") {
            print("🔍 Widget: Found shoppingLists data, size: \(listsData.count) bytes")
            
            if let lists = try? JSONDecoder().decode([ShoppingListData].self, from: listsData) {
                print("🔍 Widget: Successfully decoded \(lists.count) shopping lists")
                for (index, list) in lists.enumerated() {
                    print("🔍 Widget: List \(index): '\(list.name)' with \(list.items.count) items")
                }
                return lists.map { ShoppingList(name: $0.name, items: $0.items) }
            } else {
                print("🔍 Widget: ERROR - Failed to decode JSON data")
            }
        } else {
            print("🔍 Widget: No shoppingLists data found in App Group")
        }
        
        // Fallback to favorites if no lists available
        let favorites = loadFavorites()
        print("🔍 Widget: Fallback - found \(favorites.count) favorites")
        
        if !favorites.isEmpty {
            return [ShoppingList(name: "Favorites", items: favorites)]
        }
        
        print("🔍 Widget: No data found - widget will be empty")
        return []
    }
    
    func getSampleData() -> [String] {
        return ["Milk", "Bread", "Eggs", "Tomatoes", "Cheese"]
    }
}

struct ShoppingList {
    let name: String
    let items: [String]
}

struct ShoppingListData: Codable {
    let name: String
    let items: [String]
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
                        .foregroundColor(Color(hex: "1F2937"))
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
        .widgetURL(URL(string: entry.isEmpty ? "voicelist://create" : "voicelist://favorites"))
    }
}

struct MediumWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
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
        .widgetURL(URL(string: entry.isEmpty ? "voicelist://create" : "voicelist://favorites"))
    }
}

struct LargeWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
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
        .widgetURL(URL(string: entry.isEmpty ? "voicelist://create" : "voicelist://favorites"))
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
    SimpleEntry(date: .now, favoritesList: ["Milk", "Bread", "Eggs"], shoppingLists: [ShoppingList(name: "Grocery", items: ["Milk", "Bread", "Eggs"])], isEmpty: false, isSubscribed: true)
    SimpleEntry(date: .now, favoritesList: [], shoppingLists: [], isEmpty: true, isSubscribed: false)
}

