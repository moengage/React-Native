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
@import MoEngagePluginBase;
@interface MoEReactBridge()
@end

@implementation MoEReactBridge

{
  bool hasListeners;
  NSMutableArray *delayedEvents;
}

- (instancetype)init
{
    if (self = [super init]) {
        if (delayedEvents == nil)
            delayedEvents = [NSMutableArray array];
    }
    return self;
}

+ (id)allocWithZone:(NSZone *)zone {
    static MoEReactBridge *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

+ (BOOL)requiresMainQueueSetup {
    return true;
}

#pragma mark- Observers
// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    [self flushDelayedEvents];

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

RCT_EXPORT_MODULE();

#pragma mark- Initialization Method

RCT_EXPORT_METHOD(initialize:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] pluginInitialized:payload];
}

#pragma mark- Set AppStatus

RCT_EXPORT_METHOD(setAppStatus:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] setAppStatus:payload];
}

#pragma mark - trackEvent

RCT_EXPORT_METHOD(trackEventWithProperties:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] trackEvent:payload];
}

#pragma mark- User Attribute Methods
RCT_EXPORT_METHOD(setUserAttribute:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] setUserAttribute:payload];
}

RCT_EXPORT_METHOD(setAlias:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] setAlias:payload];
}

#pragma mark- Push Notifications
RCT_EXPORT_METHOD(registerForPushNotification)
{
    [[MoEngagePluginBridge sharedInstance] registerForPush];
}

#pragma mark Show InApp

RCT_EXPORT_METHOD(showInApp:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] showInApp:payload];
}

RCT_EXPORT_METHOD(showNudge:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] showNudge: payload];
}

#pragma mark Self handled In App

RCT_EXPORT_METHOD(getSelfHandledInApp:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] getSelfHandledInApp:payload];
}

RCT_EXPORT_METHOD(updateSelfHandledInAppStatusWithPayload:(NSDictionary *)payload) {
    [[MoEngagePluginBridge sharedInstance] updateSelfHandledImpression:payload];
}

#pragma mark InApp Contexts

RCT_EXPORT_METHOD(setAppContext:(nonnull NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] setInAppContext:payload];
}

RCT_EXPORT_METHOD(resetAppContext:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] resetInAppContext:payload];
}

#pragma mark- Reset User

RCT_EXPORT_METHOD(logout:(NSDictionary *)payload)
{
    [[MoEngagePluginBridge sharedInstance] resetUser:payload];
}

RCT_EXPORT_METHOD(validateSDKVersion:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    if ([[MoEngagePluginBridge sharedInstance] validateSDKVersion]) {
        resolve([NSNumber numberWithBool:YES]);
    } else {
        reject(NULL, @"MoEngage: Unsupported SDK version", NULL);
    }
}

#pragma mark- Opt out Tracking
RCT_EXPORT_METHOD(optOutTracking:(nonnull NSDictionary *)payload) {
    [[MoEngagePluginBridge sharedInstance] optOutDataTracking:payload];
}

#pragma mark- Update SDK State
RCT_EXPORT_METHOD(updateSDKState:(nonnull NSDictionary *)payload) {
    [[MoEngagePluginBridge sharedInstance] updateSDKState:payload];
}

@end
