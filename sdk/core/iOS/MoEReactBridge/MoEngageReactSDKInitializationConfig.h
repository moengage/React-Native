//
//  MoEngageReactSDKInitializationConfig.h
//  ReactNativeMoEngage
//
//  Created by Babul on 24/06/24.

#import <Foundation/Foundation.h>
@class MoEngageSDKConfig;

@interface MoEngageReactSDKInitializationConfig : NSObject

/// The SDK configuration to be used.
@property (nonatomic, readonly, strong) MoEngageSDKConfig * _Nonnull sdkConfig;
/// The state of SDK.
/// By default, state is enabled.
@property (nonatomic) enum MoEngageSDKState sdkState;
/// The app launch options.
/// By default, no launch options set..
@property (nonatomic, copy) NSDictionary<UIApplicationLaunchOptionsKey, id> * _Nullable launchOptions;
@property (nonatomic) BOOL isTestEnvironment;
/// Whether the initialized SDK instance is default instance.
/// By default. set as <code>true</code>.
@property (nonatomic) BOOL isDefaultInstance;
/// Creates a new initialization configuration with provided SDK configuration and default options.
/// \param sdkConfig The SDK configuration to be used
///
- (nonnull instancetype)initWithSdkConfig:(MoEngageSDKConfig * _Nonnull)sdkConfig;
@end

