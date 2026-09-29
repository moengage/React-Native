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

#pragma mark - Fetch APIs

/// Resolves with the stringified plugin-base response. A failure response
/// (`{ accountMeta, data: { reason, message } }`) rejects with `RECOMMENDATIONS_ERROR` and the
/// stringified response as the message, as in the personalize module.
-(void)fetchRecommendations:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary *jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginRecommendationsBridge sharedInstance] fetchRecommendations:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull response) {
        NSError *err;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:&err];
        NSString *strPayload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSDictionary *data = response[@"data"];
        if ([data isKindOfClass:[NSDictionary class]] && data[@"reason"] != nil) {
            reject(@"RECOMMENDATIONS_ERROR", strPayload, nil);
            return;
        }
        resolve(strPayload);
    }];
}

@end
