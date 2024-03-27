//
//  MoEReactNativeCardsHandler.m
//  ReactNativeMoEngage
//
//  Created by Rakshitha on 15/03/24.
//

#import <Foundation/Foundation.h>
#import "MoEReactNativeCardsHandler.h"
#import "MoEngageReactUtils.h"
#import "MoEngageCardsReactUtil.h"
#import "MoEngageReactConstants.h"

@import MoEngagePluginCards;

@interface MoEReactNativeCardsHandler() <MoEngageCardSyncDelegate>
@end

@implementation MoEReactNativeCardsHandler : NSObject

+(instancetype)sharedInstance{
    static dispatch_once_t onceToken;
    static MoEReactNativeCardsHandler *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEReactNativeCardsHandler alloc] init];
    });
    return instance;
}

-(void)initialize:(NSString*)payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] initialize:jsonPayload];
    [[MoEngagePluginCardsBridge sharedInstance] setAppOpenSyncListener:jsonPayload];
    [[MoEngagePluginCardsBridge sharedInstance] setSyncEventListnerDelegate:self];
}


-(void)isAllCategoryEnabled:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] isAllCategoryEnabled:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        resolve(cardPayload);
    }];
}


-(void)getCardsCategories:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getCardsCategories:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        resolve(cardPayload);
    }];
}


-(void)getCardsInfo:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getCardsInfo:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        resolve(cardPayload);
    }];
}

-(void)getCardsForCategory:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getCardsForCategory:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        resolve(cardPayload);
    }];
}

-(void)fetchCards:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] fetchCards:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        resolve(cardPayload);
    }];
}


-(void)getNewCardsCount:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getNewCardsCount:jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        resolve(cardPayload);
    }];
}


-(void)getUnClickedCardsCount:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] getUnClickedCardsCount: jsonPayload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        resolve(cardPayload);
    }];
}

-(void)refreshCards:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] refreshCards:jsonPayload];
}


-(void)onCardSectionLoaded:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] onCardsSectionLoaded:jsonPayload];
}

-(void)onCardSectionUnLoaded:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] onCardsSectionUnLoaded:jsonPayload];
}

-(void)cardClicked:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] cardClicked:jsonPayload];
}

-(void)cardDelivered:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] cardDelivered:jsonPayload];
}

-(void)cardShown:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] cardShown:jsonPayload];
}

-(void)deleteCards:(NSString *) payload {
    NSDictionary* jsonPayload = [MoEngageReactUtils getJSONRepresentation:payload];
    [[MoEngagePluginCardsBridge sharedInstance] deleteCards:jsonPayload];
}


//- (void)syncCompleteForEventType:(enum MoEngageCardsSyncEventType)eventType withData:(NSDictionary<NSString *,id> *)data {
//
//    NSMutableDictionary* updatedDict = [NSMutableDictionary dictionary];
//    NSString* eventName = [MoEngageCardsReactUtil fetchSyncType:eventType];
//
//    if (hasListeners && eventName && data) {
//        NSError *err;
//        NSData * jsonData = [NSJSONSerialization dataWithJSONObject:data options:0 error:&err];
//        if (jsonData) {
//            NSString* strPayload = [[NSString alloc] initWithData:jsonData  encoding:NSUTF8StringEncoding];
//            updatedDict[kPayload] = strPayload;
////            [self sendEventWithName:eventName body:updatedDict];
//        } else {
//            NSLog(@"Error converting to dictionary to string %@", err.localizedDescription);
//        }
//    }
//}


- (void)syncCompleteForEventType:(enum MoEngageCardsSyncEventType)eventType withData:(NSDictionary<NSString *,id> * _Nonnull)data {
    
    NSMutableDictionary* updatedDict = [NSMutableDictionary dictionary];
    NSString* eventName = [MoEngageCardsReactUtil fetchSyncType:eventType];
    
    if (eventName && data) {
        updatedDict[kPayload] = data;
        [self.eventEmitter sendEventWithName:eventName body:updatedDict];
    }
}

@end
