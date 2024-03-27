//
//  MoEngageReact.m
//  ReactNativeMoEngage
//
//  Created by Chengappa C D on 14/02/20.
//

#import "MoEngageInitializer.h"
#import "MoEngageReactPluginInfo.h"
#import "MoEngageReactConstants.h"
#import "MoEReactBridges.h"
#import "MoEngageReactUtils.h"
#import <MoEngageSDK/MoEngageSDK.h>
#import <MoEngageObjCUtils/MoEngageObjCUtils.h>
//@import MoEngagePluginBase;
//@interface MoEngageInitializer() <MoEngagePluginBridgeDelegate>

@implementation MoEngageInitializer

#pragma mark- Initialization

//+(instancetype)sharedInstance{
//    static dispatch_once_t onceToken;
//    static MoEngageInitializer *instance;
//    dispatch_once(&onceToken, ^{
//        instance = [[MoEngageInitializer alloc] init];
//    });
//    return instance;
//}
//#pragma mark- Initialization methods
//
//- (void)initializeDefaultInstance:(NSDictionary*)launchOptions{
//    [self initializeDefaultSDKConfig:[self fetchSDKConfig] andLaunchOptions:launchOptions];
//}
//
//- (void)initializeDefaultSDKConfig:(MoEngageSDKConfig*)sdkConfig andLaunchOptions:(NSDictionary*)launchOptions{
//    MoEngagePlugin *plugin = [[MoEngagePlugin alloc] init];
//    [plugin initializeDefaultInstanceWithSdkConfig:sdkConfig launchOptions:launchOptions];
//    [self commonSetUp:plugin identifier:sdkConfig.appId];
//}
//
//- (void)initializeDefaultInstance:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions{
//    MoEngageSDKConfig *sdkConfig = [self fetchSDKConfig];
//    MoEngageSDKState currentSDKState = isSdkEnabled ? MoEngageSDKStateEnabled: MoEngageSDKStateDisabled;
//    [self initializeDefaultSDKConfigWithState:sdkConfig withSDKState:currentSDKState andLaunchOptions:launchOptions];
//}
//
//- (void)initializeDefaultInstanceWithState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions{
//    MoEngageSDKConfig *sdkConfig = [self fetchSDKConfig];
//    [self initializeDefaultSDKConfigWithState:sdkConfig withSDKState:sdkState andLaunchOptions:launchOptions];
//}
//
//- (void)initializeDefaultSDKConfig:(MoEngageSDKConfig*)sdkConfig withSDKState:(BOOL)isSDKEnabled andLaunchOptions:(NSDictionary*)launchOptions{
//    MoEngageSDKState currentSDKState = isSDKEnabled ? MoEngageSDKStateEnabled: MoEngageSDKStateDisabled;
//    [self initializeDefaultSDKConfigWithState:sdkConfig withSDKState:currentSDKState andLaunchOptions:launchOptions];
//}
//
//- (void)initializeDefaultSDKConfigWithState:(MoEngageSDKConfig *)sdkConfig withSDKState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions{
//    
//    MoEngagePlugin *plugin = [[MoEngagePlugin alloc] init];
//    [plugin initializeDefaultInstanceWithSdkConfig:sdkConfig sdkState:sdkState launchOptions:launchOptions];
//    [self commonSetUp: plugin identifier:sdkConfig.appId];
//}
//
//#pragma mark- Utils
//
//- (void)commonSetUp:(MoEngagePlugin *)plugin identifier:(NSString*)identifier {
//    [plugin trackPluginInfo: kReactNative version:MOE_REACT_PLUGIN_VERSION];
//    [self setPluginBridgeDelegate:identifier];
//}
//
//- (void)setPluginBridgeDelegate: (NSString*)identifier {
//    [[MoEngagePluginBridge sharedInstance] setPluginBridgeDelegate:self identifier:identifier];
//}
//
//-(MoEngageSDKConfig*)fetchSDKConfig {
//    NSDictionary *infoDict = [[NSBundle mainBundle] infoDictionary];
//    MoEngageSDKConfig *sdkConfig;
//   
//    if ( [infoDict objectForKey: kMoEngage] != nil && [infoDict objectForKey: kMoEngage] != [NSNull null]) {
//        NSDictionary* moeDict = [infoDict objectForKey: kMoEngage];
//        if ([moeDict objectForKey: kAppId] != nil && [moeDict objectForKey:kAppId] != [NSNull null]) {
//            
//            NSString *appId = [moeDict objectForKey: kAppId];
//            if (appId.length > 0) {
//                sdkConfig = [[MoEngageSDKConfig alloc] initWithAppID:appId];
//            }
//        } else {
//            NSAssert(NO, @"MoEngage - Configure the APP ID for your MoEngage App.To get the AppID login to your MoEngage account, after that go to Settings -> App Settings. You will find the App ID in this screen. And refer to docs.moengage.com for more info");
//            return nil;
//        }
//    
//        if ([moeDict objectForKey: kDataCenter] != nil && [moeDict objectForKey:kDataCenter] != [NSNull null]) {
//            sdkConfig.moeDataCenter = [self getDataCenterFromString: [moeDict objectForKey: kDataCenter]];
//        }
//        
//        if ([moeDict objectForKey:kAppGroupId] != nil && [moeDict objectForKey:kAppGroupId] != [NSNull null]) {
//             sdkConfig.appGroupID = [moeDict objectForKey:kAppGroupId];
//        }
//        
//        if ([moeDict objectForKey:kDisablePeriodicFlush] != nil && [moeDict objectForKey:kDisablePeriodicFlush] != [NSNull null]) {
//            sdkConfig.analyticsDisablePeriodicFlush = [MoEngageReactUtils getBooleanForKey:kDisablePeriodicFlush dict:moeDict];
//        }
//        
//        if ([moeDict objectForKey:kPeriodicFlushDuration] != nil && [moeDict objectForKey:kPeriodicFlushDuration] != [NSNull null]) {
//            sdkConfig.analyticsPeriodicFlushDuration = [MoEngageReactUtils getIntegerForKey:kPeriodicFlushDuration dict:moeDict];
//        }
//        
//        if ([moeDict objectForKey:kEnableLogs] != nil && [moeDict objectForKey:kEnableLogs] != [NSNull null]) {
//            sdkConfig.enableLogs = [MoEngageReactUtils getBooleanForKey:kEnableLogs dict:moeDict];
//        }
//    }
//    
//    return sdkConfig;
//}
//
//- (MoEngageDataCenter)getDataCenterFromString:(NSString*)stringVal {
//    MoEngageDataCenter dataCenter = MoEngageDataCenterData_center_01;
//    
//    if ([stringVal  isEqual:kDataCenter1])
//    {
//        dataCenter = MoEngageDataCenterData_center_01;
//    }
//    else if ([stringVal  isEqual:kDataCenter2])
//    {
//        dataCenter = MoEngageDataCenterData_center_02;
//    }
//    else if ([stringVal  isEqual:kDataCenter3])
//    {
//        dataCenter = MoEngageDataCenterData_center_03;
//    } else if ([stringVal isEqual: kDataCenter4])
//    {
//        dataCenter = MoEngageDataCenterData_center_04;
//    } else if ([stringVal isEqual: kDataCenter5])
//    {
//        dataCenter = MoEngageDataCenterData_center_05;
//    }
//    else
//    {
//        NSLog(@"%@", kInvalidDataCenterAlert);
//    }
//    
//    return dataCenter;
//}
//#pragma mark- MoEPluginBridgeDelegate
//- (void)sendMessageWithEvent:(NSString *)event message:(NSDictionary<NSString *,id> *)message {
//    NSMutableDictionary* updatedDict = [NSMutableDictionary dictionary];
//
//    if (message) {
//        NSError *err;
//        NSData * jsonData = [NSJSONSerialization dataWithJSONObject:message options:0 error:&err];
//        if (jsonData) {
//            NSString* strPayload = [[NSString alloc] initWithData:jsonData  encoding:NSUTF8StringEncoding];
//            updatedDict[kPayload] = strPayload;
//        } else {
//            NSLog(@"Error converting to dictionary to string %@", err.localizedDescription);
//        }
//    }
//    
//    NSDictionary* userInfo = @{kEventName:event,kPayloadDict:updatedDict};
//    MoEReactBridge *reactBridge = [MoEReactBridge allocWithZone: nil];
//    [reactBridge sendEventWithName:userInfo];
//}
@end
