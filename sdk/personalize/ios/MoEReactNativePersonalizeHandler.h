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
-(void)trackExperienceShown:(NSString *)payload;
-(void)trackExperienceClicked:(NSString *)payload;

// Offering Tracking
-(void)trackOfferingShown:(NSString *)payload;
-(void)trackOfferingClicked:(NSString *)payload;

@end
