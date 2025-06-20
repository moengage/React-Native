//
//  LiveActivityLiveActivity.swift
//  LiveActivity
//
//  Created by Soumya Ranjan Mahunt on 04/03/25.
//

import ActivityKit
import WidgetKit
import SwiftUI
import MoEngageLiveActivity

struct LiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: MoEngageActivityAttributes<LiveActivityAttributes>.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)
            .moengageWidgetClickURL(URL(string: "moeapp://home"), context: context, widgetId: 2)
        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .moengageWidgetClickURL(URL(string: "moeapp://home"), context: context, widgetId: 1)
            .keylineTint(Color.red)
        }
    }
}

extension LiveActivityAttributes {
    fileprivate static var preview: LiveActivityAttributes {
        LiveActivityAttributes(name: "World")
    }
}

extension LiveActivityAttributes.ContentState {
    fileprivate static var smiley: LiveActivityAttributes.ContentState {
        LiveActivityAttributes.ContentState(emoji: "😀")
    }

    fileprivate static var starEyes: LiveActivityAttributes.ContentState {
        LiveActivityAttributes.ContentState(emoji: "🤩")
    }
}

#Preview("Notification", as: .content, using: LiveActivityAttributes.preview) {
    LiveActivityWidget()
} contentStates: {
    LiveActivityAttributes.ContentState.smiley
    LiveActivityAttributes.ContentState.starEyes
}
