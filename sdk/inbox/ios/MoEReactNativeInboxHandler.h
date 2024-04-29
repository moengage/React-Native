//
//  MoEReactNativeInboxHandler.h
//  Pods
//
//  Created by Rakshitha on 14/03/24.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>


@interface MoEReactNativeInboxHandler: NSObject
+(instancetype)sharedInstance;

-(void)getInboxMessages:(NSString *)payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getUnClickedMessageCount:(NSString *)payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject;
-(void)trackInboxClick:(NSString *)payload;
-(void)deleteInboxEntry:(NSString *)payload;
@end

