//
//  MoEReactNativeInboxHandler.m
//  ReactNativeMoEngageInbox
//
//  Created by Rakshitha on 14/03/24.
//

#import <Foundation/Foundation.h>
#import "MoEReactNativeInboxHandler.h"
#import "ReactNativeMoEngage/MoEngageReactUtils.h"

@import MoEngagePluginInbox;


@implementation MoEReactNativeInboxHandler : NSObject

+(instancetype)sharedInstance{
    static dispatch_once_t onceToken;
    static MoEReactNativeInboxHandler *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEReactNativeInboxHandler alloc] init];
    });
    return instance;
}

-(void)getUnClickedMessageCount:(NSString *)payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginInboxBridge sharedInstance] getUnreadMessageCount:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull countPayload) {
        NSError *err;
        NSData * jsonData = [NSJSONSerialization dataWithJSONObject:countPayload options:0 error:&err];
        if (jsonData) {
            NSString *strPayload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            resolve(strPayload);
        } else {
            reject(@"Error", @"Error in fetching inbox messages", [NSError errorWithDomain:@"" code:400 userInfo:@{@"Error reason": @"Error in fetching response"}]);
        }
    }];
}

-(void)getInboxMessages:(NSString *)payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginInboxBridge sharedInstance] getInboxMessages: jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull response) {
        NSError *err;
        NSData * jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:&err];
        if (jsonData) {
            NSString *strPayload = [[NSString alloc] initWithData:jsonData  encoding:NSUTF8StringEncoding];
            resolve(strPayload);
        } else {
            reject(@"Error", @"Error in fetching inbox messages", [NSError errorWithDomain:@"" code:400 userInfo:@{@"Error reason": @"Error in fetching response"}]);
        }
    }];
}

-(void)trackInboxClick:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginInboxBridge sharedInstance] trackInboxClick:jsonPayload];
}

-(void)deleteInboxEntry:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginInboxBridge sharedInstance] deleteInboxEntry:jsonPayload];
}

@end
