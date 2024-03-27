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
            return kAppOpenCardsSyncListener;
            
        case MoEngageCardsSyncEventTypeInboxOpen:
            return kInboxOpenCardsSyncListener;
        
        default:
            break;
    }
    return  nil;
}
@end
