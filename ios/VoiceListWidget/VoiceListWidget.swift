import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), favoritesList: [], isEmpty: true)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), favoritesList: getSampleData(), isEmpty: false)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []
        
        let favorites = loadFavorites()
        let currentDate = Date()
        let entry = SimpleEntry(date: currentDate, favoritesList: favorites, isEmpty: favorites.isEmpty)
        entries.append(entry)
        
        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
    
    func loadFavorites() -> [String] {
        let sharedDefaults = UserDefaults(suiteName: "group.com.roberto.worktrack")
        return sharedDefaults?.array(forKey: "favoritesList") as? [String] ?? []
    }
    
    func getSampleData() -> [String] {
        return ["Milk", "Bread", "Eggs", "Tomatoes", "Cheese"]
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let favoritesList: [String]
    let isEmpty: Bool
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
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "4A90E2"), Color(hex: "7B68EE")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            if entry.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "mic.fill")
                        .font(.system(size: 32))
                        .foregroundColor(.white)
                    
                    Text("Create List")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                }
            } else {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Image(systemName: "cart.fill")
                            .font(.system(size: 16))
                            .foregroundColor(.white.opacity(0.9))
                        Text("Favorites")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        Spacer()
                    }
                    .padding(.bottom, 4)
                    
                    ForEach(entry.favoritesList.prefix(3), id: \.self) { item in
                        HStack {
                            Image(systemName: "circle")
                                .font(.system(size: 6))
                                .foregroundColor(.white.opacity(0.7))
                            Text(item)
                                .font(.system(size: 12))
                                .foregroundColor(.white.opacity(0.95))
                                .lineLimit(1)
                            Spacer()
                        }
                    }
                    
                    if entry.favoritesList.count > 3 {
                        Text("+\(entry.favoritesList.count - 3) more")
                            .font(.system(size: 10))
                            .foregroundColor(.white.opacity(0.7))
                            .padding(.top, 2)
                    }
                    
                    Spacer()
                }
                .padding()
            }
        }
        .widgetURL(URL(string: entry.isEmpty ? "voicelist://create" : "voicelist://favorites"))
    }
}

struct MediumWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "4A90E2"), Color(hex: "7B68EE")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            if entry.isEmpty {
                HStack {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Voice Grocery")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                        
                        Text("Tap to create your first list")
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.8))
                    }
                    .padding()
                    
                    Spacer()
                    
                    Image(systemName: "mic.circle.fill")
                        .font(.system(size: 48))
                        .foregroundColor(.white.opacity(0.9))
                        .padding()
                }
            } else {
                HStack {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Image(systemName: "cart.fill")
                                .font(.system(size: 18))
                                .foregroundColor(.white.opacity(0.9))
                            Text("Shopping List")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                        }
                        
                        VStack(alignment: .leading, spacing: 6) {
                            ForEach(entry.favoritesList.prefix(5), id: \.self) { item in
                                HStack {
                                    Image(systemName: "checkmark.circle")
                                        .font(.system(size: 12))
                                        .foregroundColor(.white.opacity(0.7))
                                    Text(item)
                                        .font(.system(size: 14))
                                        .foregroundColor(.white.opacity(0.95))
                                        .lineLimit(1)
                                }
                            }
                        }
                        
                        if entry.favoritesList.count > 5 {
                            Text("+\(entry.favoritesList.count - 5) more items")
                                .font(.system(size: 12))
                                .foregroundColor(.white.opacity(0.7))
                                .padding(.top, 4)
                        }
                    }
                    .padding()
                    
                    Spacer()
                    
                    VStack {
                        Image(systemName: "mic.circle")
                            .font(.system(size: 32))
                            .foregroundColor(.white.opacity(0.8))
                        Text("Add more")
                            .font(.system(size: 10))
                            .foregroundColor(.white.opacity(0.7))
                    }
                    .padding()
                }
            }
        }
        .widgetURL(URL(string: entry.isEmpty ? "voicelist://create" : "voicelist://favorites"))
    }
}

struct LargeWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "4A90E2"), Color(hex: "7B68EE")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: "cart.fill")
                        .font(.system(size: 24))
                        .foregroundColor(.white.opacity(0.9))
                    Text("Voice Grocery")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                    Spacer()
                    Image(systemName: "mic.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(.white.opacity(0.8))
                }
                .padding(.horizontal)
                .padding(.top)
                
                if entry.isEmpty {
                    Spacer()
                    VStack(spacing: 16) {
                        Image(systemName: "mic.fill")
                            .font(.system(size: 48))
                            .foregroundColor(.white.opacity(0.9))
                        
                        Text("Create your first list")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.white)
                        
                        Text("Tap to start speaking and create your shopping list")
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.8))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                    Spacer()
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Favorites")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.white.opacity(0.9))
                                .padding(.horizontal)
                            
                            ForEach(entry.favoritesList.prefix(10), id: \.self) { item in
                                HStack {
                                    Image(systemName: "checkmark.circle")
                                        .font(.system(size: 14))
                                        .foregroundColor(.white.opacity(0.7))
                                    Text(item)
                                        .font(.system(size: 15))
                                        .foregroundColor(.white.opacity(0.95))
                                    Spacer()
                                }
                                .padding(.horizontal)
                                .padding(.vertical, 4)
                            }
                            
                            if entry.favoritesList.count > 10 {
                                HStack {
                                    Spacer()
                                    Text("View all \(entry.favoritesList.count) items")
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundColor(.white.opacity(0.8))
                                        .padding()
                                    Spacer()
                                }
                            }
                        }
                    }
                }
                
                Spacer()
            }
        }
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
                    .containerBackground(.fill.tertiary, for: .widget)
            } else {
                VoiceListWidgetEntryView(entry: entry)
                    .padding()
                    .background()
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
    SimpleEntry(date: .now, favoritesList: ["Milk", "Bread", "Eggs"], isEmpty: false)
    SimpleEntry(date: .now, favoritesList: [], isEmpty: true)
}