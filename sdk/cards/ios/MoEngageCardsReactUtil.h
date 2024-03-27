//
//  MoEngageCardsReactUtil.h
//  Pods
//
//  Created by Rakshitha on 09/08/23.
//

#import <Foundation/Foundation.h>


@import MoEngagePluginCards;

@interface MoEngageCardsReactUtil : NSObject
+(NSString* _Nullable)fetchSyncType:(enum MoEngageCardsSyncEventType)eventType;
@end
