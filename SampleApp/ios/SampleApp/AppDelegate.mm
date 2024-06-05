#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <ReactNativeMoEngage/MoEngageInitializer.h>
#import <MoEngageSDK/MoEngageSDK.h>
#import "React/RCTBridgeConstants.h"
#import "Utility.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"SampleApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  [self initializeMoEngage];
  
  // Register for notification, which gets fired when app is reloaded from React-core package
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appReloaded:) name:RCTBridgeWillReloadNotification object:nil];
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


// MARK: called when app is reloaded

- (void)initializeMoEngage{
  NSString* appId = [Utility fetchAppId];
  MoEngageSDKConfig* sdkConfig = [[MoEngageSDKConfig alloc] initWithAppId:appId dataCenter: MoEngageDataCenterData_center_01];
  sdkConfig.appGroupID = @"group.com.alphadevs.MoEngage.NotificationServices";
  sdkConfig.consoleLogConfig = [[MoEngageConsoleLogConfig alloc] initWithIsLoggingEnabled:true loglevel:MoEngageLoggerTypeVerbose];
  [[MoEngageInitializer sharedInstance] initializeDefaultSDKConfig:sdkConfig andLaunchOptions:nil];
}

-(void)appReloaded:(NSNotification*)notification {
  [self initializeMoEngage];
}

@end


