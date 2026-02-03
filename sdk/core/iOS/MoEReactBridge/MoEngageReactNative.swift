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

@objc
class MoEngageReactNative: NSObject, MoEngageModule.Item {
    static func getInfo(sdkInstance: MoEngageSDKInstance) -> MoEngageModule.Info {
        return .init(name: MOE_REACT_PLUGIN_NAME, version: MOE_REACT_PLUGIN_VERSION)
    }

    static func process(event: MoEngageModule.Event, sdkInstance: MoEngageSDKInstance) {
        switch event {
        case .`init`:
            MoEReactNativeHandler.sharedInstance().setPluginBridgeDelegate(sdkInstance.sdkConfig.appId)
        default:
            break
        }
    }
}
