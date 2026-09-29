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
#import "MoEReactEventDispatcher.h"

@interface MoEReactBridge : RCTEventEmitter <RCTBridgeModule, MoEReactEventDispatcher>
@end
