//
//  MoEngageInitializer.h
//  ReactNativeMoEngage
//
//  Created by Chengappa C D on 14/02/20.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol SFSafariViewControllerDelegate;
@class MoEngageReactSDKInitializationConfig;
#import <MoEngageSDK/MoEngageSDK.h>

NS_ASSUME_NONNULL_BEGIN

@interface MoEngageInitializer : NSObject

+(instancetype)sharedInstance;

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

/// Initialize SDK with MoEngageReactSDKInitializationConfig instance.
/// @param reactConfig MoEngageSDKConfig instance for SDK configuration
- (void)initializeInstance:(MoEngageReactSDKInitializationConfig*)reactConfig;
@end

NS_ASSUME_NONNULL_END
