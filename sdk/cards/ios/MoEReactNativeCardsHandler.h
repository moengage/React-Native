//
//  MoEReactNativeCardsHandler.h
//  Pods
//
//  Created by Rakshitha on 15/03/24.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>

@interface MoEReactNativeCardsHandler : NSObject
+(instancetype)sharedInstance;

@property (nonatomic, weak) RCTEventEmitter *eventEmitter;

-(void)initialize:(NSString*)payload;

-(void)isAllCategoryEnabled:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getCardsCategories:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getCardsInfo:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getCardsForCategory:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;
-(void)fetchCards:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getNewCardsCount:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getUnClickedCardsCount:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;

-(void)refreshCards:(NSString *) payload;
-(void)onCardSectionLoaded:(NSString *) payload;
-(void)onCardSectionUnLoaded:(NSString *) payload;
-(void)cardClicked:(NSString *) payload;
-(void)cardDelivered:(NSString *) payload;
-(void)cardShown:(NSString *) payload;
-(void)deleteCards:(NSString *) payload;
@end
