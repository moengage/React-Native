//
//  MoEReactNativeRecommendationsHandler.h
//  ReactNativeMoEngageRecommendations
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface MoEReactNativeRecommendationsHandler : NSObject

+(instancetype)sharedInstance;

// Fetch APIs
-(void)fetchRecommendations:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

@end
