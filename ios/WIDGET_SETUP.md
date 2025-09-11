# iOS Widget Setup Instructions

## Steps to Add Widget to Your Project in Xcode

### 1. Open Project in Xcode
```bash
cd ios
open VoiceList.xcworkspace
```

### 2. Add Widget Extension Target
1. In Xcode, select File → New → Target
2. Choose "Widget Extension" from iOS templates
3. Name it "VoiceListWidget"
4. Team: Select your development team
5. Bundle Identifier: `com.lwebch.VoiceList.VoiceListWidget`
6. Include Configuration Intent: NO
7. Click "Finish"
8. When asked to activate scheme, click "Activate"

### 3. Configure App Groups (IMPORTANT)
This allows the widget to share data with the main app.

#### For Main App:
1. Select your main app target (VoiceList)
2. Go to "Signing & Capabilities" tab
3. Click "+ Capability" button
4. Add "App Groups"
5. Click "+" under App Groups
6. Add: `group.com.voicelist.widget`

#### For Widget Extension:
1. Select the widget target (VoiceListWidget)
2. Go to "Signing & Capabilities" tab
3. Click "+ Capability" button
4. Add "App Groups"
5. Click "+" under App Groups
6. Add the same group: `group.com.voicelist.widget`

### 4. Replace Widget Files
1. Delete the auto-generated widget files in VoiceListWidget folder
2. Copy the Swift file we created:
   - `VoiceListWidget.swift` to the widget target folder

### 5. Add Bridge Files to Main App
1. In Xcode, right-click on VoiceList folder
2. Add Files to "VoiceList"
3. Add these files:
   - `WidgetDataBridge.swift`
   - `WidgetDataBridge.m`
4. Make sure they're added to the VoiceList target

### 6. Update Widget Info.plist
The Info.plist for the widget has been created. Make sure it's properly linked in Xcode.

### 7. Build Settings
For the Widget target:
1. Go to Build Settings
2. Search for "iOS Deployment Target"
3. Set to iOS 14.0 or later

### 8. Test the Widget
1. Build and run the app on a simulator or device
2. Go to home screen
3. Long press on empty space
4. Tap "+" button
5. Search for "Voice Grocery"
6. Select widget size (Small, Medium, or Large)
7. Add Widget

## Features

### Widget Sizes
- **Small**: Shows top 3 favorite items or microphone icon if empty
- **Medium**: Shows top 5 items with add more button
- **Large**: Shows top 10 items with full interface

### Deep Links
- Tapping widget with favorites opens History screen
- Tapping empty widget starts voice recording

### Data Sync
- Favorites are automatically synced when updated in the app
- Widget refreshes when data changes

## Troubleshooting

### Widget Not Showing
1. Check that App Groups are properly configured for both targets
2. Verify bundle identifiers match
3. Clean build folder (Cmd+Shift+K) and rebuild

### Data Not Syncing
1. Verify App Group ID is exactly: `group.com.voicelist.widget`
2. Check that WidgetDataBridge is properly imported
3. Ensure favorites are being saved correctly

### Build Errors
1. Make sure iOS Deployment Target is 14.0+
2. Import WidgetKit framework
3. Check Swift version compatibility

## Code Integration

The widget is already integrated with your app through:
- `WidgetService.js` - JavaScript service for updating widget data
- `WidgetDataBridge.swift/m` - Native bridge for React Native
- Widget automatically updates when favorites change in HistoryScreen
- Deep link handling in HomeScreen for widget taps