//
//  MoEReactBridge.m
//  MoEngage
//
//  Created by Chengappa C D on 11/11/16.
//  Copyright © 2016 MoEngage. All rights reserved.
//

#import "MoEReactBridge.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import <React/RCTBundleURLProvider.h>
#import "MoEngageInitializer.h"
#import "MoEngageReactConstants.h"
#import <MoEngageSDK/MoEngageSDK.h>
#import "MoEReactNativeHandler.h"

@interface MoEReactBridge()
@end

@implementation MoEReactBridge

{
  bool hasListeners;
  NSMutableArray *delayedEvents;
}
RCT_EXPORT_MODULE(MoEReactBridge);

- (instancetype)init
{
    if (self = [super init]) {
        if (delayedEvents == nil)
            delayedEvents = [NSMutableArray array];
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return false;
}

#pragma mark- Observers
// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    [self flushDelayedEvents];
    [MoEReactNativeHandler sharedInstance].reactBridge = self;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
}

-(void)flushDelayedEvents{
    if (delayedEvents.count > 0){
        for (NSDictionary* payloadDict in delayedEvents){
            [self emitEvent:payloadDict];
        }
    }
    
    [delayedEvents removeAllObjects];
}

-(void)sendEventWithName:(NSDictionary *)payloadDict{
    if (hasListeners) {
        [self emitEvent:payloadDict];
    } else {
        [delayedEvents addObject:payloadDict];
    }
}

-(void)emitEvent:(NSDictionary*)payloadDict{
    if (payloadDict){
        NSString* name = payloadDict[kEventName];
        NSDictionary* payload = payloadDict[kPayloadDict];
        if (name != nil && payload != nil) {
            [self sendEventWithName:name body:payload];
        }
    }
}

#pragma mark- Event Emitters
- (NSArray<NSString *> *)supportedEvents
{
    return @[kPushClicked, kPushTokenGenerated, kInAppShown, kInAppClicked, kInAppDismissed, kInAppCustomAction, kInAppSelfHandled, kPermissionResult];
}

#pragma mark- Initialization Method

RCT_EXPORT_METHOD(initialize:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] initialize:payload];
}

#pragma mark- Set AppStatus

RCT_EXPORT_METHOD(setAppStatus:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] setAppStatus:payload];
}

#pragma mark - trackEvent

RCT_EXPORT_METHOD(trackEvent:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] trackEvent:payload];
}

#pragma mark- User Attribute Methods
RCT_EXPORT_METHOD(setUserAttribute:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] setUserAttribute:payload];
}

RCT_EXPORT_METHOD(setAlias:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] setAlias:payload];
}

#pragma mark- Push Notifications
RCT_EXPORT_METHOD(registerForPush) {
    [[MoEReactNativeHandler sharedInstance] registerForPush];
}

RCT_EXPORT_METHOD(registerForProvisionalPush) {
    [[MoEReactNativeHandler sharedInstance] registerForProvisionalPush];
}

#pragma mark Show InApp

RCT_EXPORT_METHOD(showInApp:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] showInApp:payload];
}

#pragma mark Self handled In App

RCT_EXPORT_METHOD(getSelfHandledInApp:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] getSelfHandledInApp:payload];
}

RCT_EXPORT_METHOD(getSelfHandledInApps:(NSString *)payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeHandler sharedInstance] getSelfHandledInApps:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(updateSelfHandledInAppStatus:(NSString *)payload)  {
    [[MoEReactNativeHandler sharedInstance] updateSelfHandledInAppStatus:payload];
}

#pragma mark InApp Contexts

RCT_EXPORT_METHOD(setAppContext:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] setAppContext:payload];
}

RCT_EXPORT_METHOD(resetAppContext:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] resetAppContext:payload];
}

#pragma mark- Reset User

RCT_EXPORT_METHOD(logout:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] logout:payload];
}

RCT_EXPORT_METHOD(optOutDataTracking:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] optOutDataTracking: payload];
}

RCT_EXPORT_METHOD(showNudge:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] showNudge:payload];
}

RCT_EXPORT_METHOD(updateSdkState:(NSString *)payload) {
    [[MoEReactNativeHandler sharedInstance] updateSdkState:payload];
}

// MARK: Unimplemented method

RCT_EXPORT_METHOD(deleteUser:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(disableAdIdTracking:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(disableAndroidIdTracking:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(disableDeviceIdTracking:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(disableInbox:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(enableAdIdTracking:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(enableAndroidIdTracking:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(enableDeviceIdTracking:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(navigateToSettingsAndroid) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(onOrientationChanged) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(passFcmPushPayload:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(passFcmPushToken:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(passPushKitPushToken:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(pushPermissionResponseAndroid:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(requestPushPermissionAndroid) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(setupNotificationChannels) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(updatePushPermissionRequestCountAndroid:(NSString *)payload) {
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

RCT_EXPORT_METHOD(deleteUser:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) { 
    RCTLogInfo(@"Warning: This is an Android only feature.");
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeMoEngageSpecJSI>(params);
}
#endif

@end
