//
//  MoEReactNative<featureNameCamel>Handler.h
//
//  Replace <featureNameCamel> with the PascalCase feature name (e.g. Cards).
//  Real reference: sdk/cards/ios/MoEReactNativeCardsHandler.h
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>

@interface MoEReactNative<featureNameCamel>Handler : NSObject
+(instancetype)sharedInstance;

// Include eventEmitter property ONLY if event methods exist:
@property (nonatomic, weak) RCTEventEmitter *eventEmitter;

// Initialize — include ONLY if event methods exist:
-(void)initialize:(NSString *)payload;

// FIRE-AND-FORGET methods:
-(void)<methodName>:(NSString *)payload;

// PROMISE methods:
-(void)<methodName>:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

@end
