//
//  MoEReactNativeRecommendationsHandler.m
//  ReactNativeMoEngageRecommendations
//

#import <Foundation/Foundation.h>
#import "MoEReactNativeRecommendationsHandler.h"
#import "MoEngageReactUtils.h"

@import MoEngagePluginRecommendations;

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
            reject(@"RECOMMENDATIONS_ERROR", strPayload, nil);
        } else {
            resolve(strPayload);
        }
    } else {
        reject(@"PARSE_ERROR", @"Failed to serialize response", err);
    }
}

#pragma mark - Fetch APIs

-(void)fetchRecommendations:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary *jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    if (jsonPayload == nil) {
        reject(@"PARSE_ERROR", @"Failed to parse incoming payload", nil);
        return;
    }
    [[MoEngagePluginRecommendationsBridge sharedInstance] fetchRecommendations:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull response) {
        [self resolveResponse:response resolver:resolve rejecter:reject method:@"fetchRecommendations"];
    }];
}

@end
