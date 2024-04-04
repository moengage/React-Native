//
//  MoEReactBridges.h
//  MoEngage
//
//  Created by Chengappa C D on 11/11/16.
//  Copyright © 2016 MoEngage. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngageSpec/NativeMoEngageSpec.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
@interface MoEReactBridge : RCTEventEmitter <NativeMoEngageSpec>
-(void)sendEventWithName:(NSDictionary *)payloadDict;
@end
#else
@interface MoEReactBridge : RCTEventEmitter <RCTBridgeModule>
-(void)sendEventWithName:(NSDictionary *)payloadDict;
@end
#endif

