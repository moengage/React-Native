//
//  MoEngageCardsReactUtil.m
//  ReactNativeMoEngageCards
//
//  Created by Rakshitha on 09/08/23.
//

#import <Foundation/Foundation.h>
#import "MoEngageCardsReactUtil.h"
#import  "MoEngageCardsReactConstants.h"

@implementation MoEngageCardsReactUtil: NSObject

+(NSString*)fetchSyncType:(enum MoEngageCardsSyncEventType)eventType {
    switch (eventType) {
        case MoEngageCardsSyncEventTypePullToRefresh:
            return kPullToRefreshCardsSyncListener;
    
        case MoEngageCardsSyncEventTypeAppOpen:
        case MoEngageCardsSyncEventTypeImmediate: 
            return kCardsSyncListener;
            
        case MoEngageCardsSyncEventTypeInboxOpen:
            return kInboxOpenCardsSyncListener;
        
        default:
            break;
    }
    return  nil;
}

+(void)handleDataToReact:(NSDictionary<NSString *,id> * _Nonnull)cardPayload rejecter:(RCTPromiseRejectBlock)rejecter resolver:(RCTPromiseResolveBlock)resolver {
    NSError *error;
    NSData * jsonData = [NSJSONSerialization dataWithJSONObject:cardPayload options:0 error:&error];
    if (jsonData) {
        NSString *strPayload = [[NSString alloc] initWithData:jsonData  encoding:NSUTF8StringEncoding];
        resolver(strPayload);
    } else {
        rejecter([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription, error);
    }
}

+(NSDictionary*)getJSONRepresentation:(NSString*)string {
    NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *jsonOutput = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    return jsonOutput;
}

@end
