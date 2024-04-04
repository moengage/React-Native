//
//  MoEngageReact.m
//  ReactNativeMoEngage
//
//  Created by Chengappa C D on 14/02/20.
//

#import "MoEngageInitializer.h"
#import "MoEngageReactPluginInfo.h"
#import "MoEngageReactConstants.h"
#import "MoEngageReactUtils.h"
#import <MoEngageSDK/MoEngageSDK.h>
#import <MoEngageObjCUtils/MoEngageObjCUtils.h>
#import "MoEReactNativeHandler.h"

@import MoEngagePluginBase;

@interface MoEngageInitializer()
@property(nonatomic, weak) MoEReactNativeHandler *dummyHandler;
@end

@implementation MoEngageInitializer

#pragma mark- Initialization

+(instancetype)sharedInstance{
    static dispatch_once_t onceToken;
    static MoEngageInitializer *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEngageInitializer alloc] init];
    });
    return instance;
}
#pragma mark- Initialization methods

- (void)initializeDefaultSDKConfig:(MoEngageSDKConfig*)sdkConfig andLaunchOptions:(NSDictionary*)launchOptions{
    MoEngagePlugin *plugin = [[MoEngagePlugin alloc] init];
    [plugin initializeDefaultInstanceWithSdkConfig:sdkConfig launchOptions:launchOptions];
    [self commonSetUp:plugin identifier:sdkConfig.appId];
}

- (void)initializeDefaultSDKConfigWithState:(MoEngageSDKConfig *)sdkConfig withSDKState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions{
    
    MoEngagePlugin *plugin = [[MoEngagePlugin alloc] init];
    [plugin initializeDefaultInstanceWithSdkConfig:sdkConfig sdkState:sdkState launchOptions:launchOptions];
    [self commonSetUp: plugin identifier:sdkConfig.appId];
}

#pragma mark- Utils

- (void)commonSetUp:(MoEngagePlugin *)plugin identifier:(NSString*)identifier {
    [plugin trackPluginInfo: kReactNative version:MOE_REACT_PLUGIN_VERSION];
    [self setPluginBridgeDelegate:identifier];
}

- (void)setPluginBridgeDelegate: (NSString*)identifier {
    [[MoEReactNativeHandler sharedInstance] setDelegate:identifier];
}
@end
