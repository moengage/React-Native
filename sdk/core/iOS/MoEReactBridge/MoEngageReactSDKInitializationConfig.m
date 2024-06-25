//
//  MoEngageReact.m
//  ReactNativeMoEngage
//
//  Created by Chengappa C D on 14/02/20.
//


#import <Foundation/Foundation.h>
#import <MoEngageSDK/MoEngageSDK.h>
#import "MoEngageReactSDKInitializationConfig.h"

// Assuming MoEngageSDKConfig is an NSObject, adjust it to match its actual type.

// Assuming enum is defined somewhere correctly.
// typedef NS_ENUM(NSInteger, MoEngageSDKState) {
//     MoEngageSDKStateEnabled,
//     MoEngageSDKStateDisabled,
//     // ... any other states
// };

@implementation MoEngageReactSDKInitializationConfig

- (nonnull instancetype)initWithSdkConfig:(MoEngageSDKConfig * _Nonnull)sdkConfig {
    self = [super init];
    if (self) {
        _sdkConfig = sdkConfig;
        _sdkState = MoEngageSDKStateEnabled;
        _launchOptions = nil;
#ifdef DEBUG
        _isTestEnvironment = YES;
#else
        _isTestEnvironment = NO;
#endif
        _isDefaultInstance = YES;
    }
    return self;
}

@end
