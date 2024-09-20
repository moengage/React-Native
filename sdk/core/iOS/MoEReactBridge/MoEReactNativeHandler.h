//
//  MoEReactBridgeHandler.h
//  Pods
//
//  Created by Rakshitha on 04/03/24.
//


#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>
#import "MoEReactBridge.h"

@interface MoEReactNativeHandler : NSObject
+(instancetype)sharedInstance;

@property (nonatomic, weak) MoEReactBridge *reactBridge;

-(void)setDelegate:(NSString *)identifier;

-(void)initialize:(NSString *)payload;
-(void)setAppStatus:(NSString *)payload;
-(void)trackEvent:(NSString *)payload;
-(void)setUserAttribute:(NSString *)payload;
-(void)setAlias:(NSString *)payload;
-(void)registerForPush;
-(void)showInApp:(NSString *)payload;
-(void)showNudge:(NSString *)payload ;
-(void)getSelfHandledInApp:(NSString *)payload;
-(void)getSelfHandledInApps:(NSString *)payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;
-(void)updateSelfHandledInAppStatus:(NSString *)payload;
-(void)setAppContext:(NSString *)payload;
-(void)resetAppContext:(NSString *)payload;
-(void)logout:(NSString *)payload;
-(void)optOutDataTracking:(NSString *)payload;
-(void)updateSdkState:(NSString *)payload;
-(void)registerForProvisionalPush;
@end
