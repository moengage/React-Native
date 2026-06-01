//
//  MoEReactNative<featureNameCamel>Handler.m
//
//  Replace <featureNameCamel> with PascalCase feature name (e.g. Cards).
//  Replace <iosPluginBridge> with resolved iosPluginBridge (e.g. MoEngagePluginCardsBridge).
//  Replace <iosDelegateName> with resolved iosDelegateName (e.g. MoEngageCardSyncDelegate).
//  Replace <iosUtilName> with resolved iosUtilName (e.g. MoEngageCardsReactUtil).
//  Real reference: sdk/cards/ios/MoEReactNativeCardsHandler.m
//

#import <Foundation/Foundation.h>
#import "MoEReactNative<featureNameCamel>Handler.h"
#import "MoEngageReactUtils.h"
#import "MoEngage<featureNameCamel>ReactConstants.h"
#import "<iosUtilName>.h"  // omit if no promise or event methods

@import MoEngagePlugin<featureNameCamel>;  // replace with actual plugin-base module import

// Include delegate conformance ONLY if event methods exist:
@interface MoEReactNative<featureNameCamel>Handler() <<iosDelegateName>>
@end

@implementation MoEReactNative<featureNameCamel>Handler: NSObject

+(instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    static MoEReactNative<featureNameCamel>Handler *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEReactNative<featureNameCamel>Handler alloc] init];
    });
    return instance;
}

#pragma mark - Initialize
// Include ONLY if event methods exist. Registers the handler as the sync delegate.
// NOTE: verify the exact setSyncDelegate method name against the plugin-base header.
-(void)initialize:(NSString *)payload {
    NSDictionary *jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[<iosPluginBridge> sharedInstance] initialize:jsonPayload];
    [[<iosPluginBridge> sharedInstance] setSyncEventListnerDelegate:self];
}

#pragma mark - Fire-and-forget methods
// Pattern: parse payload → call plugin-base method → no return
-(void)<methodName>:(NSString *)payload {
    NSDictionary *jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[<iosPluginBridge> sharedInstance] <methodName>:jsonPayload];
}

#pragma mark - Promise methods
// Pattern: parse payload → call plugin-base completionHandler → resolve/reject via Util
-(void)<methodName>:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary *jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[<iosPluginBridge> sharedInstance] <methodName>:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull responsePayload) {
        [<iosUtilName> handleDataToReact:responsePayload rejecter:reject resolver:resolve];
    }];
}

#pragma mark - Delegate method — typed enum pattern (non-core modules e.g. cards, geofence, inbox)
// The delegate provides a typed enum for the event type.
// Use <iosUtilName> fetchSyncType: to map enum → event name string.
// NOTE: verify the exact delegate method signature against the plugin-base header.
- (void)syncCompleteForEventType:(enum MoEngage<featureNameCamel>SyncEventType)eventType withData:(NSDictionary<NSString *,id> * _Nonnull)data {
    NSMutableDictionary *updatedDict = [NSMutableDictionary dictionary];
    NSString *eventName = [<iosUtilName> fetchSyncType:eventType];

    if (eventName && data) {
        NSError *err;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:data options:0 error:&err];
        if (jsonData) {
            NSString *strPayload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            updatedDict[kPayload] = strPayload;
            [self.eventEmitter sendEventWithName:eventName body:updatedDict];
        } else {
            NSLog(@"Error converting dictionary to string %@", err.localizedDescription);
        }
    }
}

// ALTERNATIVELY — Delegate method for sdk/core (MoEngagePluginBridgeDelegate)
// The event name is already provided as a plain NSString — no fetchSyncType: needed.
//
// - (void)sendMessageWithEvent:(NSString *)event message:(NSDictionary<NSString *,id> *)message {
//     [self.eventEmitter sendEventWithName:event body:message];
// }

@end
