#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <RCTAppDelegate.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>
#import <ReactNativeMoEngage/MoEngageInitializer.h>
#import <ReactNativeMoEngage/MoEngageReactSDKInitializationConfig.h>
#import <MoEngageSDK/MoEngageSDK.h>

@interface ReactNativeDelegate : RCTDefaultReactNativeFactoryDelegate
@end

@implementation ReactNativeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

@interface SceneDelegate : UIResponder <UIWindowSceneDelegate>
@property (nonatomic, strong) UIWindow *window;
@end

@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    willConnectToSession:(UISceneSession *)session
                 options:(UISceneConnectionOptions *)connectionOptions
{
  if (![scene isKindOfClass:[UIWindowScene class]]) return;
  UIWindowScene *windowScene = (UIWindowScene *)scene;
  AppDelegate *appDelegate = (AppDelegate *)UIApplication.sharedApplication.delegate;
  UIWindow *window = [[UIWindow alloc] initWithWindowScene:windowScene];
  [appDelegate.reactNativeFactory startReactNativeWithModuleName:@"SampleApp"
                                                        inWindow:window
                                               initialProperties:@{}
                                                   launchOptions:nil];
  self.window = window;
  appDelegate.window = window;
}

- (void)scene:(UIScene *)scene openURLContexts:(NSSet<UIOpenURLContext *> *)urlContexts
{
  for (UIOpenURLContext *context in urlContexts) {
    [MoEngageSDKAnalytics.sharedInstance processURL:context.URL];
  }
}

- (void)scene:(UIScene *)scene continueUserActivity:(NSUserActivity *)userActivity
{
  [MoEngageSDKAnalytics.sharedInstance processURL:userActivity.webpageURL];
}

@end

@interface AppDelegate ()
@property (nonatomic, strong) ReactNativeDelegate *reactNativeDelegate;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  UNUserNotificationCenter.currentNotificationCenter.delegate = self;
  self.reactNativeDelegate = [ReactNativeDelegate new];
  self.reactNativeDelegate.dependencyProvider = [RCTAppDependencyProvider new];
  self.reactNativeFactory = [[RCTReactNativeFactory alloc] initWithDelegate:self.reactNativeDelegate];

  [MoEngageSDKCore.sharedInstance enableAllLogs];

  // Initialization with code
  // MoEngageSDKConfig *sdkConfig = [[MoEngageSDKConfig alloc] initWithAppId:@"YOUR APP ID" dataCenter:MoEngageDataCenterData_center_01];
  // sdkConfig.appGroupID = @"group.com.alphadevs.MoEngage.NotificationServices";
  // sdkConfig.consoleLogConfig = [[MoEngageConsoleLogConfig alloc] initWithIsLoggingEnabled:true loglevel:MoEngageLoggerTypeVerbose];
  // MoEngageReactSDKInitializationConfig *initConfig = [[MoEngageReactSDKInitializationConfig alloc] initWithSdkConfig:sdkConfig];
  // [[MoEngageInitializer sharedInstance] initializeInstance:initConfig];

  // File based initialization without swizzling
  // [[MoEngageInitializer sharedInstance] initializeDefaultInstanceWithAdditionalReactConfig:[[MoEngageReactSDKDefaultInitializationConfig alloc] init]];

  return YES;
}

- (UISceneConfiguration *)application:(UIApplication *)application
    configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession
                                   options:(UISceneConnectionOptions *)options
{
  UISceneConfiguration *config = [[UISceneConfiguration alloc] initWithName:@"Default Configuration"
                                                                sessionRole:connectingSceneSession.role];
  config.delegateClass = SceneDelegate.class;
  return config;
}

@end
