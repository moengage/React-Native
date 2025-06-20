//
//  LiveActivityBundle.swift
//  LiveActivity
//
//  Created by Soumya Ranjan Mahunt on 04/03/25.
//

import WidgetKit
import SwiftUI

@main
struct LiveActivityBundle: WidgetBundle {
    var body: some Widget {
        LiveActivityWidget()
        FootballActivityWidget()
    }
}
