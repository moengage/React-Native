//
//  MoEngageReactSDKInitializationConfig.m
//  ReactNativeMoEngage
//
//  Created by Babul on 24/06/24.
//


#import <Foundation/Foundation.h>
#import <MoEngageSDK/MoEngageSDK.h>
#import "MoEngageReactSDKInitializationConfig.h"

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
