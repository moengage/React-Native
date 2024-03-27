//
//  MoEReactNativeHandler.m
//  ReactNativeMoEngage
//
//  Created by Rakshitha on 04/03/24.
//

#import <Foundation/Foundation.h>
#import "MoEReactNativeHandler.h"
#import "MoEngageReactUtils.h"
#import "MoEngageReactConstants.h"

@import MoEngagePluginBase;

@interface MoEReactNativeHandler() <MoEngagePluginBridgeDelegate>
@end

@implementation MoEReactNativeHandler : NSObject

+(instancetype)sharedInstance{
    static dispatch_once_t onceToken;
    static MoEReactNativeHandler *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEReactNativeHandler alloc] init];
    });
    return instance;
}

-(void)initialize:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] pluginInitialized:jsonPayload];
}

#pragma mark- Set AppStatus
-(void)setAppStatus:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] setAppStatus:jsonPayload];
}

#pragma mark - trackEvent

-(void)trackEvent:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] trackEvent:jsonPayload];
}

#pragma mark- User Attribute Methods
-(void)setUserAttribute:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] setUserAttribute:jsonPayload];
}

-(void)setAlias:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] setAlias:jsonPayload];
}

#pragma mark- Push Notifications
-(void)registerForPush {
    [[MoEngagePluginBridge sharedInstance] registerForPush];
}


#pragma mark Show InApp
-(void)showInApp:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] showInApp:jsonPayload];
}

#pragma mark Self handled In App
-(void)getSelfHandledInApp:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] getSelfHandledInApp:jsonPayload];
}

-(void)updateSelfHandledInAppStatus:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] updateSelfHandledImpression:jsonPayload];
}

#pragma mark InApp Contexts

-(void)setAppContext:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] setInAppContext:jsonPayload];
}

-(void)resetAppContext:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] resetInAppContext:jsonPayload];
}

#pragma mark- Reset User
-(void)logout:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] resetUser:jsonPayload];
}

-(void)optOutDataTracking:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] optOutDataTracking:jsonPayload];
}

-(void)showNudge:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] showNudge:jsonPayload];
}

-(void)updateSdkState:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] updateSDKState:jsonPayload];
}

- (void)sendMessageWithEvent:(NSString *)event message:(NSDictionary<NSString *,id> *)message {
    NSMutableDictionary* updatedDict = [NSMutableDictionary dictionary];

    if (message) {
            updatedDict[kPayload] = message;
    }
    [self.eventEmitter sendEventWithName:event body:updatedDict];
}


@end
