//
//  FootballActivityAttributes.swift
//  LiveActivity
//
//  Created by Soumya Ranjan Mahunt on 19/05/25.
//

import Foundation
import ActivityKit
import WidgetKit
import SwiftUI

struct FootballActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var teamOneScore: Int
        var teamTwoScore: Int
    }

    // Fixed non-changing properties about your activity go here!
    var team1Name: String
    var team2Name: String
}
