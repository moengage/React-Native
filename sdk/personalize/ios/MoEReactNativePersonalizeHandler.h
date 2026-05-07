//
//  MoEReactNativePersonalizeHandler.h
//  ReactNativeMoEngagePersonalize
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

@interface MoEReactNativePersonalizeHandler : NSObject

+(instancetype)sharedInstance;

// Fetch APIs
-(void)fetchExperiencesMeta:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)fetchExperiences:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

// Experience Tracking
-(void)experiencesShown:(NSString *)payload;
-(void)experienceClicked:(NSString *)payload;

// Offering Tracking
-(void)offeringsShown:(NSString *)payload;
-(void)offeringClicked:(NSString *)payload;

@end
