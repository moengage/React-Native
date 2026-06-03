//
//  <iosUtilName>.h
//
//  This is a module-level shared util — NOT feature-specific.
//  Filename is <iosUtilName>.h (e.g. MoEngageCardsReactUtil.h for sdk/cards).
//  Add methods to the existing file; never create a new feature-specific util.
//  Real reference: sdk/cards/ios/MoEngageCardsReactUtil.h
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@import MoEngagePlugin<featureNameCamel>;  // needed for the enum type in fetchSyncType:

@interface <iosUtilName> : NSObject

// Maps SDK event type enum → JS event name string.
// Include ONLY for non-core modules (typed enum delegate pattern).
// NOT needed for sdk/core — core's delegate already provides the event name string.
+(NSString* _Nullable)fetchSyncType:(enum MoEngage<featureNameCamel>SyncEventType)eventType;

// Shared resolve/reject helper used by all promise methods.
+(void)handleDataToReact:(NSDictionary<NSString *,id> * _Nonnull)payload
               rejecter:(RCTPromiseRejectBlock _Nullable)rejecter
               resolver:(RCTPromiseResolveBlock _Nullable)resolver;

@end
