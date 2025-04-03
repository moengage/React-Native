//
//  AppDelegate.swift
//  SampleSwiftApp
//
//  Created by Soumya Ranjan Mahunt on 03/04/25.
//

import UIKit
import React
import React_RCTAppDelegate
import ReactNativeMoEngage
import MoEngageSDK

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "SampleApp"

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    let sdkConfig = MoEngageSDKConfig(appId: "YOUR APP ID", dataCenter: MoEngageDataCenter.data_center_03)
    sdkConfig.appGroupID = "group.com.alphadevs.MoEngage.NotificationServices"
    sdkConfig.consoleLogConfig = MoEngageConsoleLogConfig(isLoggingEnabled: true, loglevel: .verbose)
    MoEngageInitializer.sharedInstance().initializeDefaultSDKConfig(sdkConfig, andLaunchOptions: launchOptions ?? [:])

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
