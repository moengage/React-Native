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

-(void)setDelegate:(NSString *)identifier {
    [[MoEngagePluginBridge sharedInstance] setPluginBridgeDelegate:self identifier:identifier];
}

#pragma mark- Initialize methods

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

-(void)registerForProvisionalPush {
    if (@available(iOS 12, *)) {
        [[MoEngagePluginBridge sharedInstance] registerForProvisionalPush];
    } else {
        NSLog(@"registerForProvisionalPush is not available below iOS 12.");
    }
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

-(void)getSelfHandledInApps:(NSString *)payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginBridge sharedInstance] getSelfHandledInApps:jsonPayload completionBlock:^(NSDictionary<NSString *,id> * _Nonnull campaignPayload) {
        NSError *err;
        NSData * jsonData = [NSJSONSerialization dataWithJSONObject:campaignPayload options:0 error:&err];
        if (jsonData) {
            NSString *strPayload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            resolve(strPayload);
        } else {
            reject(@"Error", @"Error in parsing Self Handled Campaign Payload", [NSError errorWithDomain:@"" code:400 userInfo:@{@"Error reason": @"Error in parsing Self Handled Campaign Payload"}]);
        }
    }];
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

#pragma mark- Delegate Method
- (void)sendMessageWithEvent:(NSString *)event message:(NSDictionary<NSString *,id> *)message {
    NSMutableDictionary* updatedDict = [NSMutableDictionary dictionary];
    
    if (message) {
        NSError *err;
        NSData * jsonData = [NSJSONSerialization dataWithJSONObject:message options:0 error:&err];
        if (jsonData) {
            NSString* strPayload = [[NSString alloc] initWithData:jsonData  encoding:NSUTF8StringEncoding];
            updatedDict[kPayload] = strPayload;
        } else {
            NSLog(@"Error converting to dictionary to string %@", err.localizedDescription);
        }
    }
    
    NSDictionary* userInfo = @{kEventName:event,kPayloadDict:updatedDict};
    [self.reactBridge sendEventWithName:userInfo];
}

@end
