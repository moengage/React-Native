//
//  AppDelegate.swift
//  SampleSwiftApp
//
//  Created by Soumya Ranjan Mahunt on 03/04/25.
//

import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import ReactNativeMoEngage
import MoEngageSDK

@main
class AppDelegate: UIResponder, UNUserNotificationCenterDelegate, UIApplicationDelegate {
  var window: UIWindow?
  var reactNativeFactory: RCTReactNativeFactory!
  var reactNativeDelegate: ReactNativeDelegate!

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {
    UNUserNotificationCenter.current().delegate = self
    reactNativeDelegate = ReactNativeDelegate()
    reactNativeDelegate.dependencyProvider = RCTAppDependencyProvider()
    reactNativeFactory = RCTReactNativeFactory(delegate: reactNativeDelegate)

    MoEngageSDKCore.sharedInstance.enableAllLogs()

    // Initialization with code
    // let sdkConfig = MoEngageSDKConfig(appId: "YOUR APP ID", dataCenter: MoEngageDataCenter.data_center_03)
    // sdkConfig.appGroupID = "group.com.alphadevs.MoEngage.NotificationServices"
    // sdkConfig.consoleLogConfig = MoEngageConsoleLogConfig(isLoggingEnabled: true, loglevel: .verbose)
    // let reactConfig = MoEngageReactSDKInitializationConfig(sdkConfig: sdkConfig)
    // MoEngageInitializer.sharedInstance().initializeInstance(reactConfig)

    // File based initialization without swizzling
    // MoEngage.sharedInstance.initializeDefaultInstance()

    return true
  }

  func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {
    let config = UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    config.delegateClass = SceneDelegate.self
    return config
  }
}

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    let window = UIWindow(windowScene: windowScene)
    appDelegate.reactNativeFactory.startReactNative(
      withModuleName: "SampleApp",
      in: window,
      initialProperties: [:],
      launchOptions: nil
    )
    self.window = window
    appDelegate.window = window
  }

  func scene(_ scene: UIScene, openURLContexts urlContexts: Set<UIOpenURLContext>) {
    for context in urlContexts {
      MoEngageSDKAnalytics.sharedInstance.processURL(context.url)
    }
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    MoEngageSDKAnalytics.sharedInstance.processURL(userActivity.webpageURL)
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
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
