//
//  <iosUtilName>.m
//
//  This is a module-level shared util — NOT feature-specific.
//  Add methods to the existing file; never create a new feature-specific util.
//  Real reference: sdk/cards/ios/MoEngageCardsReactUtil.m
//

#import <Foundation/Foundation.h>
#import "<iosUtilName>.h"
#import "MoEngage<featureNameCamel>ReactConstants.h"

@implementation <iosUtilName>: NSObject

// Maps SDK event type enum → JS event name constant string.
// Add one case per nativeToHybrid event type enum value.
// Omit entirely for sdk/core (core uses generic string delegate — no enum mapping needed).
+(NSString*)fetchSyncType:(enum MoEngage<featureNameCamel>SyncEventType)eventType {
    switch (eventType) {
        case MoEngage<featureNameCamel>SyncEventTypeDefault:
            return kOn<featureNameCamel>Event;
        // add more cases per nativeToHybrid event type
        default:
            break;
    }
    return nil;
}

// Shared helper used by all promise methods to serialize response and resolve/reject.
+(void)handleDataToReact:(NSDictionary<NSString *,id> * _Nonnull)payload
               rejecter:(RCTPromiseRejectBlock)rejecter
               resolver:(RCTPromiseResolveBlock)resolver {
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:payload options:0 error:&error];
    if (jsonData) {
        NSString *strPayload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        resolver(strPayload);
    } else {
        rejecter([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription, error);
    }
}

@end
