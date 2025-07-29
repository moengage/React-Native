//
//  FootballActivityWidget.swift
//  LiveActivity
//
//  Created by Soumya Ranjan Mahunt on 19/05/25.
//

import ActivityKit
import WidgetKit
import SwiftUI
import MoEngageLiveActivity

struct FootballActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: MoEngageActivityAttributes<FootballActivityAttributes>.self) { context in
            // Lock screen/banner UI goes here
            VStack(spacing: 12) {
                HStack {
                    Text("LIVE GAME")
                        .font(.caption)
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.red)
                        .cornerRadius(4)
                    
                    Spacer()
                }
                
                HStack(alignment: .center, spacing: 24) {
                    VStack {
                        Text(context.attributes.team1Name)
                            .font(.headline)
                        Text("\(context.state.teamOneScore)")
                            .font(.system(size: 44, weight: .bold))
                    }
                    
                    Text("VS")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    VStack {
                        Text(context.attributes.team2Name)
                            .font(.headline)
                        Text("\(context.state.teamTwoScore)")
                            .font(.system(size: 44, weight: .bold))
                    }
                }
            }
            .padding()
            .activityBackgroundTint(Color.white.opacity(0.8))
            .activitySystemActionForegroundColor(Color.black)
            .moengageWidgetClickURL(URL(string: "moeapp://game"), context: context, widgetId: 2)
            
        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here
                DynamicIslandExpandedRegion(.leading) {
                    VStack(alignment: .center) {
                        Text(context.attributes.team1Name)
                            .font(.headline)
                        Text("\(context.state.teamOneScore)")
                            .font(.system(size: 32, weight: .bold))
                    }
                    .padding(.leading)
                }
                
                DynamicIslandExpandedRegion(.trailing) {
                    VStack(alignment: .center) {
                        Text(context.attributes.team2Name)
                            .font(.headline)
                        Text("\(context.state.teamTwoScore)")
                            .font(.system(size: 32, weight: .bold))
                    }
                    .padding(.trailing)
                }
                
                DynamicIslandExpandedRegion(.bottom) {
                    Text("LIVE: Tap for game details")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            } compactLeading: {
                Text("\(context.attributes.team1Name): \(context.state.teamOneScore)")
                    .font(.caption2)
                    .lineLimit(1)
            } compactTrailing: {
                Text("\(context.attributes.team2Name): \(context.state.teamTwoScore)")
                    .font(.caption2)
                    .lineLimit(1)
            } minimal: {
                Text("\(context.state.teamOneScore)-\(context.state.teamTwoScore)")
                    .font(.caption2)
            }
            .moengageWidgetClickURL(URL(string: "moeapp://game"), context: context, widgetId: 1)
            .keylineTint(Color.red)
        }
    }
}

// Preview extensions
extension FootballActivityAttributes {
    fileprivate static var preview: FootballActivityAttributes {
        FootballActivityAttributes(team1Name: "Chiefs", team2Name: "Bills")
    }
}

extension FootballActivityAttributes.ContentState {
    fileprivate static var tied: FootballActivityAttributes.ContentState {
        FootballActivityAttributes.ContentState(teamOneScore: 7, teamTwoScore: 7)
    }
    
    fileprivate static var team1Leading: FootballActivityAttributes.ContentState {
        FootballActivityAttributes.ContentState(teamOneScore: 14, teamTwoScore: 7)
    }
    
    fileprivate static var team2Leading: FootballActivityAttributes.ContentState {
        FootballActivityAttributes.ContentState(teamOneScore: 7, teamTwoScore: 21)
    }
}

#Preview("Notification", as: .content, using: FootballActivityAttributes.preview) {
    FootballActivityWidget()
} contentStates: {
    FootballActivityAttributes.ContentState.tied
    FootballActivityAttributes.ContentState.team1Leading
    FootballActivityAttributes.ContentState.team2Leading
}
