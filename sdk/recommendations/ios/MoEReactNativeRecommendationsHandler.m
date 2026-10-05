//
//  MoEReactNativeRecommendationsHandler.m
//  ReactNativeMoEngageRecommendations
//

#import <Foundation/Foundation.h>
#import "MoEReactNativeRecommendationsHandler.h"
#import "MoEngageReactUtils.h"

@import MoEngagePluginRecommendations;

static NSString * const kLogTag = @"[MoEngageReactRecommendations]";

@implementation MoEReactNativeRecommendationsHandler : NSObject

+(instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    static MoEReactNativeRecommendationsHandler *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEReactNativeRecommendationsHandler alloc] init];
    });
    return instance;
}

#pragma mark - Helpers

/// Serializes the bridge response and resolves/rejects the JS promise. A failure response
/// (`{ accountMeta, data: { reason, message } }`) rejects with `RECOMMENDATIONS_ERROR` and the
/// stringified response as the message. A response that can't be serialized rejects with
/// `PARSE_ERROR` — `isValidJSONObject` is checked first because `dataWithJSONObject` raises an
/// exception, rather than returning nil, for such an object.
-(void)resolveResponse:(NSDictionary *)response
              resolver:(RCTPromiseResolveBlock)resolve
              rejecter:(RCTPromiseRejectBlock)reject
                method:(NSString *)method {
    NSError *err;
    NSData *jsonData = [NSJSONSerialization isValidJSONObject:response]
        ? [NSJSONSerialization dataWithJSONObject:response options:0 error:&err]
        : nil;
    if (jsonData == nil) {
        NSLog(@"%@ %@: failed to serialize response — %@", kLogTag, method, err);
        reject(@"PARSE_ERROR", @"Failed to serialize response", err);
        return;
    }
    NSString *strPayload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSDictionary *data = response[@"data"];
    if ([data isKindOfClass:[NSDictionary class]] && data[@"reason"] != nil) {
        NSLog(@"%@ %@: rejecting with RECOMMENDATIONS_ERROR — %@", kLogTag, method, data[@"reason"]);
        reject(@"RECOMMENDATIONS_ERROR", strPayload, nil);
        return;
    }
    resolve(strPayload);
}

/// Logs and parses the incoming JS payload string into an NSDictionary. Returns
/// nil (and logs) when it doesn't parse to a JSON object, so callers can short-circuit safely.
-(NSDictionary *)parsePayload:(NSString *)payload method:(NSString *)method {
    id jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    if (![jsonPayload isKindOfClass:[NSDictionary class]]) {
        NSLog(@"%@ %@: failed to parse payload — input: %@", kLogTag, method, payload);
        return nil;
    }
    return jsonPayload;
}

#pragma mark - Fetch APIs

-(void)fetchRecommendations:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSLog(@"%@ fetchRecommendations", kLogTag);
    NSDictionary *jsonPayload = [self parsePayload:payload method:@"fetchRecommendations"];
    if (jsonPayload == nil) {
        reject(@"PARSE_ERROR", @"Failed to parse incoming payload", nil);
        return;
    }
    [[MoEngagePluginRecommendationsBridge sharedInstance] fetchRecommendations:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull response) {
        [self resolveResponse:response resolver:resolve rejecter:reject method:@"fetchRecommendations"];
    }];
}

@end
