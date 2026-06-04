//
//  MoEReactBridgeHandler.h
//  Pods
//
//  Created by Rakshitha on 04/03/24.
//


#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

// Defined locally to avoid importing non-modular React headers in this public
// framework header, which breaks builds using USE_FRAMEWORKS=static.
// These match the typedefs in <React/RCTBridgeMethod.h>.
#ifndef RCTPromiseResolveBlock_defined
#define RCTPromiseResolveBlock_defined
typedef void (^RCTPromiseResolveBlock)(id result);
#endif
#ifndef RCTPromiseRejectBlock_defined
#define RCTPromiseRejectBlock_defined
typedef void (^RCTPromiseRejectBlock)(NSString *code, NSString *message, NSError *error);
#endif

@protocol MoEReactEventDispatcher;

@interface MoEReactNativeHandler : NSObject
+(instancetype)sharedInstance;

@property (nonatomic, weak) id<MoEReactEventDispatcher> delegate;

-(void)setPluginBridgeDelegate:(NSString *)identifier;

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
-(void)identifyUser:(NSString *)payload;
-(void)getUserIdentities:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
@end
