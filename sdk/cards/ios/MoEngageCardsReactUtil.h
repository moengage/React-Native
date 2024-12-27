//
//  MoEngageCardsReactUtil.h
//  Pods
//
//  Created by Rakshitha on 09/08/23.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>


@import MoEngagePluginCards;

@interface MoEngageCardsReactUtil : NSObject
+(NSString* _Nullable)fetchSyncType:(enum MoEngageCardsSyncEventType)eventType;
+(void)handleDataToReact:(NSDictionary<NSString *,id> * _Nonnull)cardPayload rejecter:(RCTPromiseRejectBlock _Nullable )rejecter resolver:(RCTPromiseResolveBlock _Nullable )resolver;
+(NSDictionary* _Nullable)getJSONRepresentation:(NSString* _Nullable)string;
@end
