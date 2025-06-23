import Foundation
import UIKit
import MoEngageSDK
import MoEngagePluginBase
import ReactNativeMoEngage
import ExpoModulesCore
import SystemConfiguration

// This class provides AppDelegate integration for MoEngage SDK
@objc(MoEngageAppDelegate)
public class MoEngageAppDelegate: ExpoAppDelegateSubscriber {

    // Called when the application is launched
    public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        let config = MoEngageSDKDefaultInitializationConfig()
        config.launchOptions = launchOptions
        MoEngageInitializer.sharedInstance().initializeDefaultInstance(withAdditionalConfig: config)
        return true
    }

    // Handle URL opening
    public func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        MoEngageSDKAnalytics.sharedInstance.processURL(url)
        return true
    }

    // Handle continuation of user activity with web browsing URL
    public func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        guard
          userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let incomingURL = userActivity.webpageURL,
          let components = NSURLComponents(url: incomingURL, resolvingAgainstBaseURL: true),
          let path = components.path
        else { return false }

        MoEngageSDKAnalytics.sharedInstance.processURL(incomingURL)
        return true
    }

#if !os(tvOS)
    // Handle remote notifications registration
    public func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        MoEngageSDKMessaging.sharedInstance.setPushToken(deviceToken)
    }

    // Handle remote notifications registration failure
    public func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        MoEngageSDKMessaging.sharedInstance.didFailToRegisterForPush()
    }

    // Handle incoming remote notifications
    public func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        MoEngageSDKMessaging.sharedInstance.didReceieveNotification(inApplication: application, withInfo: userInfo)
        completionHandler(UIBackgroundFetchResult.noData)
    }

    // Handle notification response
    @available(iOS 10.0, *)
    public func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        MoEngageSDKMessaging.sharedInstance.userNotificationCenter(center, didReceive: response)
        completionHandler()
    }

    // Handle notification presentation
    @available(iOS 10.0, *)
    public func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        MoEngageSDKMessaging.sharedInstance.userNotificationCenter(center, willPresent: notification)
        completionHandler([.alert, .sound])
    }
#endif
}