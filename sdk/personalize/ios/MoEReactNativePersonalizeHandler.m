//
//  MoEReactNativePersonalizeHandler.m
//  ReactNativeMoEngagePersonalize
//

#import <Foundation/Foundation.h>
#import "MoEReactNativePersonalizeHandler.h"
#import "ReactNativeMoEngage/MoEngageReactUtils.h"

@import MoEngagePluginPersonalize;

static NSString * const kLogTag = @"[MoEngageReactPersonalize]";

@implementation MoEReactNativePersonalizeHandler : NSObject

+(instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    static MoEReactNativePersonalizeHandler *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEReactNativePersonalizeHandler alloc] init];
    });
    return instance;
}

#pragma mark - Helpers

/// Serializes the bridge response and resolves/rejects the JS promise. If the
/// response carries an `error` key (per the contract), the promise is rejected
/// with the stringified payload. JSON serialization failures reject with PARSE_ERROR.
-(void)resolveResponse:(NSDictionary *)response
              resolver:(RCTPromiseResolveBlock)resolve
              rejecter:(RCTPromiseRejectBlock)reject
                method:(NSString *)method {
    NSError *err;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:&err];
    if (jsonData) {
        NSString *strPayload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        if (response[@"error"] != nil) {
            NSLog(@"%@ %@: rejecting with PERSONALIZE_ERROR — %@", kLogTag, method, response[@"error"]);
            reject(@"PERSONALIZE_ERROR", strPayload, nil);
        } else {
            resolve(strPayload);
        }
    } else {
        NSLog(@"%@ %@: failed to serialize response — %@", kLogTag, method, err);
        reject(@"PARSE_ERROR", @"Failed to serialize response", err);
    }
}

/// Logs and parses the incoming JS payload string into an NSDictionary. Returns
/// nil (and logs) on parse failure so callers can short-circuit safely.
-(NSDictionary *)parsePayload:(NSString *)payload method:(NSString *)method {
    NSDictionary *jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    if (jsonPayload == nil) {
        NSLog(@"%@ %@: failed to parse payload — input: %@", kLogTag, method, payload);
    }
    return jsonPayload;
}

#pragma mark - Fetch APIs

-(void)fetchExperiencesMeta:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSLog(@"%@ fetchExperiencesMeta", kLogTag);
    NSDictionary *jsonPayload = [self parsePayload:payload method:@"fetchExperiencesMeta"];
    if (jsonPayload == nil) {
        reject(@"PARSE_ERROR", @"Failed to parse incoming payload", nil);
        return;
    }
    [[MoEngagePluginPersonalizeBridge sharedInstance] fetchExperiencesMeta:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull response) {
        [self resolveResponse:response resolver:resolve rejecter:reject method:@"fetchExperiencesMeta"];
    }];
}

-(void)fetchExperiences:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSLog(@"%@ fetchExperiences", kLogTag);
    NSDictionary *jsonPayload = [self parsePayload:payload method:@"fetchExperiences"];
    if (jsonPayload == nil) {
        reject(@"PARSE_ERROR", @"Failed to parse incoming payload", nil);
        return;
    }
    [[MoEngagePluginPersonalizeBridge sharedInstance] fetchExperiences:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull response) {
        [self resolveResponse:response resolver:resolve rejecter:reject method:@"fetchExperiences"];
    }];
}

#pragma mark - Experience Tracking

-(void)trackExperienceShown:(NSString *)payload {
    NSLog(@"%@ trackExperienceShown", kLogTag);
    NSDictionary *jsonPayload = [self parsePayload:payload method:@"trackExperienceShown"];
    if (jsonPayload == nil) return;
    [[MoEngagePluginPersonalizeBridge sharedInstance] trackExperienceShown:jsonPayload];
}

-(void)trackExperienceClicked:(NSString *)payload {
    NSLog(@"%@ trackExperienceClicked", kLogTag);
    NSDictionary *jsonPayload = [self parsePayload:payload method:@"trackExperienceClicked"];
    if (jsonPayload == nil) return;
    [[MoEngagePluginPersonalizeBridge sharedInstance] trackExperienceClicked:jsonPayload];
}

#pragma mark - Offering Tracking

-(void)trackOfferingShown:(NSString *)payload {
    NSLog(@"%@ trackOfferingShown", kLogTag);
    NSDictionary *jsonPayload = [self parsePayload:payload method:@"trackOfferingShown"];
    if (jsonPayload == nil) return;
    [[MoEngagePluginPersonalizeBridge sharedInstance] trackOfferingShown:jsonPayload];
}

-(void)trackOfferingClicked:(NSString *)payload {
    NSLog(@"%@ trackOfferingClicked", kLogTag);
    NSDictionary *jsonPayload = [self parsePayload:payload method:@"trackOfferingClicked"];
    if (jsonPayload == nil) return;
    [[MoEngagePluginPersonalizeBridge sharedInstance] trackOfferingClicked:jsonPayload];
}

@end
