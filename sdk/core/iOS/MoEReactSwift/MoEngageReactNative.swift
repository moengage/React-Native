//
//  MoEngageReactNative.swift
//  ReactNativeMoEngage
//
//  Created by Soumya Mahunt on 27/11/25.
//  Copyright © 2025 MoEngage. All rights reserved.
//

import Foundation
import MoEngageSDK
import MoEngagePluginBase
// Under Swift Package Manager the Objective-C bridge is a separate target
// (SPM cannot mix Swift and ObjC in one target); import its module to reach
// MoEReactNativeHandler and the MOE_REACT_PLUGIN_* macros. Under CocoaPods
// this file compiles into that same module, so the import must not happen —
// SWIFT_PACKAGE is defined only by SwiftPM, which distinguishes the two even
// though both name the module ReactNativeMoEngage.
#if SWIFT_PACKAGE
import ReactNativeMoEngage
#endif

// `final` is required: MoEngageModule.Item refines Sendable in MoEngage-iOS-SDK 11.
@objc
final class MoEngageReactNative: NSObject, MoEngageModule.Item {
    static func getInfo(sdkInstance: isolated MoEngageSDKInstance) -> MoEngageModule.Info? {
        // Return a nil identity so ReactNativeMoEngage is not
        // reported in the backend `integratedModules` payload
        // The hybrid integration + version is reported separately via `trackPluginInfo`.
        return MoEngageModule.Info(identity: nil)
    }

    static func process(event: MoEngageModule.Event, sdkInstance: isolated MoEngageSDKInstance) {
        switch event {
        case .`init`:
            MoEReactNativeHandler.sharedInstance().setPluginBridgeDelegate(sdkInstance.config.workspaceId)
        default:
            break
        }
    }

    static func process(event: MoEngageModule.AsyncEvent, sdkInstance: isolated MoEngageSDKInstance) async {
        // The React Native bridge has no asynchronous lifecycle work.
    }

    static func listensToAdditionalNotifications() -> [Notification.Name] {
        return []
    }
}
