//
//  MoEngageInitializer.h
//  ReactNativeMoEngage
//
//  Created by Chengappa C D on 14/02/20.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol SFSafariViewControllerDelegate;
#import <MoEngageSDK/MoEngageSDK.h>

NS_ASSUME_NONNULL_BEGIN

@interface MoEngageInitializer : NSObject

+(instancetype)sharedInstance;

/// Initialization Methods to setup SDK with configuration parameters from Info.plist file
/// @param launchOptions Launch Options dictionary
/// @warning Make sure to call only one of the initialization methods available (either with plist OR with MoEngageSDKConfig instance)
/// @version 8.0.0 and above
- (void)initializeDefaultInstance:(NSDictionary*)launchOptions;

/// Initialization Methods to setup SDK with configuration parameters from Info.plist file
/// @param sdkState MoEngageSDKState enum indicating if SDK is Enabled/Disabled, refer (link)[https://docs.moengage.com/docs/gdpr-compliance-1#enabledisable-sdk] for more info
/// @param launchOptions Launch Options dictionary
/// @warning Make sure to call only one of the initialization methods available (either with plist OR with MoEngageSDKConfig instance)
/// @version 8.1.0 and above
- (void)initializeDefaultInstanceWithState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions;

/// Initialization Methods to setup SDK with configuration parameters from Info.plist file
/// @param isSdkEnabled Bool indicating if SDK is Enabled/Disabled, refer (link)[https://docs.moengage.com/docs/gdpr-compliance-1#enabledisable-sdk] for more info
/// @param launchOptions Launch Options dictionary
/// @warning Make sure to call only one of the initialization methods available (either with plist OR with MOSDKConfig instance)
/// @version 8.0.0 and above
- (void)initializeDefaultInstance:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions  __deprecated_msg("Use initializeDefaultInstanceWithState:andLaunchOptions instead.");

/// Initialization Methods to setup SDK with MoEngageSDKConfig instance instead of from Info.plist file
/// @param sdkConfig MoEngageSDKConfig instance for SDK configuration
/// @param launchOptions Launch Options dictionary
/// @warning Make sure to call only one of the initialization methods available (either with plist OR with MOSDKConfig instance)
/// @version 8.0.0 and above
- (void)initializeDefaultSDKConfig:(MoEngageSDKConfig*)sdkConfig andLaunchOptions:(NSDictionary*)launchOptions;

/// Initialization Methods to setup SDK with MoEngageSDKConfig instance instead of from Info.plist file
/// @param sdkConfig MoEngageSDKConfig instance for SDK configuration
/// @param sdkState MoEngageSDKState indicating if SDK is Enabled/Disabled, refer (link)[https://docs.moengage.com/docs/gdpr-compliance-1#enabledisable-sdk] for more info
/// @param launchOptions Launch Options dictionary
/// @warning Make sure to call only one of the initialization methods available (either with plist OR with MOSDKConfig instance)
/// @version 8.1.0 and above
- (void)initializeDefaultSDKConfigWithState:(MoEngageSDKConfig*)sdkConfig withSDKState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions;

/// Initialization Methods to setup SDK with MoEngageSDKConfig instance instead of from Info.plist file
/// @param sdkConfig MoEngageSDKConfig instance for SDK configuration
/// @param isSdkEnabled Bool indicating if SDK is Enabled/Disabled, refer (link)[https://docs.moengage.com/docs/gdpr-compliance-1#enabledisable-sdk] for more info
/// @param launchOptions Launch Options dictionary
/// @warning Make sure to call only one of the initialization methods available (either with plist OR with MOSDKConfig instance)
/// @version 8.0.0 and above
- (void)initializeDefaultSDKConfig:(MoEngageSDKConfig*)sdkConfig withSDKState:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions __deprecated_msg("Use initializeDefaultSDKConfigWithState:andLaunchOptions instead.");
@end

NS_ASSUME_NONNULL_END
