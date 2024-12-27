//
//  MoEReactNativeCardsHandler.m
//  ReactNativeMoEngage
//
//  Created by Rakshitha on 15/03/24.
//

#import <Foundation/Foundation.h>
#import "MoEReactNativeCardsHandler.h"
#import "MoEngageCardsReactUtil.h"
#import "MoEngageCardsReactConstants.h"

@import MoEngagePluginCards;

@interface MoEReactNativeCardsHandler() <MoEngageCardSyncDelegate>
@end

@implementation MoEReactNativeCardsHandler: NSObject

+(instancetype)sharedInstance{
    static dispatch_once_t onceToken;
    static MoEReactNativeCardsHandler *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEReactNativeCardsHandler alloc] init];
    });
    return instance;
}

#pragma mark- Initialize methods
-(void)initialize:(NSString*)payload {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] initialize:jsonPayload];
    [[MoEngagePluginCardsBridge sharedInstance] setSyncListener:jsonPayload];
    [[MoEngagePluginCardsBridge sharedInstance] setSyncEventListnerDelegate:self];
}

#pragma mark- Callback methods
-(void)isAllCategoryEnabled:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] isAllCategoryEnabled:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:reject resolver:resolve];
    }];
}

-(void)getCardsCategories:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getCardsCategories:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:reject resolver:resolve];
    }];
}

-(void)getCardsInfo:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getCardsInfo:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:reject resolver:resolve];
    }];
}

-(void)getCardsForCategory:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getCardsForCategory:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:reject resolver:resolve];
    }];
}

-(void)fetchCards:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] fetchCards:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:reject resolver:resolve];
    }];
}

-(void)getNewCardsCount:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getNewCardsCount:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:reject resolver:resolve];
    }];
}

-(void)getUnClickedCardsCount:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getUnClickedCardsCount: jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:reject resolver:resolve];
    }];
}

#pragma mark- Listener methods
-(void)refreshCards:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] refreshCards:jsonPayload];
}

-(void)onCardSectionLoaded:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] onCardsSectionLoaded:jsonPayload];
}

-(void)onCardSectionUnLoaded:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] onCardsSectionUnLoaded:jsonPayload];
}

#pragma mark- Stats methods
-(void)cardClicked:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] cardClicked:jsonPayload];
}

-(void)cardDelivered:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] cardDelivered:jsonPayload];
}

-(void)cardShown:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] cardShown:jsonPayload];
}

-(void)deleteCards:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageCardsReactUtil getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] deleteCards:jsonPayload];
}

// MARK: Delegate method
- (void)syncCompleteForEventType:(enum MoEngageCardsSyncEventType)eventType withData:(NSDictionary<NSString *,id> * _Nonnull)data {
    NSMutableDictionary* updatedDict = [NSMutableDictionary dictionary];
    NSString* eventName = [MoEngageCardsReactUtil fetchSyncType:eventType];
    
    if (eventName && data) {
        NSError *err;
        NSData * jsonData = [NSJSONSerialization dataWithJSONObject:data options:0 error:&err];
        if (jsonData) {
            NSString* strPayload = [[NSString alloc] initWithData:jsonData  encoding:NSUTF8StringEncoding];
            updatedDict[kPayload] = strPayload;
            [self.eventEmitter sendEventWithName:eventName body:updatedDict];
        } else {
            NSLog(@"Error converting to dictionary to string %@", err.localizedDescription);
        }
    }
}

@end
