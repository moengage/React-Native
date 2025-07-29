//
//  LiveActivityAttributes.swift
//  LiveActivity
//
//  Created by Soumya Ranjan Mahunt on 26/03/25.
//

import Foundation

import ActivityKit
import WidgetKit
import SwiftUI

struct LiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}
