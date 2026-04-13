//
//  MoEReactNativePersonalizeHandler.m
//  ReactNativeMoEngagePersonalize
//

#import <Foundation/Foundation.h>
#import "MoEReactNativePersonalizeHandler.h"
#import "ReactNativeMoEngage/MoEngageReactUtils.h"

@import MoEngagePluginPersonalize;

@implementation MoEReactNativePersonalizeHandler : NSObject

+(instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    static MoEReactNativePersonalizeHandler *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEReactNativePersonalizeHandler alloc] init];
    });
    return instance;
}

#pragma mark - Fetch APIs

-(void)fetchExperiencesMeta:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginPersonalizeBridge sharedInstance] fetchExperiencesMeta:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull response) {
        NSError *err;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:&err];
        if (jsonData) {
            NSString *strPayload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            if (response[@"error"] != nil) {
                reject(@"PERSONALIZE_ERROR", strPayload, nil);
            } else {
                resolve(strPayload);
            }
        } else {
            reject(@"PARSE_ERROR", @"Failed to serialize response", err);
        }
    }];
}

-(void)fetchExperiences:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginPersonalizeBridge sharedInstance] fetchExperiences:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull response) {
        NSError *err;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:&err];
        if (jsonData) {
            NSString *strPayload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            if (response[@"error"] != nil) {
                reject(@"PERSONALIZE_ERROR", strPayload, nil);
            } else {
                resolve(strPayload);
            }
        } else {
            reject(@"PARSE_ERROR", @"Failed to serialize response", err);
        }
    }];
}

#pragma mark - Experience Tracking

-(void)trackExperienceShown:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginPersonalizeBridge sharedInstance] trackExperienceShown:jsonPayload];
}

-(void)trackExperienceClicked:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginPersonalizeBridge sharedInstance] trackExperienceClicked:jsonPayload];
}

#pragma mark - Offering Tracking

-(void)trackOfferingShown:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginPersonalizeBridge sharedInstance] trackOfferingShown:jsonPayload];
}

-(void)trackOfferingClicked:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginPersonalizeBridge sharedInstance] trackOfferingClicked:jsonPayload];
}

@end
