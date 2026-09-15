//
//  AppDelegate.swift
//  SpmSampleApp
//
//  MoEngage React Native SDK sample integrated through React Native's
//  experimental Swift Package Manager support (react-native >= 0.87).
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

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    UNUserNotificationCenter.current().delegate = self

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    MoEngageSDKCore.sharedInstance.enableAllLogs()

    // Initialization with code (instead of ReactMoE.initialize from JS):
    // let sdkConfig = MoEngageSDKConfig(appId: "YOUR APP ID", dataCenter: MoEngageDataCenter.data_center_03)
    // let reactConfig = MoEngageReactSDKInitializationConfig(sdkConfig: sdkConfig)
    // MoEngageInitializer.sharedInstance().initializeInstance(reactConfig)

    // The window is created by SceneDelegate, not here — under the UIScene
    // life cycle the app delegate owns no window and React Native starts once
    // a scene connects.
    return true
  }

  func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {
    let config = UISceneConfiguration(
      name: "Default Configuration",
      sessionRole: connectingSceneSession.role
    )
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
    guard
      let windowScene = scene as? UIWindowScene,
      let appDelegate = UIApplication.shared.delegate as? AppDelegate
    else { return }

    let window = UIWindow(windowScene: windowScene)
    appDelegate.reactNativeFactory?.startReactNative(
      withModuleName: "SpmSampleApp",
      in: window,
      initialProperties: [:],
      launchOptions: nil
    )
    self.window = window
    appDelegate.window = window

    // A cold launch delivers the deep link here rather than through
    // scene(_:openURLContexts:) / scene(_:continue:), which only fire while the
    // app is already running.
    handle(urlContexts: connectionOptions.urlContexts)
    connectionOptions.userActivities.forEach(handle(userActivity:))
  }

  func scene(_ scene: UIScene, openURLContexts urlContexts: Set<UIOpenURLContext>) {
    handle(urlContexts: urlContexts)
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    handle(userActivity: userActivity)
  }

  private func handle(urlContexts: Set<UIOpenURLContext>) {
    for context in urlContexts {
      MoEngageSDKAnalytics.sharedInstance.processURL(context.url)
    }
  }

  private func handle(userActivity: NSUserActivity) {
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

// MARK: - UNUserNotificationCenterDelegate
//
// Forwards notifications to the MoEngage SDK for analytics + inbox +
// impression tracking, then tells iOS what to display in foreground.
extension AppDelegate {

  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    MoEngageSDKMessaging.sharedInstance.userNotificationCenter(center, willPresent: notification)
    completionHandler([.alert, .sound, .badge])
  }

  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    MoEngageSDKMessaging.sharedInstance.userNotificationCenter(center, didReceive: response)
    completionHandler()
  }
}
