#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <ReactNativeMoEngage/MoEngageInitializer.h>
#import <ReactNativeMoEngage/MoEngageReactSDKInitializationConfig.h>
#import <MoEngageSDK/MoEngageSDK.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"SampleApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  MoEngageSDKConfig* sdkConfig = [[MoEngageSDKConfig alloc] initWithAppId:@"YOUR APP ID" dataCenter: MoEngageDataCenterData_center_01];
  sdkConfig.appGroupID = @"group.com.alphadevs.MoEngage.NotificationServices";
  sdkConfig.consoleLogConfig = [[MoEngageConsoleLogConfig alloc] initWithIsLoggingEnabled:true loglevel:MoEngageLoggerTypeVerbose];

  MoEngageReactSDKInitializationConfig *initConfig = [[MoEngageReactSDKInitializationConfig alloc] initWithSdkConfig:sdkConfig];
  [[MoEngageInitializer sharedInstance] initializeInstance:initConfig];
 
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

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


